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
            telemetry: this.createTelemetryView.bind(this)
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
            <div class="battery-stats">
                <div>Total Voltage: <span id="total-voltage">--V</span></div>
                <div>State of Charge: <span id="soc">--%</span></div>
                <div>Pack Temperature: <span id="pack-temp">--°C</span></div>
            </div>
            <div class="cell-voltages">
                <h3>Cell Voltages</h3>
                <table id="voltage-table">
                    <thead>
                        <tr>
                            <th>Cell</th>
                            <th>Voltage</th>
                            <th>Temperature</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
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
            <div class="apps-data">
                <div class="sensor-values">
                    <div>Sensor 1: <span id="apps1">--</span></div>
                    <div>Sensor 2: <span id="apps2">--</span></div>
                    <div>Throttle %: <span id="throttle">--%</span></div>
                </div>
                <button id="calibrate-apps">Calibrate APPS</button>
                <div class="apps-faults">
                    <h3>Stored Faults</h3>
                    <div id="apps-fault-list"></div>
                </div>
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

    updateBatteryStatus(bmsDataPb) { // bmsDataPb is the .toObject() version of proto.yorkfs.dashboard.BMSData
        this.latestData.battery = bmsDataPb; // Cache the raw protobuf-derived object

        let calculatedTotalVoltage = 0;
        const cellsDataForTable = []; // To store { voltage, temp, id }
        let allTemperatures = []; // To calculate average pack temp

        if (bmsDataPb.segmentsList && bmsDataPb.segmentsList.length > 0) {
            bmsDataPb.segmentsList.forEach((segment, segmentIndex) => {
                const segmentCellVoltages = segment.cellVoltagesList || [];
                const segmentTemperatures = segment.temperaturesList || [];

                segmentCellVoltages.forEach((voltage, localCellIndex) => {
                    calculatedTotalVoltage += voltage;
                    cellsDataForTable.push({
                        id: `S${segmentIndex + 1}-C${localCellIndex + 1}`,
                        voltage: voltage,
                        temp: segmentTemperatures[localCellIndex] 
                    });
                });
                allTemperatures.push(...segmentTemperatures);
            });
        }

        const totalVoltageElement = document.getElementById('total-voltage');
        if (totalVoltageElement) {
            totalVoltageElement.textContent = `${calculatedTotalVoltage.toFixed(1)}V`;
        }

        const socElement = document.getElementById('soc');
        if (socElement) {
            socElement.textContent = `--%`; // SoC not directly available from current BMSData protobuf
        }

        const packTempElement = document.getElementById('pack-temp');
        if (packTempElement) {
            if (allTemperatures.length > 0) {
                const validTemperatures = allTemperatures.filter(t => t !== undefined && t !== null);
                if (validTemperatures.length > 0) {
                    const avgTemp = validTemperatures.reduce((sum, temp) => sum + temp, 0) / validTemperatures.length;
                    packTempElement.textContent = `${avgTemp.toFixed(1)}°C`;
                } else {
                    packTempElement.textContent = `--°C`;    
                }
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
        
        // Display Shutdown Status and Reason
        const shutdownActivatedEl = document.getElementById('bms-shutdown-activated');
        if (shutdownActivatedEl) {
            shutdownActivatedEl.textContent = bmsDataPb.shutdownActivated ? 'YES' : 'NO';
            shutdownActivatedEl.className = bmsDataPb.shutdownActivated ? 'status-active' : 'status-inactive';
        }
        const shutdownReasonEl = document.getElementById('bms-shutdown-reason');
        if (shutdownReasonEl) {
            if (bmsDataPb.shutdownActivated && bmsDataPb.shutdownReason !== undefined) {
                const reasonName = Object.keys(BMSShutdownReasonEnum).find(key => BMSShutdownReasonEnum[key] === bmsDataPb.shutdownReason);
                shutdownReasonEl.textContent = reasonName ? reasonName.replace(/^SHUTDOWN_REASON_/, '') : 'UNKNOWN';
            } else {
                shutdownReasonEl.textContent = 'N/A';
            }
        }

        // Display LVS Rail, Positive Current, Negative Current
        const lvsRailEl = document.getElementById('bms-lvs-rail');
        if (lvsRailEl && bmsDataPb.measuredLvs12vRail !== undefined) {
            lvsRailEl.textContent = `${bmsDataPb.measuredLvs12vRail.toFixed(2)}V`;
        }
        const positiveCurrentEl = document.getElementById('bms-positive-current');
        if (positiveCurrentEl && bmsDataPb.positiveCurrent !== undefined) {
            positiveCurrentEl.textContent = `${bmsDataPb.positiveCurrent.toFixed(2)}A`;
        }
        const negativeCurrentEl = document.getElementById('bms-negative-current');
        if (negativeCurrentEl && bmsDataPb.negativeCurrent !== undefined) {
            negativeCurrentEl.textContent = `${bmsDataPb.negativeCurrent.toFixed(2)}A`;
        }

        if (this.debugMode) {
            console.log("UI updated with BMS data:", bmsDataPb);
        }
    }

    updateAPPSData(appsDataPb) { // appsDataPb is from packetPayload.appsData
        this.latestData.apps = appsDataPb; // Cache the new data structure

        const stateElement = document.getElementById('apps-state');
        if (stateElement) {
            // Get the string name of the enum value for display
            const stateName = Object.keys(APPSStateEnum).find(key => APPSStateEnum[key] === appsDataPb.state);
            stateElement.textContent = stateName ? stateName.replace(/^APPS_STATE_/, '') : 'UNKNOWN';
        }

        const throttleElement = document.getElementById('throttle');
        if (throttleElement && appsDataPb.currentThrottlePercentage !== undefined) {
            throttleElement.textContent = `${(appsDataPb.currentThrottlePercentage).toFixed(1)}%`;
        }

        const motorCurrentElement = document.getElementById('motor-current');
        if (motorCurrentElement && appsDataPb.currentMotorCurrent !== undefined) {
            motorCurrentElement.textContent = `${appsDataPb.currentMotorCurrent.toFixed(1)}A`;
        }

        const motorRpmElement = document.getElementById('motor-rpm');
        if (motorRpmElement && appsDataPb.currentMotorRpm !== undefined) {
            motorRpmElement.textContent = `${appsDataPb.currentMotorRpm} RPM`;
        }

        // Clear old apps1 and apps2 if they are no longer used by new protobuf structure
        const apps1Element = document.getElementById('apps1');
        if (apps1Element) apps1Element.textContent = '--'; 
        const apps2Element = document.getElementById('apps2');
        if (apps2Element) apps2Element.textContent = '--';

        if (this.debugMode) {
            console.log("UI updated with APPS data:", appsDataPb);
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
    updateTelemetryData(packet) { // packet is the new object from telemetry.js
        if (!packet || packet.type !== 'TelemetryPacket') {
            if (this.debugMode) console.warn('Received non-TelemetryPacket data in updateTelemetryData:', packet);
            // Log to telemetry monitor as an unknown structured message for inspection
            this.latestData.telemetry.messages.push({
                timestamp: packet.timestamp || new Date().toISOString(),
                type: packet.type || 'unknown_packet_type',
                content: typeof packet.data === 'object' ? JSON.stringify(packet.data || packet, null, 2) : (packet.data || packet)
            });
            this.refreshTelemetryMonitor();
            return;
        }

        // Log structured packet to the telemetry monitor view
        this.latestData.telemetry.messages.push({
            timestamp: packet.timestamp,
            // Get string name of enum: TelemetryPacketDataType[packet.packetType] might be undefined if enum value is out of typical range
            type: `Protobuf: ${(Object.keys(TelemetryPacketDataType).find(key => TelemetryPacketDataType[key] === packet.packetType) || 'UNKNOWN_TYPE')}`,
            content: packet.data // packet.data is already a JS object from .toObject()
        });
        if (this.latestData.telemetry.messages.length > 1000) {
            this.latestData.telemetry.messages.shift(); // Keep it to the last 1000 entries
        }
        this.refreshTelemetryMonitor(); // Helper function to update the telemetry view

        // Process the data based on packetType
        const packetPayload = packet.data; // This is the .toObject() result from TelemetryPacket

        if (this.debugMode) {
            console.log(`Processing TelemetryPacket - Type: ${packet.packetType}, Payload:`, packetPayload);
        }

        switch (packet.packetType) {
            case TelemetryPacketDataType.DATA_TYPE_APPS:
                if (packetPayload.appsData) {
                    if (this.debugMode) console.log("APPS Data Received for UI update:", packetPayload.appsData);
                    this.updateAPPSData(packetPayload.appsData);
                }
                break;
            case TelemetryPacketDataType.DATA_TYPE_BMS:
                if (packetPayload.bmsData) {
                    if (this.debugMode) console.log("BMS Data Received for UI update:", packetPayload.bmsData);
                    this.updateBatteryStatus(packetPayload.bmsData); 
                }
                break;
            case TelemetryPacketDataType.DATA_TYPE_INVERTER:
                if (packetPayload.inverterData) {
                    if (this.debugMode) console.log("Inverter Data Received for UI update:", packetPayload.inverterData);
                    this.updateInverterStatus(packetPayload.inverterData);
                }
                break;
            default:
                console.warn("Received TelemetryPacket with unknown packetType enum value:", packet.packetType, packetPayload);
        }
    }

    // New method for Inverter Data (placeholder for UI updates)
    updateInverterStatus(data) {
        // Assuming 'data' is the inverterData object from the TelemetryPacket
        this.latestData.inverter = data; // Cache it
        if (this.debugMode) console.log("Updating Inverter Status with data:", data);

        // Fault Code
        const faultCodeEl = document.getElementById('inverter-fault-code');
        if (faultCodeEl) {
            const faultName = Object.keys(InverterFaultCodeEnum).find(key => InverterFaultCodeEnum[key] === data.faultCode);
            faultCodeEl.textContent = faultName ? faultName.replace(/^FAULT_CODE_/, '') : 'UNKNOWN';
            // Optionally, add classes for styling based on fault (e.g., 'no-fault', 'fault-active')
            faultCodeEl.className = (data.faultCode === InverterFaultCodeEnum.FAULT_CODE_NO_FAULTS || data.faultCode === InverterFaultCodeEnum.FAULT_CODE_UNSPECIFIED) ? 'status-inactive' : 'status-active';
        }

        // Numerical Values
        const erpmEl = document.getElementById('inverter-erpm');
        if (erpmEl && data.erpm !== undefined) erpmEl.textContent = data.erpm;
        
        const dutyCycleEl = document.getElementById('inverter-duty-cycle');
        if (dutyCycleEl && data.dutyCycle !== undefined) dutyCycleEl.textContent = `${(data.dutyCycle * 100).toFixed(1)}%`;
        
        const inputDcVoltageEl = document.getElementById('inverter-input-dc-voltage');
        if (inputDcVoltageEl && data.inputDcVoltage !== undefined) inputDcVoltageEl.textContent = `${data.inputDcVoltage.toFixed(1)}V`;
        
        const acMotorCurrentEl = document.getElementById('inverter-ac-motor-current');
        if (acMotorCurrentEl && data.acMotorCurrent !== undefined) acMotorCurrentEl.textContent = `${data.acMotorCurrent.toFixed(1)}A`;
        
        const dcBatteryCurrentEl = document.getElementById('inverter-dc-battery-current');
        if (dcBatteryCurrentEl && data.dcBatteryCurrent !== undefined) dcBatteryCurrentEl.textContent = `${data.dcBatteryCurrent.toFixed(1)}A`;
        
        const controllerTempEl = document.getElementById('inverter-controller-temp');
        if (controllerTempEl && data.controllerTemperature !== undefined) controllerTempEl.textContent = `${data.controllerTemperature.toFixed(1)}°C`;
        
        const motorTempEl = document.getElementById('inverter-motor-temp');
        if (motorTempEl && data.motorTemperature !== undefined) motorTempEl.textContent = `${data.motorTemperature.toFixed(1)}°C`;

        // Drive Enabled Status
        const driveEnabledEl = document.getElementById('inverter-drive-enabled');
        if (driveEnabledEl) {
            driveEnabledEl.textContent = data.driveEnabled ? 'ENABLED' : 'DISABLED';
            driveEnabledEl.className = data.driveEnabled ? 'status-active' : 'status-inactive';
        }

        // Limit States
        const limitStatesContainer = document.getElementById('inverter-limit-states');
        if (limitStatesContainer && data.limitStates) {
            limitStatesContainer.innerHTML = ''; // Clear previous limit states
            const limits = data.limitStates;
            let activeLimits = [];
            for (const key in limits) {
                if (limits[key] === true && key !== '$jspbMessageInstance') { // Check for boolean true and exclude internal prop
                    activeLimits.push(key.replace(/([A-Z])/g, ' $1').replace(/^\s/, '').toUpperCase()); // Format key for display
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
