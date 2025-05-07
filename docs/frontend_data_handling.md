# Frontend Data Handling and UI Updates (`app.js`)

This document details how `app.js` receives and processes the deserialized Protocol Buffer (Protobuf) data from `telemetry.js` to update the dashboard's user interface.

## 1. Data Subscription

*   **`setupDataSubscriptions()`**: Within the `DashboardApp` class, this method is responsible for setting up listeners for data streams.
*   **Subscribing to `telemetryRadio`**: It specifically subscribes to the `'telemetry'` event from the global `window.telemetryRadio` instance (which is an instance of `TelemetryRadio` from `telemetry.js`).
    ```javascript
    // In setupDataSubscriptions()
    if (window.telemetryRadio) {
        const telemetrySubscriptions = [
            ['telemetry', this.updateTelemetryData.bind(this)],
            // ... other subscriptions like 'status', 'raw' ...
        ];
        // ... subscription logic ...
    }
    ```
*   The callback registered for the `'telemetry'` event is `this.updateTelemetryData.bind(this)`.

## 2. `updateTelemetryData(packet)` Method

This is the primary method in `app.js` for handling incoming structured telemetry data.

*   **Input `packet` Structure**: It expects a `packet` object from `telemetry.js` with the following structure (as documented in `data_pipeline_and_protobuf.md`):
    ```javascript
    {
        type: 'TelemetryPacket',      // The overall envelope type
        packetType: /* enum value from TelemetryPacket.DataType */,
        timestamp: /* timestamp */,
        data: { /* plain JS object from telemetryPacket.toObject() */
            // e.g., appsData: { state, currentThrottlePercentage, ... },
            //       bmsData: { shutdownActivated, segmentsList, ... },
            //       inverterData: { faultCode, erpm, limitStates, ... }
        },
        length: /* original binary length */
    }
    ```
*   **Initial Check**: It first verifies if `packet.type === 'TelemetryPacket'`. If not, it logs the unknown data to the telemetry monitor for debugging.
*   **Telemetry Monitor Update**: A representation of the received `packet.data` (the Protobuf message content as a JavaScript object) is logged to the telemetry monitor view (`#telemetry-output`) using the `refreshTelemetryMonitor()` helper. The log includes the specific `packetType` (e.g., "Protobuf: DATA_TYPE_APPS").
*   **Data Routing with `switch`**: A `switch` statement on `packet.packetType` (which is an enum value from `proto.yorkfs.dashboard.TelemetryPacket.DataType`) routes the `packet.data` (referred to as `packetPayload` in the method) to specific handler methods:
    *   `TelemetryPacketDataType.DATA_TYPE_APPS`: Calls `this.updateAPPSData(packetPayload.appsData)`.
    *   `TelemetryPacketDataType.DATA_TYPE_BMS`: Calls `this.updateBatteryStatus(packetPayload.bmsData)`.
    *   `TelemetryPacketDataType.DATA_TYPE_INVERTER`: Calls `this.updateInverterStatus(packetPayload.inverterData)`.
*   **Enum Access**: The `TelemetryPacketDataType` enum is accessed via a global constant `const TelemetryPacketDataType = proto.yorkfs.dashboard.TelemetryPacket.DataType;` defined at the top of `app.js`, assuming `vehicle_data_pb.js` has loaded and exposed the `proto` namespace globally.

## 3. Specific Data Handler Methods

These methods are responsible for updating the UI elements with the data from the corresponding parts of the `TelemetryPacket`.

### 3.1. `updateAPPSData(appsDataPb)`

*   Receives the `appsData` object from the deserialized `TelemetryPacket`.
*   Updates HTML elements with IDs:
    *   `#apps-state`: Displays the string name of the APPS state (e.g., "RUNNING", "SENSOR_ERROR"), derived from `appsDataPb.state` using the `APPSStateEnum`.
    *   `#throttle`: Displays `appsDataPb.currentThrottlePercentage` (formatted as %). 
    *   `#motor-current`: Displays `appsDataPb.currentMotorCurrent` (formatted with "A").
    *   `#motor-rpm`: Displays `appsDataPb.currentMotorRpm` (formatted with "RPM").
*   Clears previous content of `#apps1` and `#apps2` as these raw sensor values are not part of the current `APPSData` Protobuf message.
*   **Note**: This method relies on `createAPPSView()` to have generated the corresponding HTML elements.

