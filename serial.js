class SerialConnection {
    constructor() {
        // basic setup
        this.port = null;
        this.reader = null;
        this.writer = null;
        this.isConnected = false;
        this.decoder = new TextDecoder();
        this.encoder = new TextEncoder();
        this.simulationMode = false;
        this.simulationInterval = null;
        this.debugMode = true; // debug output enabled
        this.subscribers = {
            metrics: new Set(),
            battery: new Set(),
            apps: new Set(),
            can: new Set(),
            raw: new Set()
        };
    }

    // event subscription methods
    subscribe(dataType, callback) {
        if (this.subscribers[dataType]) {
            this.subscribers[dataType].add(callback);
            return () => this.unsubscribe(dataType, callback); // return unsubscribe function
        }
        return () => {}; // return empty function if dataType doesn't exist
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
                    console.error(`Error in ${dataType} subscriber:`, error);
                }
            });
        }
    }

    async connect() {
        try {
            if (this.simulationMode) {
                console.log('Starting in simulation mode');
                this.isConnected = true;
                this.updateConnectionStatus(true, 'Connected (Simulation)');
                this.startSimulation();
                return;
            }

            // setup serial port
            this.port = await navigator.serial.requestPort(); // add filters if needed { filters: [{ usbVendorId: 0x2341, usbProductId: 0x8036 }] }
            await this.port.open({ baudRate: 9600 });
            
            const portInfo = this.port.getInfo();
            console.log('Connected to port:', portInfo);
            
            this.isConnected = true;
            this.updateConnectionStatus(true, `Connected to port ${portInfo.usbProductId || 'Unknown'}`);
            
            // start reading data
            this.startReading();
        } catch (error) {
            console.error('Connection failed:', error);
            this.updateConnectionStatus(false);
            
            // offer simulation mode on failure
            if (confirm('Serial connection failed. Would you like to start in simulation mode?')) {
                this.simulationMode = true;
                await this.connect();
            }
        }
    }

    async startReading() {
        while (this.port && this.isConnected) {
            try {
                const reader = this.port.readable.getReader();
                
                try {
                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) {
                            break;
                        }
                        // process the received data
                        const text = this.decoder.decode(value);
                        this.handleReceivedData(text);
                    }
                } catch (error) {
                    console.error('Error while reading:', error);
                } finally {
                    reader.releaseLock();
                }
            } catch (error) {
                console.error('Failed to read from port:', error);
                await this.disconnect();
                break;
            }
        }
    }

    startSimulation() {
        // generate fake data every second
        this.simulationInterval = setInterval(() => {
            const testData = this.generateTestData();
            this.handleReceivedData(JSON.stringify(testData));
            
            if (this.debugMode) {
                console.log('Simulated data sent:', testData);
            }
        }, 1000);
    }

    generateTestData() {
        // create random test data
        const dataTypes = ['metrics', 'battery', 'apps', 'can'];
        const type = dataTypes[Math.floor(Math.random() * dataTypes.length)];

        switch (type) {
            case 'metrics':
                return {
                    type: 'metrics',
                    temperature: 25 + Math.random() * 10,
                    voltage: 48 + Math.random() * 2,
                    current: 10 + Math.random() * 5,
                    tsal: Math.random() > 0.5,
                    imd: Math.random() > 0.8,
                    shutdown: Math.random() > 0.9
                };
            case 'battery':
                return {
                    type: 'battery',
                    totalVoltage: 48 + Math.random() * 2,
                    soc: 75 + Math.random() * 25,
                    packTemp: 30 + Math.random() * 5,
                    cellVoltages: Array(6).fill().map(() => ({
                        voltage: 3.7 + Math.random() * 0.3,
                        temp: 30 + Math.random() * 5
                    }))
                };
            case 'apps':
                return {
                    type: 'apps',
                    apps1: Math.random() * 5,
                    apps2: Math.random() * 5,
                    throttle: Math.random()
                };
            case 'can':
                return {
                    type: 'can',
                    message: `CAN Frame ${Date.now()}: ID=0x${Math.floor(Math.random() * 1000).toString(16)} Data=[${Array(8).fill().map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(' ')}]`
                };
        }
    }

    async disconnect() {
        if (this.simulationMode) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }

        if (this.port) {
            try {
                await this.port.close();
            } catch (error) {
                console.error('Error closing port:', error);
            }
            this.port = null;
        }
        
        this.isConnected = false;
        this.updateConnectionStatus(false);
    }

    async sendData(data) {
        if (!this.isConnected) {
            console.error('Not connected to any device');
            return;
        }

        // echo the command in the CAN monitor for both simulation and real mode
        if (window.dashboardApp) {
            window.dashboardApp.updateCANMonitor(`TX: ${data.trim()}`);
        }

        if (this.simulationMode) {
            console.log('Simulation mode - Data sent:', data);
            return;
        }

        try {
            const writer = this.port.writable.getWriter();
            try {
                await writer.write(this.encoder.encode(data));
                if (this.debugMode) {
                    console.log('Data sent:', data);
                }
            } finally {
                writer.releaseLock();
            }
        } catch (error) {
            console.error('Error writing to port:', error);
            await this.disconnect();
        }
    }

    handleReceivedData(data) {
        if (this.debugMode) {
            console.log('Raw data received:', data);
        }

        // always notify raw data subscribers
        this.notifySubscribers('raw', data);

        try {
            const parsedData = JSON.parse(data);
            
            // update status indicators
            if (parsedData.tsal !== undefined) {
                document.getElementById('tsal-status').classList.toggle('active', parsedData.tsal);
            }
            if (parsedData.imd !== undefined) {
                document.getElementById('imd-status').classList.toggle('active', parsedData.imd);
            }
            if (parsedData.shutdown !== undefined) {
                document.getElementById('shutdown-status').classList.toggle('active', parsedData.shutdown);
            }

            // notify subscribers based on data type
            if (parsedData.type && this.subscribers[parsedData.type]) {
                this.notifySubscribers(parsedData.type, parsedData);
            }

            // update dashboard based on data type
            if (window.dashboardApp) {
                if (parsedData.type === 'metrics') {
                    window.dashboardApp.updateDashboardMetrics(parsedData);
                } else if (parsedData.type === 'battery') {
                    window.dashboardApp.updateBatteryStatus(parsedData);
                } else if (parsedData.type === 'apps') {
                    window.dashboardApp.updateAPPSData(parsedData);
                } else if (parsedData.type === 'can') {
                    window.dashboardApp.updateCANMonitor(parsedData.message);
                }
            }

            if (this.debugMode) {
                console.log('Parsed data:', parsedData);
            }
        } catch (e) {
            if (this.debugMode) {
                console.warn('Failed to parse data:', e);
            }
            // for non-JSON data, display in CAN monitor
            if (window.dashboardApp) {
                window.dashboardApp.updateCANMonitor(`RX: ${data}`);
            }
        }
    }

    updateConnectionStatus(connected, details = '') {
        const statusElement = document.getElementById('connection-status');
        const connectButton = document.getElementById('connect-serial');
        
        statusElement.textContent = connected ? 
            (details || 'Connected') : 
            'Disconnected';
        statusElement.style.color = connected ? '#4CAF50' : '#888';
        connectButton.textContent = connected ? 'Disconnect' : 'Connect Serial';
    }
}

// initialize serial connection
const serialConnection = new SerialConnection();

// add simulation mode toggle
const toggleSimulation = () => {
    if (!serialConnection.isConnected) {
        serialConnection.simulationMode = !serialConnection.simulationMode;
        console.log('Simulation mode:', serialConnection.simulationMode ? 'enabled' : 'disabled');
    }
};

// set up event listeners
document.getElementById('connect-serial').addEventListener('click', async () => {
    if (!serialConnection.isConnected) {
        await serialConnection.connect();
    } else {
        await serialConnection.disconnect();
    }
});

// add simulation mode keyboard shortcut (Ctrl+Shift+S)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        toggleSimulation();
    }
});