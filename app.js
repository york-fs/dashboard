// Assuming vehicle_data_pb.js is loaded globally, making proto.yorkfs.dashboard available
// If using modules, you would import: import { TelemetryPacket } from './generated-protos/vehicle_data_pb.js';
const TelemetryPacketDataType = proto.yorkfs.dashboard.TelemetryPacket.DataType;
const APPSStateEnum = proto.yorkfs.dashboard.APPSData.APPSState; // For easy access to APPSState enum names
const BMSShutdownReasonEnum = proto.yorkfs.dashboard.BMSData.ShutdownReason; // For BMS ShutdownReason enum names
const InverterFaultCodeEnum = proto.yorkfs.dashboard.InverterData.FaultCode; // For Inverter FaultCode enum names

class DashboardApp {
    constructor() {
        this.debugMode = true; // Assuming you want a debug mode flag
        // view setup
        this.currentView = 'dashboard';
        this.views = {
            dashboard: this.createDashboardView.bind(this),
            battery: this.createBatteryView.bind(this),
            canbus: this.createCANBusView.bind(this),
            apps: this.createAPPSView.bind(this),
            telemetry: this.createTelemetryView.bind(this),
            inverter: this.createInverterView.bind(this)
        };
        
        // cache setup
        this.viewCache = new Map();
        this.latestData = {
            metrics: null,
            battery: null,
            apps: null,
            can: [],  // store can messages
            telemetry: {
                messages: [],
                status: null,
                parameters: {}
            }
        };
        
        this.setupEventListeners();
        this.setupSerialHandlers();
        this.unsubscribers = new Map();
        this.setupDataSubscriptions();
    }

