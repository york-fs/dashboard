# Data Pipeline and Protocol Buffer Integration

This document outlines the data flow from the SiK telemetry radio to the frontend application, focusing on how `telemetry.js` handles binary data and Protocol Buffer (Protobuf) deserialization.

## 1. Overview

The primary data pipeline is as follows:

1.  **SiK Telemetry Radio (Sender)**: The device connected to the SiK radio (e.g., vehicle microcontroller) encodes sensor and system data into Protocol Buffer messages (`TelemetryPacket`). Each `TelemetryPacket` is prefixed with a 4-byte unsigned integer representing its length (Big Endian).
2.  **SiK Telemetry Radio (Receiver)**: The SiK radio connected to the dashboard computer receives these length-prefixed binary packets.
3.  **Web Serial API (`telemetry.js`)**: The dashboard application, running in the browser, uses the Web Serial API (via `telemetry.js`) to connect to the receiving SiK radio.
4.  **`telemetry.js` - Data Reception & Processing**:
    *   Reads raw binary data (`Uint8Array`) from the serial port.
    *   Buffers incoming data.
    *   Identifies and extracts complete `TelemetryPacket` messages based on their 4-byte length prefix.
    *   Deserializes these binary messages into JavaScript `TelemetryPacket` objects using the generated code from `vehicle_data_pb.js`.
    *   Notifies subscribers (primarily `app.js`) with the deserialized data.
5.  **`app.js` - Data Consumption & UI Update**:
    *   Receives the JavaScript `TelemetryPacket` object.
    *   Processes the packet based on its internal type (APPS, BMS, Inverter).
    *   Updates the relevant UI elements on the dashboard.

## 2. `telemetry.js` - Detailed Functionality

### 2.1. Connection and Binary Data Reception

*   **Connection**: `telemetryRadio.connect()` uses `navigator.serial.requestPort()` to allow the user to select the serial port connected to the SiK radio. It then opens the port with the configured baud rate (typically 57600 for SiK radios).
*   **Reading Data**: The `telemetryRadio.startReading()` method initiates a loop that continuously tries to read data from the port's readable stream (`this.port.readable.getReader()`). Each chunk of data (`value`) received from `await reader.read()` is a `Uint8Array`.

### 2.2. Buffering and Message Framing

*   **`this.receiveBuffer`**: A `Uint8Array` property in the `TelemetryRadio` class that accumulates incoming chunks of binary data from the serial port. This is necessary because a single `read()` operation might not yield a complete message, or might yield multiple messages.
*   **Length Prefixing**: The system expects each Protobuf `TelemetryPacket` to be preceded by a 4-byte unsigned integer (Big Endian) that specifies the length of the upcoming Protobuf message. This is defined by `this.LENGTH_PREFIX_SIZE = 4;`.
*   **`processReceiveBuffer()` Method**:
    1.  This method is called whenever new data is added to `this.receiveBuffer`.
    2.  It first checks if `this.expectedLength` (the length of the current message being sought) is `null`.
        *   If `null` and the `receiveBuffer` contains at least `LENGTH_PREFIX_SIZE` bytes, it reads the 4-byte length using a `DataView` (`view.getUint32(0, false)` for Big Endian) and stores it in `this.expectedLength`. The 4 length-prefix bytes are then sliced off the `receiveBuffer`.
        *   Includes a sanity check for `this.expectedLength` (e.g., not 0 or excessively large like > 2048 bytes). Invalid lengths cause an error log and an attempt to discard the presumed length to find the next packet.
    3.  If `this.expectedLength` is known (not `null`):
        *   It checks if `receiveBuffer` contains at least `this.expectedLength` more bytes (the actual message body).
        *   If yes, it extracts these `messageBytes`, slices them from `receiveBuffer`, and resets `this.expectedLength` to `null` to prepare for the next message.
        *   These `messageBytes` are then passed to the deserialization step.
    4.  The method loops to process multiple messages if they are present in the buffer.

### 2.3. Protobuf Deserialization

