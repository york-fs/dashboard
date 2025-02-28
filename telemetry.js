// telemetry.js - sik radio telemetry implementation
class TelemetryRadio {
    constructor() {
        this.port = null;
        this.reader = null;
        this.writer = null;
        this.isConnected = false;
        this.decoder = new TextDecoder();
        this.encoder = new TextEncoder();
        this.baudRate = 57600; // sik radios typically use 57600 baud
        this.debugMode = true;
        this.readLoopActive = false;
        this.connectionTimeout = null;
        this.radioParameters = {}; // store radio parameters
        
        this.subscribers = {
            telemetry: new Set(),
            status: new Set(),
            raw: new Set()
        };
        
        // initialize listeners for button
        this.initEventListeners();
    }
    
    initEventListeners() {
        const telemetryButton = document.getElementById('connect-telemetry');
        if (telemetryButton) {
            telemetryButton.addEventListener('click', async () => {
                if (!this.isConnected) {
                    await this.connect();
                } else {
                    await this.disconnect();
                }
            });
        }
    }
    
    // event subscription methods
    subscribe(dataType, callback) {
        if (this.subscribers[dataType]) {
            this.subscribers[dataType].add(callback);
            return () => this.unsubscribe(dataType, callback);
        }
        return () => {};
    }

    unsubscribe(dataType, callback) {
        if (this.subscribers[dataType]) {
            this.subscribers[dataType].delete(callback);
        }
    }