    // event setup
    setupEventListeners() {
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', () => this.switchView(button.dataset.view));
        });
    }

    setupSerialHandlers() {
        // this method is kept for potential future serial-related event handlers
    }

    setupDataSubscriptions() {
        // subscribe to different data types
        const subscriptions = [
            ['metrics', this.updateDashboardMetrics.bind(this)],
            ['battery', this.updateBatteryStatus.bind(this)],
            ['apps', this.updateAPPSData.bind(this)],
            ['can', (data) => this.updateCANMonitor(data.message)]
        ];

        // store unsubscribe functions for cleanup
        subscriptions.forEach(([type, callback]) => {
            const unsubscribe = serialConnection.subscribe(type, callback);
            this.unsubscribers.set(type, unsubscribe);
        });
        
        // Subscribe to telemetry data if telemetryRadio exists
        if (window.telemetryRadio) {
            const telemetrySubscriptions = [
                ['telemetry', this.updateTelemetryData.bind(this)],
                ['status', this.updateTelemetryStatus.bind(this)],
                ['raw', (data) => this.updateTelemetryMonitor(data)]
            ];
            
            telemetrySubscriptions.forEach(([type, callback]) => {
                const unsubscribe = telemetryRadio.subscribe(type, callback);
                this.unsubscribers.set('telemetry_' + type, unsubscribe);
            });
        }
    }

    // clean up subscriptions and cache when needed
    cleanup() {
        this.unsubscribers.forEach(unsubscribe => unsubscribe());
        this.unsubscribers.clear();
        this.viewCache.clear();
        this.latestData = {
            metrics: null,
            battery: null,
            apps: null,
            can: [],
            telemetry: {
                messages: [],
                status: null,
                parameters: {}
            }
        };
    }

    // view switching
    switchView(viewName) {
        if (this.views[viewName]) {
            this.currentView = viewName;
            const contentArea = document.getElementById('main-view');
            contentArea.innerHTML = '';

            // get or create view
            let view = this.viewCache.get(viewName);
            if (!view) {
                view = this.views[viewName]();
                this.viewCache.set(viewName, view);
            }
            contentArea.appendChild(view);

            // restore cached data
            this.updateViewWithCachedData(viewName);

            // update nav buttons
            document.querySelectorAll('.nav-button').forEach(button => {
                button.classList.toggle('active', button.dataset.view === viewName);
            });
        }
    }

    updateViewWithCachedData(viewName) {
        switch (viewName) {
            case 'dashboard':
                if (this.latestData.metrics) {
                    this.updateDashboardMetrics(this.latestData.metrics);
                }
                break;
            case 'battery':
                if (this.latestData.battery) {
                    this.updateBatteryStatus(this.latestData.battery);
                }
                break;
            case 'apps':
                if (this.latestData.apps) {
                    this.updateAPPSData(this.latestData.apps);
                }
                break;
            case 'canbus':
                // replay cached can messages
                const output = document.getElementById('can-output');
                if (output && this.latestData.can.length > 0) {
                    output.innerHTML = '';
                    this.latestData.can.forEach(message => {
                        const messageElement = document.createElement('div');
                        messageElement.textContent = message;
                        output.appendChild(messageElement);
                    });
                    output.scrollTop = output.scrollHeight;
                }
                break;
            case 'telemetry':
                // Restore telemetry data
                const telemetryOutput = document.getElementById('telemetry-output');
                if (telemetryOutput && this.latestData.telemetry.messages.length > 0) {
                    telemetryOutput.innerHTML = '';
                    this.latestData.telemetry.messages.forEach(message => {
                        const messageElement = document.createElement('div');
                        messageElement.textContent = message;
                        telemetryOutput.appendChild(messageElement);
                    });
                    telemetryOutput.scrollTop = telemetryOutput.scrollHeight;
                }
                
                // Update parameters table if we have parameters
                this.updateTelemetryParameters(this.latestData.telemetry.parameters);
                break;
            case 'inverter':
                if (this.latestData.inverter) {
                    this.updateInverterStatus(this.latestData.inverter);
                }
                break;
        }
    }

    // view creation methods
    createDashboardView() {
        const view = document.createElement('div');
        view.className = 'dashboard-view';
        view.innerHTML = `
            <h2>System Overview</h2>
            <div class="metrics-grid">
                <div class="metric-card">
                    <h3>Average Temperature</h3>
                    <div id="avg-temp">--°C</div>
                </div>
                <div class="metric-card">
                    <h3>System Voltage</h3>
                    <div id="sys-voltage">--V</div>
                </div>
                <div class="metric-card">
                    <h3>Current Draw</h3>
                    <div id="current-draw">--A</div>
                </div>
            </div>
        `;
        return view;
    }

    createBatteryView() {
        const view = document.createElement('div');
        view.className = 'battery-view';
        view.innerHTML = `
            <h2>Battery Status</h2>
            <div class="battery-stats-grid">
                <div>Total Voltage: <span id="total-voltage">--V</span></div>
                <div>State of Charge: <span id="soc">--%</span></div>
                <div>Pack Temperature: <span id="pack-temp">--°C</span></div>
                <div id="bms-shutdown-indicator-container">
                    Shutdown Activated: <span id="bms-shutdown-activated-text">--</span>
                    <div class="status-indicator" id="bms-shutdown-indicator"></div>
                </div>
                <div>Shutdown Reason: <span id="bms-shutdown-reason">N/A</span></div>
                <div>LVS 12V Rail: <span id="bms-lvs-rail">--V</span></div>
                <div>Positive Current: <span id="bms-positive-current">--A</span></div>
                <div>Negative Current: <span id="bms-negative-current">--A</span></div>
            </div>

            <div class="cell-voltages">
                <h3>Cell Voltages & Temperatures (Per Segment)</h3>
                <table id="voltage-table">
                    <thead>
                        <tr>
                            <th>Segment</th>
                            <th>Cell</th>
                            <th>Voltage</th>
                            <th>Temperature</th>
                        </tr>
                    </thead>
                    <tbody id="voltage-table-body"></tbody>
                </table>
            </div>

            <details class="expandable-section">
                <summary>Detailed BMS Per-Segment Data</summary>
                <div id="bms-per-segment-details">
                    <!-- JS will populate this for each of the 10 segments -->
                    <!-- Example structure for ONE segment (to be repeated by JS) -->
                    <div class="segment-data-container" id="segment-data-0"> <!-- id like segment-data-idx -->
                        <h4>Segment <span class="segment-id">1</span></h4>
                        <div>3V3 Buck Converter Rail Voltage: <span id="segment-0-buck-voltage">--mV</span></div>
                        
                        <h5>Connected Cell Taps (12)</h5>
                        <div class="bitset-indicator-container" id="segment-0-connected-taps">
                            <!-- JS will add 12 indicator divs here -->
                        </div>
                        
                        <h5>Degraded Cell Taps (12)</h5>
                        <div class="bitset-indicator-container" id="segment-0-degraded-taps">
                            <!-- JS will add 12 indicator divs here -->
                        </div>
                        
                        <h5>Connected Thermistors (23)</h5>
                        <div class="bitset-indicator-container" id="segment-0-connected-thermistors">
                            <!-- JS will add 23 indicator divs here -->
                        </div>
                    </div>
                     <!-- End of example structure for one segment -->
                </div>
            </details>
        `;
        return view;
    }

    createCANBusView() {
        const view = document.createElement('div');
        view.className = 'canbus-view';
        view.innerHTML = `
            <h2>CANBus Monitor</h2>
            <div class="terminal">
                <div id="can-output" class="terminal-output"></div>
                <div class="terminal-input">
                    <input type="text" id="can-command" placeholder="Enter command...">
                    <button id="send-command">Send</button>
                </div>
            </div>
        `;

        // set up event listeners for the canbus view
        setTimeout(() => {
            const sendButton = document.getElementById('send-command');
            const commandInput = document.getElementById('can-command');

            if (sendButton && commandInput) {
                // add click event for the send button
                sendButton.addEventListener('click', () => {
                    if (commandInput.value.trim()) {
                        serialConnection.sendData(commandInput.value + '\n');
                        commandInput.value = '';
                    }
                });

                // add enter key support for the input
                commandInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && commandInput.value.trim()) {
                        serialConnection.sendData(commandInput.value + '\n');
                        commandInput.value = '';
                    }
                });
            }
        }, 0);

        return view;
    }

    createAPPSView() {
        const view = document.createElement('div');
        view.className = 'apps-view';
        view.innerHTML = `
            <h2>Accelerator Pedal Configuration</h2>
            <div class="apps-main-data">
                <div id="apps-state-container">
                    APPS State: <span id="apps-state">--</span>
                    <div class="status-indicator" id="apps-state-indicator"></div>
                </div>
            </div>
            <div class="apps-metrics-grid">
                <div class="gauge-placeholder-container">
                    <div>Current Throttle %: <span id="throttle">--%</span></div>
                    <div class="gauge-placeholder" id="throttle-gauge">Gauge Here</div>
                </div>
                <div class="gauge-placeholder-container">
                    <div>Motor Current: <span id="motor-current">--A</span></div>
                    <div class="gauge-placeholder" id="motor-current-gauge">Gauge Here</div>
                </div>
                <div class="gauge-placeholder-container">
                    <div>Motor RPM: <span id="motor-rpm">-- RPM</span></div>
                    <div class="gauge-placeholder" id="motor-rpm-gauge">Gauge Here</div>
                </div>
            </div>
            <div class="apps-controls">
                 <button id="calibrate-apps">Calibrate APPS</button>
            </div>
            <div class="apps-faults">
                <h3>Stored Faults</h3>
                <div id="apps-fault-list"></div>
            </div>
        `;
        return view;
    }
    
    createTelemetryView() {
        const view = document.createElement('div');
        view.className = 'telemetry-view';
        view.innerHTML = `
            <h2>Telemetry Radio Configuration</h2>
            <div class="telemetry-controls">
                <div class="radio-info">
                    <div>Signal Strength: <span id="rssi-value">-- dBm</span></div>
                    <div>Radio Status: <span id="radio-status">--</span></div>
                </div>
                
                <div class="radio-config">
                    <h3>Radio Parameters</h3>
                    <table class="param-table" id="radio-params">
                        <thead>
                            <tr>
                                <th>Parameter</th>
                                <th>Value</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Parameters will be populated here -->
                        </tbody>
                    </table>
                    
                    <div class="button-row">
                        <button id="refresh-params">Refresh Parameters</button>
                        <button id="enter-command-mode">Enter Command Mode</button>
                        <button id="exit-command-mode">Exit Command Mode</button>
                    </div>
                </div>
                
                <div class="telemetry-terminal">
                    <h3>Telemetry Monitor</h3>
                    <div class="terminal">
                        <div id="telemetry-output" class="terminal-output"></div>
                        <div class="terminal-input">
                            <input type="text" id="telemetry-command" placeholder="Enter AT command...">
                            <button id="send-telemetry-command">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Set up event listeners for the telemetry view
        setTimeout(() => {
            const sendButton = document.getElementById('send-telemetry-command');
            const commandInput = document.getElementById('telemetry-command');
            const refreshButton = document.getElementById('refresh-params');
            const enterCmdButton = document.getElementById('enter-command-mode');
            const exitCmdButton = document.getElementById('exit-command-mode');

            if (sendButton && commandInput) {
                // Add click event for the send button
                sendButton.addEventListener('click', () => {
                    if (commandInput.value.trim()) {
                        telemetryRadio.sendATCommand(commandInput.value);
                        commandInput.value = '';
                    }
                });

                // Add enter key support for the input
                commandInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && commandInput.value.trim()) {
                        telemetryRadio.sendATCommand(commandInput.value);
                        commandInput.value = '';
                    }
                });
            }
            
            if (refreshButton) {
                refreshButton.addEventListener('click', () => {
                    telemetryRadio.getRadioParameters();
                });
            }
            
            if (enterCmdButton) {
                enterCmdButton.addEventListener('click', () => {
                    telemetryRadio.sendATCommand('+++', true);
                });
            }
            
            if (exitCmdButton) {
                exitCmdButton.addEventListener('click', () => {
                    telemetryRadio.sendATCommand('O');
                });
            }
        }, 0);

        return view;
    }

    createInverterView() {
        const view = document.createElement('div');
        view.className = 'inverter-view';
        view.innerHTML = `
            <h2>Inverter Status & Control</h2>
            <div class="inverter-status-grid">
                <div id="inverter-fault-container">
                    Fault Code: <span id="inverter-fault-code">--</span>
                    <div class="status-indicator" id="inverter-fault-indicator"></div>
                </div>
                <div id="inverter-drive-enabled-container">
                    Drive Enabled: <span id="inverter-drive-enabled">--</span>
                    <div class="status-indicator" id="inverter-drive-enabled-indicator"></div>
                </div>
            </div>

            <div class="inverter-metrics-grid">
                <div class="metric-card">
                    ERPM: <span id="inverter-erpm">--</span>
                    <div class="gauge-placeholder" id="inverter-erpm-gauge">Gauge Here</div>
                </div>
                <div class="metric-card">
                    Duty Cycle: <span id="inverter-duty-cycle">--%</span>
                    <div class="gauge-placeholder" id="inverter-duty-cycle-gauge">Gauge Here</div>
                </div>
                <div class="metric-card">Input DC Voltage: <span id="inverter-input-dc-voltage">--V</span></div>
                <div class="metric-card">AC Motor Current: <span id="inverter-ac-motor-current">--A</span></div>
                <div class="metric-card">DC Battery Current: <span id="inverter-dc-battery-current">--A</span></div>
                <div class="metric-card">Controller Temp: <span id="inverter-controller-temp">--°C</span></div>
                <div class_="metric-card">Motor Temp: <span id="inverter-motor-temp">--°C</span></div>
            </div>

            <h3>Limit States</h3>
            <div class="limit-states-container" id="inverter-limit-states">
                <!-- JS will populate this with individual status indicators or a list -->
                <!-- Example for one limit state indicator (to be repeated by JS) -->
                <!-- <div class="limit-indicator" id="limit-capacitor-temperature">Capacitor Temperature: <span class="limit-value">OFF</span></div> -->
            </div>
        `;
        return view;
    }

    // data update methods
    updateDashboardMetrics(data) {
        this.latestData.metrics = data;
        if (data.temperature) {
            document.getElementById('avg-temp').textContent = `${data.temperature.toFixed(1)}°C`;
        }
        if (data.voltage) {
            document.getElementById('sys-voltage').textContent = `${data.voltage.toFixed(1)}V`;
        }
        if (data.current) {
            document.getElementById('current-draw').textContent = `${data.current.toFixed(1)}A`;
        }
    }

    updateBatteryStatus(bmsDataMessage) { // bmsDataMessage is a proto.yorkfs.dashboard.BMSData instance
        this.latestData.battery = bmsDataMessage; // Cache the Protobuf message

        let calculatedTotalVoltage = 0;
        const cellsDataForTable = []; // To store { voltage, temp, id }
        let allTemperatures = []; // To calculate average pack temp

        const segments = bmsDataMessage.getSegmentsList(); // Use getSegmentsList()
        if (segments && segments.length > 0) {
            segments.forEach((segment, segmentIndex) => {
                const segmentCellVoltages = segment.getCellVoltagesList() || []; // Use getCellVoltagesList()
                const segmentTemperatures = segment.getTemperaturesList() || []; // Use getTemperaturesList()

                segmentCellVoltages.forEach((voltage, localCellIndex) => {
                    calculatedTotalVoltage += voltage;
                    cellsDataForTable.push({
                        id: `S${segmentIndex + 1}-C${localCellIndex + 1}`,
                        voltage: voltage,
                        // Assuming temperature array aligns with cell voltage array
                        temp: segmentTemperatures[localCellIndex] 
                    });
                });
                allTemperatures.push(...segmentTemperatures.filter(t => t !== undefined && t !== null));
            });
        }

        const totalVoltageElement = document.getElementById('total-voltage');
        if (totalVoltageElement) {
            totalVoltageElement.textContent = `${calculatedTotalVoltage.toFixed(1)}V`;
        }

        const socElement = document.getElementById('soc');
        if (socElement) {
            // SoC might come from a specific getter if available, e.g., bmsDataMessage.getStateOfCharge()
            // For now, if not directly in BMSData protobuf as a top-level field:
            socElement.textContent = `--%`; 
        }

        const packTempElement = document.getElementById('pack-temp');
        if (packTempElement) {
            if (allTemperatures.length > 0) {
                const avgTemp = allTemperatures.reduce((sum, temp) => sum + temp, 0) / allTemperatures.length;
                packTempElement.textContent = `${avgTemp.toFixed(1)}°C`;
            } else {
                packTempElement.textContent = `--°C`;    
            }
        }

        const tbody = document.querySelector('#voltage-table tbody');
        if (tbody) {
            tbody.innerHTML = cellsDataForTable.map(cell => `
                <tr>
                    <td>${cell.id}</td>
                    <td>${cell.voltage !== undefined ? cell.voltage.toFixed(3) : '--'}V</td>
                    <td>${cell.temp !== undefined ? cell.temp.toFixed(1) : '--'}°C</td>
                </tr>
            `).join('');
        }
        
        const shutdownActivatedEl = document.getElementById('bms-shutdown-activated');
        if (shutdownActivatedEl) {
            const shutdownActivated = bmsDataMessage.getShutdownActivated(); // Use getShutdownActivated()
            shutdownActivatedEl.textContent = shutdownActivated ? 'YES' : 'NO';
            shutdownActivatedEl.className = shutdownActivated ? 'status-active' : 'status-inactive';
        }
        const shutdownReasonEl = document.getElementById('bms-shutdown-reason');
        if (shutdownReasonEl) {
            if (bmsDataMessage.getShutdownActivated() && bmsDataMessage.hasShutdownReason()) { // Use getShutdownActivated() and hasShutdownReason()
                const reasonEnumVal = bmsDataMessage.getShutdownReason(); // Use getShutdownReason()
                const reasonName = Object.keys(BMSShutdownReasonEnum).find(key => BMSShutdownReasonEnum[key] === reasonEnumVal);
                shutdownReasonEl.textContent = reasonName ? reasonName.replace(/^SHUTDOWN_REASON_/, '') : 'UNKNOWN';
            } else {
                shutdownReasonEl.textContent = 'N/A';
            }
        }

        const lvsRailEl = document.getElementById('bms-lvs-rail');
        if (lvsRailEl && bmsDataMessage.hasMeasuredLvs12vRail()) { // Use hasMeasuredLvs12vRail()
            lvsRailEl.textContent = `${bmsDataMessage.getMeasuredLvs12vRail().toFixed(2)}V`; // Use getMeasuredLvs12vRail()
        } else if (lvsRailEl) {
            lvsRailEl.textContent = '--V';
        }

        const positiveCurrentEl = document.getElementById('bms-positive-current');
        if (positiveCurrentEl && bmsDataMessage.hasPositiveCurrent()) { // Use hasPositiveCurrent()
            positiveCurrentEl.textContent = `${bmsDataMessage.getPositiveCurrent().toFixed(2)}A`; // Use getPositiveCurrent()
        } else if (positiveCurrentEl) {
            positiveCurrentEl.textContent = '--A';
        }

        const negativeCurrentEl = document.getElementById('bms-negative-current');
        if (negativeCurrentEl && bmsDataMessage.hasNegativeCurrent()) { // Use hasNegativeCurrent()
            negativeCurrentEl.textContent = `${bmsDataMessage.getNegativeCurrent().toFixed(2)}A`; // Use getNegativeCurrent()
        } else if (negativeCurrentEl) {
            negativeCurrentEl.textContent = '--A';
        }

        if (this.debugMode) {
            console.log("UI updated with BMS data (Protobuf message):", bmsDataMessage);
        }
    }

    updateAPPSData(appsDataMessage) { // appsDataMessage is a proto.yorkfs.dashboard.APPSData instance
        this.latestData.apps = appsDataMessage; // Cache the Protobuf message

        const stateElement = document.getElementById('apps-state');
        if (stateElement) {
            const stateName = Object.keys(APPSStateEnum).find(key => APPSStateEnum[key] === appsDataMessage.getState()); // Use getState()
            stateElement.textContent = stateName ? stateName.replace(/^APPS_STATE_/, '') : 'UNKNOWN';
        }

        const throttleElement = document.getElementById('throttle');
        if (throttleElement && appsDataMessage.hasCurrentThrottlePercentage()) { 
            throttleElement.textContent = `${(appsDataMessage.getCurrentThrottlePercentage()).toFixed(1)}%`; // Use getCurrentThrottlePercentage()
        } else if (throttleElement) {
            throttleElement.textContent = '--%';
        }

        const motorCurrentElement = document.getElementById('motor-current');
        if (motorCurrentElement && appsDataMessage.hasCurrentMotorCurrent()) {
            motorCurrentElement.textContent = `${appsDataMessage.getCurrentMotorCurrent().toFixed(1)}A`; // Use getCurrentMotorCurrent()
        } else if (motorCurrentElement) {
            motorCurrentElement.textContent = '--A';
        }

        const motorRpmElement = document.getElementById('motor-rpm');
        if (motorRpmElement && appsDataMessage.hasCurrentMotorRpm()) {
            motorRpmElement.textContent = `${appsDataMessage.getCurrentMotorRpm()} RPM`; // Use getCurrentMotorRpm()
        } else if (motorRpmElement) {
            motorRpmElement.textContent = '-- RPM';
        }
        
        const apps1Element = document.getElementById('apps1');
        if (apps1Element) apps1Element.textContent = '--'; 
        const apps2Element = document.getElementById('apps2');
        if (apps2Element) apps2Element.textContent = '--';

        if (this.debugMode) {
            console.log("UI updated with APPS data (Protobuf message):", appsDataMessage);
        }
    }

    updateCANMonitor(message) {
        // store message in cache (keep last 1000 messages)
        this.latestData.can.push(message);
        if (this.latestData.can.length > 1000) {
            this.latestData.can.shift();
        }

        const output = document.getElementById('can-output');
        if (output) {
            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            output.appendChild(messageElement);
            output.scrollTop = output.scrollHeight;
        }
    }
    
    // Update telemetry data when received
    updateTelemetryData(packet) { // packet is the event payload from telemetry.js
        // packet.type is 'TelemetryPacket'
        // packet.packetType is the TelemetryPacketDataType enum value
        // packet.timestamp is the timestamp string
        // packet.data IS NOW THE ACTUAL TelemetryPacket Protobuf object
        // packet.length is the original message length

        if (!packet || packet.type !== 'TelemetryPacket' || !packet.data) { // Ensure packet.data (the protobuf msg) exists
            if (this.debugMode) console.warn('Received invalid or non-TelemetryPacket data in updateTelemetryData:', packet);
            // Log to telemetry monitor as an unknown structured message for inspection
            this.latestData.telemetry.messages.push({
                timestamp: (packet && packet.timestamp) ? packet.timestamp : new Date().toISOString(),
                type: (packet && packet.type) ? packet.type : 'unknown_packet_type',
                content: typeof packet === 'object' ? JSON.stringify(packet, null, 2) : String(packet)
            });
            this.refreshTelemetryMonitor();
            return;
        }

        const telemetryProtoMessage = packet.data; // This IS the TelemetryPacket Protobuf object

        // Log structured packet to the telemetry monitor view
        this.latestData.telemetry.messages.push({
            timestamp: packet.timestamp,
            type: `Protobuf: ${(Object.keys(TelemetryPacketDataType).find(key => TelemetryPacketDataType[key] === packet.packetType) || 'UNKNOWN_TYPE')}`,
            content: telemetryProtoMessage.toObject() // For display in monitor, convert to JS object
        });
        if (this.latestData.telemetry.messages.length > 1000) {
            this.latestData.telemetry.messages.shift(); 
        }
        this.refreshTelemetryMonitor(); 

        if (this.debugMode) {
            console.log(`Processing TelemetryPacket (Protobuf Message) - Type: ${packet.packetType}, Payload Object:`, telemetryProtoMessage.toObject());
        }
        
        let specificDataMessage; // This will hold APPSData, BMSData, etc. (Protobuf message instances)
        switch (packet.packetType) {
            case TelemetryPacketDataType.DATA_TYPE_APPS:
                specificDataMessage = telemetryProtoMessage.getAppsData(); // Returns APPSData Protobuf message
                if (specificDataMessage) {
                    if (this.debugMode) console.log("APPS Data (Protobuf Message) Received for UI update:", specificDataMessage);
                    this.updateAPPSData(specificDataMessage); // Pass the APPSData Protobuf message
                }
                break;
            case TelemetryPacketDataType.DATA_TYPE_BMS:
                specificDataMessage = telemetryProtoMessage.getBmsData(); // Returns BMSData Protobuf message
                if (specificDataMessage) {
                    if (this.debugMode) console.log("BMS Data (Protobuf Message) Received for UI update:", specificDataMessage);
                    this.updateBatteryStatus(specificDataMessage); // Pass the BMSData Protobuf message
                }
                break;
            case TelemetryPacketDataType.DATA_TYPE_INVERTER:
                specificDataMessage = telemetryProtoMessage.getInverterData(); // Returns InverterData Protobuf message
                if (specificDataMessage) {
                    if (this.debugMode) console.log("Inverter Data (Protobuf Message) Received for UI update:", specificDataMessage);
                    this.updateInverterStatus(specificDataMessage); // Pass the InverterData Protobuf message
                }
                break;
            default:
                console.warn("Received TelemetryPacket with unknown packetType enum value:", packet.packetType, telemetryProtoMessage.toObject());
        }
    }

    // New method for Inverter Data
    updateInverterStatus(inverterDataMessage) { // inverterDataMessage is a proto.yorkfs.dashboard.InverterData instance
        this.latestData.inverter = inverterDataMessage; // Cache the Protobuf message
        if (this.debugMode) console.log("Updating Inverter Status with data (Protobuf message):", inverterDataMessage);

        const faultCodeEl = document.getElementById('inverter-fault-code');
        if (faultCodeEl) {
            const faultCode = inverterDataMessage.getFaultCode(); // Use getFaultCode()
            const faultName = Object.keys(InverterFaultCodeEnum).find(key => InverterFaultCodeEnum[key] === faultCode);
            faultCodeEl.textContent = faultName ? faultName.replace(/^FAULT_CODE_/, '') : 'UNKNOWN';
            faultCodeEl.className = (faultCode === InverterFaultCodeEnum.FAULT_CODE_NO_FAULTS || faultCode === InverterFaultCodeEnum.FAULT_CODE_UNSPECIFIED) ? 'status-inactive' : 'status-active';
        }

        const erpmEl = document.getElementById('inverter-erpm');
        if (erpmEl && inverterDataMessage.hasErpm()) erpmEl.textContent = inverterDataMessage.getErpm(); // Use getErpm()
        else if (erpmEl) erpmEl.textContent = '--';
        
        const dutyCycleEl = document.getElementById('inverter-duty-cycle');
        if (dutyCycleEl && inverterDataMessage.hasDutyCycle()) dutyCycleEl.textContent = `${(inverterDataMessage.getDutyCycle() * 100).toFixed(1)}%`; // Use getDutyCycle()
        else if (dutyCycleEl) dutyCycleEl.textContent = '--%';
        
        const inputDcVoltageEl = document.getElementById('inverter-input-dc-voltage');
        if (inputDcVoltageEl && inverterDataMessage.hasInputDcVoltage()) inputDcVoltageEl.textContent = `${inverterDataMessage.getInputDcVoltage().toFixed(1)}V`; // Use getInputDcVoltage()
        else if (inputDcVoltageEl) inputDcVoltageEl.textContent = '--V';
        
        const acMotorCurrentEl = document.getElementById('inverter-ac-motor-current');
        if (acMotorCurrentEl && inverterDataMessage.hasAcMotorCurrent()) acMotorCurrentEl.textContent = `${inverterDataMessage.getAcMotorCurrent().toFixed(1)}A`; // Use getAcMotorCurrent()
        else if (acMotorCurrentEl) acMotorCurrentEl.textContent = '--A';
        
        const dcBatteryCurrentEl = document.getElementById('inverter-dc-battery-current');
        if (dcBatteryCurrentEl && inverterDataMessage.hasDcBatteryCurrent()) dcBatteryCurrentEl.textContent = `${inverterDataMessage.getDcBatteryCurrent().toFixed(1)}A`; // Use getDcBatteryCurrent()
        else if (dcBatteryCurrentEl) dcBatteryCurrentEl.textContent = '--A';
        
        const controllerTempEl = document.getElementById('inverter-controller-temp');
        if (controllerTempEl && inverterDataMessage.hasControllerTemperature()) controllerTempEl.textContent = `${inverterDataMessage.getControllerTemperature().toFixed(1)}°C`; // Use getControllerTemperature()
        else if (controllerTempEl) controllerTempEl.textContent = '--°C';
        
        const motorTempEl = document.getElementById('inverter-motor-temp');
        if (motorTempEl && inverterDataMessage.hasMotorTemperature()) motorTempEl.textContent = `${inverterDataMessage.getMotorTemperature().toFixed(1)}°C`; // Use getMotorTemperature()
        else if (motorTempEl) motorTempEl.textContent = '--°C';

        const driveEnabledEl = document.getElementById('inverter-drive-enabled');
        if (driveEnabledEl) {
            const driveEnabled = inverterDataMessage.getDriveEnabled(); // Use getDriveEnabled()
            driveEnabledEl.textContent = driveEnabled ? 'ENABLED' : 'DISABLED';
            driveEnabledEl.className = driveEnabled ? 'status-active' : 'status-inactive';
        }

        const limitStatesContainer = document.getElementById('inverter-limit-states');
        if (limitStatesContainer && inverterDataMessage.hasLimitStates()) {
            limitStatesContainer.innerHTML = ''; 
            const limitStatesStruct = inverterDataMessage.getLimitStates(); // Returns a proto.google.protobuf.Struct
            let activeLimits = [];
            if (limitStatesStruct) {
                const limitsObject = limitStatesStruct.toObject(); // Convert Struct to plain JS object for easier iteration
                for (const key in limitsObject) {
                    if (limitsObject[key] === true) { 
                        activeLimits.push(key.replace(/([A-Z])/g, ' $1').replace(/^\\s/, '').toUpperCase()); 
                    }
                }
            }
            if (activeLimits.length > 0) {
                const ul = document.createElement('ul');
                activeLimits.forEach(limitText => {
                    const li = document.createElement('li');
                    li.textContent = limitText;
                    ul.appendChild(li);
                });
                limitStatesContainer.appendChild(ul);
            } else {
                limitStatesContainer.textContent = 'No active limits.';
            }
        } else if (limitStatesContainer) {
            limitStatesContainer.textContent = 'Limit states N/A.';
        }
    }
    
    // Helper to refresh telemetry monitor view (extracted from old updateTelemetryData)
    refreshTelemetryMonitor() {
        const output = document.getElementById('telemetry-output');
        if (!output) return;

        output.innerHTML = ''; // Clear existing content
        
        const messagesToDisplay = this.latestData.telemetry.messages.slice(-100); // Display last 100 messages

        messagesToDisplay.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.className = `telemetry-message ${msg.type ? msg.type.toLowerCase().replace(/[^a-z0-9_]/g, '_') : 'unknown'}`;
            
            const timestamp = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }) : '[no timestamp]';
            
            let contentHtml = '';
            // Sanitize content before inserting as HTML to prevent XSS if content can be arbitrary strings
            const escapeHtml = (unsafe) => {
                if (typeof unsafe !== 'string') return unsafe; // return as is if not string
                return unsafe
                         .replace(/&/g, "&amp;")
                         .replace(/</g, "&lt;")
                         .replace(/>/g, "&gt;")
                         .replace(/"/g, "&quot;")
                         .replace(/'/g, "&#039;");
            };

            if (typeof msg.content === 'string') {
                contentHtml = `<span class="content">${escapeHtml(msg.content)}</span>`;
            } else if (typeof msg.content === 'object') {
                contentHtml = `<pre class="json">${escapeHtml(JSON.stringify(msg.content, null, 2))}</pre>`;
            } else {
                contentHtml = `<span class="content">${escapeHtml(String(msg.content))}</span>`;
            }

            messageElement.innerHTML = `
                <span class="timestamp">${timestamp}</span>
                ${contentHtml}
            `;
            output.appendChild(messageElement);
        });
        output.scrollTop = output.scrollHeight; // Scroll to the bottom
    }
    
    // Update telemetry monitor with raw data
    updateTelemetryMonitor(message) {
        // Store message in cache (keep last 1000 messages)
        this.latestData.telemetry.messages.push(message);
        if (this.latestData.telemetry.messages.length > 1000) {
            this.latestData.telemetry.messages.shift();
        }

        // Update the telemetry output if visible
        const output = document.getElementById('telemetry-output');
        if (output) {
            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            output.appendChild(messageElement);
            output.scrollTop = output.scrollHeight;
        }
    }
    
    // Update telemetry status (radio status, parameters, etc)
    updateTelemetryStatus(statusData) {
        if (statusData.type === 'rssi' && statusData.data) {
            const rssiElement = document.getElementById('rssi-value');
            if (rssiElement) {
                rssiElement.textContent = `${statusData.data} dBm`;
            }
        }
        else if (statusData.type === 'parameters') {
            this.updateTelemetryParameters(statusData.parameters);
        }
        else if (statusData.type === 'command_response') {
            this.updateRadioStatus(statusData.data);
        }
    }
    
    // Update the radio status display
    updateRadioStatus(status) {
        const statusElement = document.getElementById('radio-status');
        if (statusElement) {
            if (status.includes('OK')) {
                statusElement.textContent = 'Command Mode';
                statusElement.style.color = '#4CAF50';
            } else if (status.includes('ERROR')) {
                statusElement.textContent = 'Error';
                statusElement.style.color = '#F44336';
            } else if (status.includes('EXIT')) {
                statusElement.textContent = 'Data Mode';
                statusElement.style.color = '#2196F3';
            }
        }
    }
    
    // Update telemetry parameters table
    updateTelemetryParameters(parameters) {
        // Store in cache
        this.latestData.telemetry.parameters = parameters;
        
        // Update the parameters table
        const tbody = document.querySelector('#radio-params tbody');
        if (!tbody) return;
        
        // Clear existing rows
        tbody.innerHTML = '';
        
        // Add rows for each parameter
        for (const [param, value] of Object.entries(parameters)) {
            const description = telemetryRadio.getParameterDescription(param);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>S${param}</td>
                <td>${value}</td>
                <td>${description}</td>
                <td>
                    <button class="edit-param" data-param="${param}">Edit</button>
                </td>
            `;
            tbody.appendChild(row);
        }
        
        // Add click handlers for edit buttons
        document.querySelectorAll('.edit-param').forEach(button => {
            button.addEventListener('click', () => {
                const param = button.dataset.param;
                const currentValue = parameters[param];
                const newValue = prompt(`Enter new value for ${telemetryRadio.getParameterDescription(param)}:`, currentValue);
                
                if (newValue !== null && newValue !== '') {
                    telemetryRadio.setRadioParameter(param, newValue);
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.dashboardApp = new DashboardApp();
    window.dashboardApp.switchView('dashboard');
});