*   **Generated Code**: The system relies on `vehicle_data_pb.js`, which is generated from `vehicle_data.proto` by the Protocol Buffer compiler (`protoc`). This file contains the JavaScript definitions for the messages (e.g., `TelemetryPacket`, `APPSData`, `BMSData`, `InverterData`).
*   **Deserialization**: Inside `processReceiveBuffer()`, once `messageBytes` are extracted:
    *   `const vehicle_data_pb = require('./generated-protos/vehicle_data_pb.js');` makes the generated message classes available.
    *   `const telemetryPacket = vehicle_data_pb.TelemetryPacket.deserializeBinary(messageBytes);` converts the binary `Uint8Array` into a JavaScript `TelemetryPacket` object.
*   **Notification to Subscribers**: After successful deserialization, `telemetry.js` notifies subscribers on the `'telemetry'` channel using `this.notifySubscribers('telemetry', packetInfo)`. The `packetInfo` object has the following structure:
    ```javascript
    {
        type: 'TelemetryPacket', // Indicates the envelope message type
        packetType: telemetryPacket.getType(), // The specific data type enum from TelemetryPacket.DataType (e.g., DATA_TYPE_APPS)
        timestamp: telemetryPacket.getTimestampMs() || new Date().toISOString(), // Timestamp from packet or current time
        data: telemetryPacket.toObject(), // Plain JavaScript object representation of the TelemetryPacket
        length: /* original binary length of the messageBytes */
    }
    ```
    The `telemetryPacket.toObject()` provides a simple JavaScript object that is easier for `app.js` to consume.

### 2.4. AT Command Handling (SiK Radios)

*   **Distinguishing AT Commands**: `handleReceivedData()` attempts to distinguish plain text AT command responses from binary Protobuf data.
    *   It first tries to decode a small sample of the incoming `rawDataBytes` as UTF-8 text.
    *   If this decoded text contains common AT response patterns (e.g., "OK", "ERROR", "RSSI:", "S<number>="), and the chunk is relatively short, it's treated as an AT command response. The full chunk is then decoded and processed by methods like `parseParameterResponse` or `parseRSSI`.
    *   If the data doesn't match these text patterns or fails UTF-8 decoding, it's assumed to be binary Protobuf data and is appended to `this.receiveBuffer`.
*   **Sending AT Commands**: `sendATCommand(command, waitForResponse)` method:
    *   Formats AT commands (e.g., adds "AT" prefix, "\r" suffix).
    *   Writes them to the serial port using `this.writer.write()`.
    *   For "+++" (enter command mode), it includes logic to wait for an "OK" response by temporarily subscribing to raw data.

### 2.5. Error Handling during Deserialization

*   **Catching Errors**: The `TelemetryPacket.deserializeBinary()` call is within a `try...catch` block in `processReceiveBuffer()`.
*   **Consecutive Error Counter**: `this.deserializationErrorCount` tracks how many consecutive times deserialization fails. It's reset to `0` upon a successful deserialization.
*   **Notification**: On failure, an error is logged to the console (including a hex dump of the failed message bytes), and a `'status'` notification is sent to subscribers:
    ```javascript
    {
        type: 'deserialization_error',
        message: 'Failed to deserialize telemetry packet. Attempting to recover.',
        errorDetails: error.message,
        errorCount: this.deserializationErrorCount,
        packetLength: /* length of the packet that failed */
    }
    ```
*   **Buffer Clearing Threshold**: If `this.deserializationErrorCount` reaches `this.MAX_CONSECUTIVE_DESERIALIZATION_ERRORS` (default is 3):
    *   A warning is logged.
    *   `this.receiveBuffer` is completely cleared.
    *   `this.expectedLength` is set to `null`.
    *   The error counter is reset.
    *   A `'status'` notification is sent: `{ type: 'buffer_cleared_due_to_errors', ... }`.
    This strategy attempts to recover from transient errors but clears the buffer if corruption seems persistent, allowing the system to try and resynchronize with the data stream. 