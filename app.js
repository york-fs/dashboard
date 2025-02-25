class DashboardApp {
    constructor() {
        this.currentView = 'dashboard';
        this.views = {
            dashboard: this.createDashboardView.bind(this),
            battery: this.createBatteryView.bind(this),
            canbus: this.createCANBusView.bind(this),
            apps: this.createAPPSView.bind(this)
        };
        
        this.setupEventListeners();
        this.setupSerialHandlers();
    }

    setupEventListeners() {
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', () => this.switchView(button.dataset.view));
        });
    }

    setupSerialHandlers() {
        // Add event listener for CAN command sending
        document.getElementById('send-command')?.addEventListener('click', () => {
            const commandInput = document.getElementById('can-command');
            if (commandInput && commandInput.value) {
                serialConnection.sendData(commandInput.value + '\n');
                commandInput.value = '';
            }
        });
    }

    switchView(viewName) {
        if (this.views[viewName]) {
            this.currentView = viewName;
            const contentArea = document.getElementById('main-view');
            contentArea.innerHTML = '';
            contentArea.appendChild(this.views[viewName]());

            document.querySelectorAll('.nav-button').forEach(button => {
                button.classList.toggle('active', button.dataset.view === viewName);
            });
        }
    }

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

    updateDashboardMetrics(data) {
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

    updateBatteryStatus(data) {
        if (data.totalVoltage) {
            document.getElementById('total-voltage').textContent = `${data.totalVoltage.toFixed(1)}V`;
        }
        if (data.soc) {
            document.getElementById('soc').textContent = `${data.soc.toFixed(1)}%`;
        }
        if (data.packTemp) {
            document.getElementById('pack-temp').textContent = `${data.packTemp.toFixed(1)}°C`;
        }
        if (data.cellVoltages) {
            const tbody = document.querySelector('#voltage-table tbody');
            if (tbody) {
                tbody.innerHTML = data.cellVoltages.map((cell, index) => `
                    <tr>
                        <td>Cell ${index + 1}</td>
                        <td>${cell.voltage.toFixed(3)}V</td>
                        <td>${cell.temp.toFixed(1)}°C</td>
                    </tr>
                `).join('');
            }
        }
    }

    updateAPPSData(data) {
        if (data.apps1) {
            document.getElementById('apps1').textContent = data.apps1.toFixed(2);
        }
        if (data.apps2) {
            document.getElementById('apps2').textContent = data.apps2.toFixed(2);
        }
        if (data.throttle) {
            document.getElementById('throttle').textContent = `${(data.throttle * 100).toFixed(1)}%`;
        }
    }

    updateCANMonitor(message) {
        const output = document.getElementById('can-output');
        if (output) {
            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            output.appendChild(messageElement);
            output.scrollTop = output.scrollHeight;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.dashboardApp = new DashboardApp();
    window.dashboardApp.switchView('dashboard');
});