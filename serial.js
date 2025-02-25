class SerialConnection {
    constructor() {
        this.port = null;
        this.reader = null;
        this.writer = null;
        this.isConnected = false;
        this.decoder = new TextDecoder();
        this.encoder = new TextEncoder();
    }

    async connect() {
        try {
            // Request port and open it
            this.port = await navigator.serial.requestPort();
            await this.port.open({ baudRate: 115200 });
            
            this.isConnected = true;
            this.updateConnectionStatus(true);
            
            // Start reading
            this.startReading();
        } catch (error) {
            console.error('Connection failed:', error);
            this.updateConnectionStatus(false);
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
                        // Process the received data
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

    async disconnect() {
        if (this.port) {
            try {
                await this.port.close();
            } catch (error) {
                console.error('Error closing port:', error);
            }
            this.port = null;
            this.isConnected = false;
            this.updateConnectionStatus(false);
        }
    }

    async sendData(data) {
        if (!this.port || !this.isConnected) {
            console.error('Not connected to any device');
            return;
        }

        try {
            const writer = this.port.writable.getWriter();
            try {
                await writer.write(this.encoder.encode(data));
            } finally {
                writer.releaseLock();
            }
        } catch (error) {
            console.error('Error writing to port:', error);
            await this.disconnect();
        }
    }

    handleReceivedData(data) {
        try {
            const parsedData = JSON.parse(data);
            
            // Update status indicators
            if (parsedData.tsal !== undefined) {
                document.getElementById('tsal-status').classList.toggle('active', parsedData.tsal);
            }
            if (parsedData.imd !== undefined) {
                document.getElementById('imd-status').classList.toggle('active', parsedData.imd);
            }
            if (parsedData.shutdown !== undefined) {
                document.getElementById('shutdown-status').classList.toggle('active', parsedData.shutdown);
            }

            // Update dashboard based on data type
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
        } catch (e) {
            console.log('Raw data received:', data);
        }
    }

    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connection-status');
        const connectButton = document.getElementById('connect-serial');
        
        statusElement.textContent = connected ? 'Connected' : 'Disconnected';
        statusElement.style.color = connected ? '#4CAF50' : '#888';
        connectButton.textContent = connected ? 'Disconnect' : 'Connect Serial';
    }
}

// Initialize serial connection
const serialConnection = new SerialConnection();

// Set up event listeners
document.getElementById('connect-serial').addEventListener('click', async () => {
    if (!serialConnection.isConnected) {
        await serialConnection.connect();
    } else {
        await serialConnection.disconnect();
    }
});