    notifySubscribers(dataType, data) {
        if (this.subscribers[dataType]) {
            this.subscribers[dataType].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${dataType} telemetry subscriber:`, error);
                }
            });
        }
    }
    
    // connect to telemetry radio
    async connect() {
        try {
            this.port = await navigator.serial.requestPort({
                // optional filters for silabs usb adaptors or ftdi chips often used with telemetry radios
                filters: [
                    { usbVendorId: 0x10c4 }, // silabs cp210x
                    { usbVendorId: 0x0403 }  // ftdi
                ]
            });
            
            await this.port.open({ baudRate: this.baudRate });
            
            const portInfo = this.port.getInfo();
            console.log('Connected to telemetry radio:', portInfo);
            
            this.isConnected = true;
            this.updateConnectionStatus(true, `Connected to telemetry radio`);
            
            // start reading data
            this.startReading();
            
            // get radio parameters after connecting
            setTimeout(() => {
                this.getRadioParameters();
            }, 1000);
            
        } catch (error) {
            console.error('Telemetry connection failed:', error);
            this.updateConnectionStatus(false, 'Telemetry connection failed');
        }
    }
    
    async disconnect() {
        if (this.port) {
            this.readLoopActive = false;
            try {
                await this.port.close();
            } catch (error) {
                console.error('Error closing telemetry port:', error);
            }
            this.port = null;
        }
        
        this.isConnected = false;
        this.updateConnectionStatus(false);
    }
    
    // start reading data from the radio
    async startReading() {
        this.readLoopActive = true;
        while (this.port && this.readLoopActive && this.isConnected) {
            try {
                const reader = this.port.readable.getReader();
                
                try {
                    while (true) {
                        const { value, done } = await reader.read();
                        if (done || !this.readLoopActive) {
                            break;
                        }
                        // process the received data
                        const text = this.decoder.decode(value);
                        this.handleReceivedData(text);
                    }
                } catch (error) {
                    console.error('Error while reading from telemetry radio:', error);
                } finally {
                    reader.releaseLock();
                    if (!this.readLoopActive) break;
                }
            } catch (error) {
                console.error('Failed to read from telemetry port:', error);
                await this.disconnect();
                break;
            }
        }
    }
    
    // send at command to the radio
    async sendATCommand(command, waitForResponse = true) {
        if (!this.isConnected) {
            console.error('Not connected to telemetry radio');
            return null;
        }
        
        try {
            const writer = this.port.writable.getWriter();
            try {
                // prepend "at" if not already included
                if (!command.startsWith('AT') && command !== '+++') {
                    command = 'AT' + command;
                }
                
                // add cr if needed
                if (!command.endsWith('\r') && command !== '+++') {
                    command += '\r';
                }
                
                await writer.write(this.encoder.encode(command));
                
                if (this.debugMode) {
                    console.log(`Telemetry command sent: ${command}`);
                }
                
                // for commands like "+++", wait for response
                if (waitForResponse && command === '+++') {
                    return new Promise(resolve => {
                        const timeoutId = setTimeout(() => {
                            resolve(null); // resolve with null on timeout
                        }, 3000);
                        
                        const responseHandler = (data) => {
                            if (data.includes('OK')) {
                                clearTimeout(timeoutId);
                                this.unsubscribe('raw', responseHandler);
                                resolve(data);
                            }
                        };
                        
                        this.subscribe('raw', responseHandler);
                    });
                }
                
                return true;
            } finally {
                writer.releaseLock();
            }
        } catch (error) {
            console.error('Error sending AT command:', error);
            return null;
        }
    }
    
    // send data (non-at command) to the radio
    async sendData(data) {
        if (!this.isConnected) {
            console.error('Not connected to telemetry radio');
            return false;
        }
        
        try {
            const writer = this.port.writable.getWriter();
            try {
                await writer.write(this.encoder.encode(data));
                
                if (this.debugMode) {
                    console.log('Telemetry data sent:', data);
                }
                
                return true;
            } finally {
                writer.releaseLock();
            }
        } catch (error) {
            console.error('Error sending telemetry data:', error);
            return false;
        }
    }
    
    // handle data received from the radio
    handleReceivedData(data) {
        if (this.debugMode) {
            console.log('Raw telemetry data received:', data);
        }
        
        // notify raw data subscribers
        this.notifySubscribers('raw', data);
        
        // check for at command responses
        if (data.includes('OK') || data.includes('ERROR')) {
            // this is likely a response to an at command
            this.notifySubscribers('status', {
                type: 'command_response',
                data: data
            });
            
            // update radio parameters if this is a parameter response
            if (data.includes('S')) {
                this.parseParameterResponse(data);
            }
        } else if (data.includes('RSSI:')) {
            // this is an rssi report
            this.notifySubscribers('status', {
                type: 'rssi',
                data: this.parseRSSI(data)
            });
        } else {
            // this is likely telemetry data
            try {
                // try to parse as json
                const parsedData = JSON.parse(data);
                this.notifySubscribers('telemetry', parsedData);
            } catch (e) {
                // not json, could be binary data or other format
                // just notify with the raw data
                this.notifySubscribers('telemetry', {
                    type: 'unknown',
                    rawData: data
                });
            }
        }
        
        // update dashboard if needed
        if (window.dashboardApp) {
            window.dashboardApp.updateTelemetryData(data);
        }
    }
    
    // get radio parameters 
    async getRadioParameters() {
        if (!this.isConnected) return;
        
        // enter command mode
        const cmdModeResult = await this.sendATCommand('+++', true);
        if (!cmdModeResult || !cmdModeResult.includes('OK')) {
            console.error('Failed to enter command mode');
            return;
        }
        
        // get firmware version
        await this.sendATCommand('I1');
        
        // get hardware version/board id
        await this.sendATCommand('I2');
        
        // get radio parameters
        await this.sendATCommand('I5');
        
        // get rssi
        await this.sendATCommand('I7');
        
        // exit command mode
        await this.sendATCommand('O');
    }
    
    // set radio parameter
    async setRadioParameter(param, value) {
        if (!this.isConnected) return false;
        
        // enter command mode
        const cmdModeResult = await this.sendATCommand('+++', true);
        if (!cmdModeResult || !cmdModeResult.includes('OK')) {
            console.error('Failed to enter command mode');
            return false;
        }
        
        // set parameter
        const result = await this.sendATCommand(`S${param}=${value}`);
        
        // write to flash
        await this.sendATCommand('&W');
        
        // exit command mode
        await this.sendATCommand('O');
        
        return result;
    }
    
    // parse parameter response
    parseParameterResponse(data) {
        const lines = data.trim().split('\n');
        for (const line of lines) {
            const match = line.match(/S(\d+)=(\d+)/);
            if (match) {
                const [, param, value] = match;
                this.radioParameters[param] = parseInt(value);
            }
        }
        
        // notify about updated parameters
        this.notifySubscribers('status', {
            type: 'parameters',
            parameters: this.radioParameters
        });
    }
    
    // parse rssi data
    parseRSSI(data) {
        const match = data.match(/RSSI: (\-?\d+)/);
        if (match) {
            return parseInt(match[1]);
        }
        return null;
    }
    
    // update connection status display
    updateConnectionStatus(connected, details = '') {
        const statusElement = document.getElementById('connection-status');
        const connectButton = document.getElementById('connect-telemetry');
        
        if (statusElement) {
            statusElement.textContent = connected ? 
                (details || 'Telemetry Connected') : 
                'Disconnected';
            statusElement.style.color = connected ? '#4CAF50' : '#888';
        }
        
        if (connectButton) {
            connectButton.textContent = connected ? 'Disconnect Telemetry' : 'Connect Telemetry';
        }
    }
    
    // get human-readable description of radio parameters
    getParameterDescription(param) {
        const descriptions = {
            '0': 'Format version',
            '1': 'Serial speed',
            '2': 'Air speed',
            '3': 'NetID',
            '4': 'Tx Power',
            '5': 'ECC',
            '6': 'Mavlink',
            '7': 'OPPRESEND',
            '8': 'MIN_FREQ',
            '9': 'MAX_FREQ',
            '10': 'NUM_CHANNELS',
            '11': 'DUTY_CYCLE',
            '12': 'LBT_RSSI',
            '13': 'MANCHESTER',
            '14': 'RTSCTS',
            '15': 'NODEID',
            '16': 'NODEDESTINATION',
            '17': 'SYNCANY',
            '18': 'NODECOUNT'
        };
        
        return descriptions[param] || `Parameter ${param}`;
    }
}

// initialize telemetry radio
const telemetryRadio = new TelemetryRadio();