### 3.2. `updateBatteryStatus(bmsDataPb)`

*   Receives the `bmsData` object from the deserialized `TelemetryPacket`.
*   **Total Voltage (`#total-voltage`)**: Calculated by summing all `cellVoltagesList` values from all segments in `bmsDataPb.segmentsList`.
*   **State of Charge (SoC) (`#soc`)**: Currently displayed as "--%" because SoC is not directly available in the `BMSData` Protobuf message. This is a point for future enhancement (e.g., adding SoC to the Protobuf message or calculating it).
*   **Pack Temperature (`#pack-temp`)**: Calculated as an average of all valid temperatures found in `bmsDataPb.segmentsList[*].temperaturesList`. Displays "--°C" if no temperatures are available.
*   **Cell Voltages Table (`#voltage-table tbody`)**: Populated by iterating through `bmsDataPb.segmentsList`. For each segment, it iterates through `cellVoltagesList` and attempts to pair each voltage with a corresponding temperature from `segment.temperaturesList` (by index). Cell IDs are generated (e.g., "S1-C1").
    *   **Note**: The cell-to-temperature mapping by index is a simple assumption and might need refinement based on actual sensor configuration.
*   **Shutdown Status (`#bms-shutdown-activated`, `#bms-shutdown-reason`)**: Displays "YES"/"NO" for activation and the string name of the `ShutdownReason` (from `BMSShutdownReasonEnum`) if activated. Adds CSS classes `status-active` or `status-inactive`.
*   **Other Metrics**: Updates LVS rail (`#bms-lvs-rail`), positive current (`#bms-positive-current`), and negative current (`#bms-negative-current`).
*   **Note**: This method relies on `createBatteryView()` to have generated the corresponding HTML elements.

### 3.3. `updateInverterStatus(inverterDataPb)`

*   Receives the `inverterData` object from the deserialized `TelemetryPacket`.
*   **Fault Code (`#inverter-fault-code`)**: Displays the string name of the fault (e.g., "OVERVOLTAGE", "NO_FAULTS") from `inverterDataPb.faultCode` using `InverterFaultCodeEnum`. Adds CSS classes `status-active` or `status-inactive`.
*   **Numerical Values**: Updates elements for ERPM (`#inverter-erpm`), duty cycle (`#inverter-duty-cycle`), input DC voltage (`#inverter-input-dc-voltage`), AC motor current (`#inverter-ac-motor-current`), DC battery current (`#inverter-dc-battery-current`), controller temperature (`#inverter-controller-temp`), and motor temperature (`#inverter-motor-temp`).
*   **Drive Enabled (`#inverter-drive-enabled`)**: Displays "ENABLED"/"DISABLED" and sets CSS classes `status-active` or `status-inactive`.
*   **Limit States (`#inverter-limit-states`)**: Iterates through the `inverterDataPb.limitStates` object. For each limit state that is `true`, it formats the key (e.g., `capacitorTemperature` becomes "CAPACITOR TEMPERATURE") and displays it in an unordered list. Shows "No active limits." if none are true.
*   **Note**: This method relies on a view (e.g., `createInverterView()` or similar, yet to be fully defined) to have generated the corresponding HTML elements.

## 4. Enum Access for UI Display

*   To display human-readable names for enum values (e.g., APPS state, BMS shutdown reason, Inverter fault code), `app.js` defines constants at the top that map to the enums in the globally available `proto` object (from `vehicle_data_pb.js`):
    ```javascript
    const TelemetryPacketDataType = proto.yorkfs.dashboard.TelemetryPacket.DataType;
    const APPSStateEnum = proto.yorkfs.dashboard.APPSData.APPSState;
    const BMSShutdownReasonEnum = proto.yorkfs.dashboard.BMSData.ShutdownReason;
    const InverterFaultCodeEnum = proto.yorkfs.dashboard.InverterData.FaultCode;
    ```
*   The code then typically uses `Object.keys(ENUM_NAME).find(key => ENUM_NAME[key] === enumValue)` to get the string key for a given enum integer value.

## 5. HTML Structure Dependency

All UI update methods in `app.js` directly manipulate the DOM using `document.getElementById()` or `document.querySelector()`. This means that the HTML generated by the `create...View()` methods must contain elements with the specific IDs that these update methods are targeting. 