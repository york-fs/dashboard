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
    }

    setupEventListeners() {
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', () => this.switchView(button.dataset.view));
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
}

document.addEventListener('DOMContentLoaded', () => {
    window.dashboardApp = new DashboardApp();
    window.dashboardApp.switchView('dashboard');
});