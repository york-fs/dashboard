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

        // mavlink specific properties
        this.mavlinkEnabled = false;
        this.mavlinkVersion = 2;
        this.systemId = 1;
        this.componentId = 1;
        
        this.subscribers = {
            telemetry: new Set(),
            status: new Set(),
            raw: new Set(),
            mavlink: new Set(),
        };
        
        // Buffer for incoming binary data
        this.receiveBuffer = new Uint8Array(0); 
        // Expected length of the current Protobuf message, null if not yet known
        this.expectedLength = null; 
        // Assuming a 4-byte length prefix for Protobuf messages (Big Endian)
        this.LENGTH_PREFIX_SIZE = 4; 

        // Error handling for deserialization
        this.deserializationErrorCount = 0;
        this.MAX_CONSECUTIVE_DESERIALIZATION_ERRORS = 3;

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
                // Ensure reader is cancelled before closing port
                if (this.reader) {
                    await this.reader.cancel();
                    this.reader.releaseLock(); // Should be released by cancel, but good practice
                    this.reader = null; 
                }
                 // Ensure writer is closed if it exists
                if (this.writer) {
                    await this.writer.close();
                    this.writer.releaseLock(); // Should be released by close
                    this.writer = null;
                }
                await this.port.close();
            } catch (error) {
                console.error('Error closing telemetry port:', error);
            }
            this.port = null;
        }
        
        this.isConnected = false;
        this.updateConnectionStatus(false);
        // Clear buffers on disconnect
        this.receiveBuffer = new Uint8Array(0);
        this.expectedLength = null;
    }
    
    // start reading data from the radio
    async startReading() {
        this.readLoopActive = true;
        while (this.port && this.readLoopActive && this.isConnected) {
            try {
                // Check if reader needs to be obtained
                if (!this.reader) {
                    this.reader = this.port.readable.getReader();
                }
                
                try {
                    while (this.isConnected && this.readLoopActive) { // Loop while connected and active
                        const { value, done } = await this.reader.read(); // value is Uint8Array
                        if (done) {
                            // Reader is done, port might have closed or readLoopActive set to false
                            this.readLoopActive = false; // Ensure loop terminates
                            break; 
                        }
                        if (!this.readLoopActive) { // Check again in case disconnect was called
                            break;
                        }
                        // Pass the Uint8Array directly
                        this.handleReceivedData(value);
                    }
                } catch (error) {
                    console.error('Error while reading from telemetry radio:', error);
                    // If a read error occurs, consider it a disconnection
                    if (this.isConnected) await this.disconnect(); 
                } finally {
                    // Release lock only if reader is still active and port is open
                    if (this.reader) {
                         // Don't release if already released by cancel/disconnect
                        try { this.reader.releaseLock(); } catch(e) { /* ignore if already released */ }
                        this.reader = null; // Nullify to get a new one next time if needed
                    }
                    if (!this.readLoopActive || !this.isConnected) break; // Break outer loop if necessary
                }
            } catch (error) {
                console.error('Failed to get reader or initial read from telemetry port:', error);
                if (this.isConnected) await this.disconnect(); // Disconnect on failure
                break; 
            }
        }
        // Cleanup after loop exits
        if (this.reader) {
            try{this.reader.releaseLock(); } catch(e) {/*ignore*/ }
            this.reader = null;
        }
        if (!this.isConnected) { // If loop exited due to disconnect
             console.log("Read loop terminated due to disconnection.");
        }
    }
    
    // send at command to the radio
    async sendATCommand(command, waitForResponse = true) {
        if (!this.isConnected || !this.port || !this.port.writable) {
            console.error('Not connected to telemetry radio or port not writable');
            return null;
        }
        
        try {
            if (!this.writer) {
                this.writer = this.port.writable.getWriter();
            }
            
            if (!command.startsWith('AT') && command !== '+++') {
                command = 'AT' + command;
            }
            if (!command.endsWith('\\r') && command !== '+++') {
                command += '\\r';
            }
            
            await this.writer.write(this.encoder.encode(command));
            
            if (this.debugMode) {
                console.log(`Telemetry command sent: ${command.replace('\\r', '<CR>')}`);
            }
            
            if (waitForResponse && command === '+++') {
                return new Promise(resolve => {
                    const timeoutId = setTimeout(() => {
                        this.unsubscribe('raw', responseHandler); // Clean up subscriber on timeout
                        resolve(null); 
                    }, 3000);
                    
                    const responseHandler = (rawData) => { // rawData here is an object { timestamp, data: Uint8Array }
                        let textResponse = '';
                        try { textResponse = this.decoder.decode(rawData.data); } catch (e) {/* ignore */}

                        if (textResponse.includes('OK')) {
                            clearTimeout(timeoutId);
                            this.unsubscribe('raw', responseHandler);
                            resolve(textResponse);
                        }
                    };
                    this.subscribe('raw', responseHandler);
                });
            }
            // For other AT commands, we assume response is handled by general data handler
            return true;
        } catch (error) {
            console.error('Error sending AT command:', error);
            if (this.writer) { // Release writer on error
                try { this.writer.releaseLock(); } catch(e) {/*ignore*/}
                this.writer = null;
            }
            return null;
        } 
        // Writer is kept open for subsequent writes, released on disconnect or error
    }
    
    // send data (non-at command) to the radio
    async sendData(data) { // data here should be Uint8Array for Protobuf
        if (!this.isConnected || !this.port || !this.port.writable) {
            console.error('Not connected to telemetry radio or port not writable');
            return false;
        }
        
        try {
            if (!this.writer) {
                 this.writer = this.port.writable.getWriter();
            }
            await this.writer.write(data); // Expecting data to be Uint8Array
            
            if (this.debugMode) {
                console.log('Telemetry binary data sent (length):', data.length);
            }
            return true;
        } catch (error) {
            console.error('Error sending telemetry data:', error);
            if (this.writer) { // Release writer on error
                try{this.writer.releaseLock(); } catch(e) {/*ignore*/}
                this.writer = null;
            }
            return false;
        }
    }
    
    // handle data received from the radio
    handleReceivedData(rawDataBytes) { // rawDataBytes is a Uint8Array
        if (this.debugMode) {
            console.log('Raw telemetry data bytes received (length):', rawDataBytes.length);
        }
        
        this.notifySubscribers('raw', {
            timestamp: new Date().toISOString(),
            data: rawDataBytes 
        });
        
        let textData = '';
        let isLikelyATResponse = false;
        try {
            // Try to decode a small part for AT command heuristic. Avoid decoding large binary blobs.
            const sampleForDecode = rawDataBytes.length > 100 ? rawDataBytes.slice(0, 100) : rawDataBytes;
            textData = this.decoder.decode(sampleForDecode);
            
            if ((textData.includes('OK') || textData.includes('ERROR') || textData.includes('RSSI:') || /S\\d+=/.test(textData))) {
                 // If it smells like an AT response, decode the whole thing if not already.
                if (rawDataBytes.length > 100) textData = this.decoder.decode(rawDataBytes);
                isLikelyATResponse = true;

                if (this.debugMode) {
                    console.log('Decoded as potential AT command/status response:', textData.trim());
                }
                
                if (textData.includes('OK') || textData.includes('ERROR')) {
                    this.notifySubscribers('status', {
                        type: 'command_response',
                        timestamp: new Date().toISOString(),
                        data: textData.trim()
                    });
                }
                if (/S\\d+=/.test(textData)) { 
                    this.parseParameterResponse(textData);
                }
                if (textData.includes('RSSI:')) {
                    const rssi = this.parseRSSI(textData);
                    this.notifySubscribers('status', {
                        type: 'rssi',
                        timestamp: new Date().toISOString(),
                        data: rssi
                    });
                }
                return; 
            }
        } catch (e) {
            if (this.debugMode && rawDataBytes.length < 200) { // Only warn if it's not a huge binary chunk
                console.warn('Could not decode rawDataBytes to text, assuming binary protobuf data:', e);
            } else if (this.debugMode) {
                 console.log('Assuming binary protobuf data due to size or content.');
            }
        }

        const newBuffer = new Uint8Array(this.receiveBuffer.length + rawDataBytes.length);
        newBuffer.set(this.receiveBuffer);
        newBuffer.set(rawDataBytes, this.receiveBuffer.length);
        this.receiveBuffer = newBuffer;

        if (this.debugMode) {
            // console.log(`Receive buffer updated, new length: ${this.receiveBuffer.length}`);
        }
        this.processReceiveBuffer();
    }

    processReceiveBuffer() {
        let processedAtLeastOneMessage = false;
        do {
            processedAtLeastOneMessage = false; 

            if (this.expectedLength === null) { 
                if (this.receiveBuffer.length >= this.LENGTH_PREFIX_SIZE) {
                    const view = new DataView(this.receiveBuffer.buffer, this.receiveBuffer.byteOffset, this.LENGTH_PREFIX_SIZE);
                    this.expectedLength = view.getUint32(0, false); 

                    if (this.debugMode) console.log(`Read protobuf message length prefix: ${this.expectedLength}`);
                    if (this.expectedLength === 0 || this.expectedLength > 2048) { // Sanity check for length
                        console.error(`Invalid message length received: ${this.expectedLength}. Discarding and resetting.`);
                        this.receiveBuffer = this.receiveBuffer.slice(this.LENGTH_PREFIX_SIZE); // Discard presumed length
                        this.expectedLength = null;
                        // Potentially discard more of the buffer if it seems corrupted
                        continue; // Try to find next packet
                    }
                    this.receiveBuffer = this.receiveBuffer.slice(this.LENGTH_PREFIX_SIZE);
                } else {
                    if (this.debugMode && this.receiveBuffer.length > 0) {
                        // console.log(`Buffer has ${this.receiveBuffer.length} bytes, waiting for length prefix (needs ${this.LENGTH_PREFIX_SIZE}).`);
                    }
                    break; 
                }
            }

            if (this.expectedLength !== null) {
                if (this.receiveBuffer.length >= this.expectedLength) {
                    const messageBytes = this.receiveBuffer.slice(0, this.expectedLength);
                    this.receiveBuffer = this.receiveBuffer.slice(this.expectedLength);
                    const justReadLength = this.expectedLength; 
                    this.expectedLength = null; 

                    try {
                        const vehicle_data_pb = require('./generated-protos/vehicle_data_pb.js');
                        const telemetryPacket = vehicle_data_pb.TelemetryPacket.deserializeBinary(messageBytes);

                        if (this.debugMode) {
                           console.log('Successfully deserialized TelemetryPacket:', telemetryPacket.toObject());
                        }
                        
                        // Reset error count on successful deserialization
                        this.deserializationErrorCount = 0;

                        this.notifySubscribers('telemetry', {
                            type: 'TelemetryPacket', 
                            packetType: telemetryPacket.getType(), 
                            timestamp: telemetryPacket.getTimestampMs() || new Date().toISOString(), 
                            data: telemetryPacket.toObject(), 
                            length: justReadLength
                        });
                        processedAtLeastOneMessage = true; 
                    } catch (error) {
                        console.error('Protobuf deserialization failed:', error, 'Message bytes (hex):', Array.from(messageBytes).map(b => b.toString(16).padStart(2, '0')).join(''));
                        
                        this.deserializationErrorCount++;
                        
                        this.notifySubscribers('status', {
                            type: 'deserialization_error',
                            timestamp: new Date().toISOString(),
                            message: 'Failed to deserialize telemetry packet. Attempting to recover.',
                            errorDetails: error.message,
                            errorCount: this.deserializationErrorCount,
                            packetLength: justReadLength // The supposed length of the failed packet
                        });

                        if (this.deserializationErrorCount >= this.MAX_CONSECUTIVE_DESERIALIZATION_ERRORS) {
                            console.warn(`Max (${this.MAX_CONSECUTIVE_DESERIALIZATION_ERRORS}) consecutive deserialization errors. Clearing receive buffer to resync.`);
                            this.receiveBuffer = new Uint8Array(0);
                            this.expectedLength = null; // Already null, but explicit for clarity
                            this.deserializationErrorCount = 0; // Reset after clearing
                            // Notify UI that buffer was cleared due to persistent errors
                            this.notifySubscribers('status', {
                                type: 'buffer_cleared_due_to_errors',
                                timestamp: new Date().toISOString(),
                                message: 'Receive buffer cleared due to persistent deserialization errors.'
                            });
                        }
                        // expectedLength is already null, so the loop will try to read a new length prefix next.
                    }
                } else {
                    if (this.debugMode) {
                        // console.log(`Buffer has ${this.receiveBuffer.length} bytes, waiting for full message body (needs ${this.expectedLength}).`);
                    }
                    break; 
                }
            }
        } while (processedAtLeastOneMessage && this.receiveBuffer.length > 0); 

        if (this.debugMode && this.receiveBuffer.length > 0) {
            if (this.expectedLength === null && this.receiveBuffer.length < this.LENGTH_PREFIX_SIZE) {
                // console.log(`Final buffer state: ${this.receiveBuffer.length} bytes, waiting for more to complete length prefix.`);
            } else if (this.expectedLength !== null && this.receiveBuffer.length < this.expectedLength) {
                // console.log(`Final buffer state: ${this.receiveBuffer.length} bytes, waiting for more to complete message body of ${this.expectedLength}.`);
            }
        }
    }
    
    // get radio parameters 
    async getRadioParameters() {
        if (!this.isConnected) return;
        
        const cmdModeResult = await this.sendATCommand('+++', true);
        if (!cmdModeResult || !cmdModeResult.includes('OK')) {
            console.error('Failed to enter command mode for params');
            return;
        }
        
        await this.sendATCommand('ATI1', false); // Firmware Version
        await this.sendATCommand('ATI2', false); // Board ID / Type
        await this.sendATCommand('ATI5', false); // All S registers
        await this.sendATCommand('ATI7', false); // RSSI report settings / last RSSI
        
        await this.sendATCommand('ATO', false); // Exit command mode
    }
    
    // set radio parameter
    async setRadioParameter(param, value) {
        if (!this.isConnected) return false;
        
        const cmdModeResult = await this.sendATCommand('+++', true);
        if (!cmdModeResult || !cmdModeResult.includes('OK')) {
            console.error('Failed to enter command mode for set param');
            return false;
        }
        
        const result = await this.sendATCommand(`ATS${param}=${value}\\r`, true); // Wait for OK/ERROR
        
        await this.sendATCommand('AT&W', false); // Write to flash
        await this.sendATCommand('ATO', false); // Exit command mode
        
        return result && result.includes('OK');
    }
    
    // parse parameter response
    parseParameterResponse(data) { // Data is string
        const lines = data.trim().split(/\\r\\n|\\n|\\r/); // Split by newlines
        let paramsUpdated = false;
        for (const line of lines) {
            if (line.startsWith('S')) { // Typical S register format e.g., S0: FORMAT_VERSION      1
                const match = line.match(/S(\d+):\s*([\w_]+)\s*(\d+)/);
                if (match) {
                    const [, paramNum, paramName, paramValue] = match;
                    this.radioParameters[paramNum] = { name: paramName, value: parseInt(paramValue) };
                    paramsUpdated = true;
                } else {
                     // Simpler S<reg>=<value> format if ATI5 is not verbose
                    const simpleMatch = line.match(/S(\d+)=(\d+)/);
                    if (simpleMatch) {
                        const [, paramNum, paramValue] = simpleMatch;
                         this.radioParameters[paramNum] = { name: `S${paramNum}`, value: parseInt(paramValue) };
                         paramsUpdated = true;
                    }
                }
            }
        }
        
        if (paramsUpdated && this.debugMode) {
            console.log('Radio parameters updated:', this.radioParameters);
        }
        if (paramsUpdated) {
            this.notifySubscribers('status', {
                type: 'parameters',
                timestamp: new Date().toISOString(),
                parameters: this.radioParameters
            });
        }
    }
    
    // parse rssi data
    parseRSSI(data) { // Data is string
        // Example RSSI strings: "L/R RSSI: 230/225  L/R noise: 64/61 pkts: 23 txe/rxe: 0/0 stx/srx: 0/0 ecc: 0/0 Temp: 45"
        // Or simpler: "RSSI: -60" (if from ATI7 or similar)
        const detailedMatch = data.match(/L\/R RSSI: (\d+)\/(\d+)/);
        if (detailedMatch) {
            return { local: parseInt(detailedMatch[1]), remote: parseInt(detailedMatch[2]) };
        }
        const simpleMatch = data.match(/RSSI: (\-?\d+)/);
        if (simpleMatch) {
            return { local: parseInt(simpleMatch[1]), remote: null }; // Assuming it's local if simple format
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
    getParameterDescription(param) { // param is string number
        const descriptions = { // From SiK Radio documentation (common params)
            '0': 'S0: FORMAT_VERSION (Read-Only)',
            '1': 'S1: SERIAL_SPEED (baud)',
            '2': 'S2: AIR_SPEED (kbit/s)',
            '3': 'S3: NETID (Network ID)',
            '4': 'S4: TXPOWER (dBm)',
            '5': 'S5: ECC (0/1 for Golay Error Correction)',
            '6': 'S6: MAVLINK (0/1 for MAVLink framing)',
            '7': 'S7: OPPRESEND (0/1 for Opportunistic Resend)',
            '8': 'S8: MIN_FREQ (MHz x1000)',
            '9': 'S9: MAX_FREQ (MHz x1000)',
            '10': 'S10: NUM_CHANNELS',
            '11': 'S11: DUTY_CYCLE (%)',
            '12': 'S12: LBT_RSSI (Listen Before Talk threshold)',
            '13': 'S13: MANCHESTER (0/1 for Manchester encoding)',
            '14': 'S14: RTSCTS (0/1 for RTS/CTS flow control)',
            '15': 'S15: MAX_WINDOW (ms, for TDM)',
            // Add more as needed based on your radio's specific firmware/version
        };
        const paramInfo = this.radioParameters[param];
        if (paramInfo && paramInfo.name && descriptions[param]) {
             return `${descriptions[param]} (Current: ${paramInfo.value})`;
        } else if (paramInfo) {
            return `S${param}: ${paramInfo.name || ''} (Current: ${paramInfo.value})`;
        }
        return descriptions[param] || `Parameter S${param}`;
    }
}

// initialize telemetry radio if not already done by another script or for testing
if (typeof telemetryRadio === 'undefined') {
    var telemetryRadio = new TelemetryRadio(); 
    // Make it globally accessible for console testing if not part of a module system
    // In a module system, you'd export the class or an instance.
    window.telemetryRadio = telemetryRadio; 
}
