# York Formula Student Dashboard

A real-time monitoring dashboard for the York Formula Student electric race car. This web-based application provides a user interface for monitoring various vehicle systems through serial communication.

## Features

- **Real-time Data Monitoring**
  - System metrics (temperature, voltage, current)
  - Battery management system
  - Accelerator pedal sensors
  - CANBus messages

- **System Status Indicators**
  - TSAL (Tractive System Active Light)
  - IMD (Insulation Monitoring Device)
  - Shutdown circuit status

- **Multi-view Interface**
  - Dashboard overview
  - Battery management
  - CANBus monitor with command interface
  - APPS (Accelerator Pedal Position Sensor) configuration

## Getting Started

1. Open `index.html` in a modern web browser (Chrome recommended for Web Serial API support)
2. Connect to your serial device:
   - Click "Connect Serial"
   - Select your serial port
   - Default baud rate: 9600

### Simulation Mode

For testing without hardware:
- Press `Ctrl+Shift+S` before connecting to enable simulation mode
- Click "Connect Serial" to start the simulation
- Random test data will be generated for all views

## Data Format

The dashboard expects JSON-formatted messages through the serial connection:

```json
// Metrics data
{
    "type": "metrics",
    "temperature": 25.5,
    "voltage": 48.2,
    "current": 10.1,
    "tsal": true,
    "imd": true,
    "shutdown": true
}

// Battery data
{
    "type": "battery",
    "totalVoltage": 48.1,
    "soc": 85,
    "packTemp": 30.2,
    "cellVoltages": [
        {"voltage": 3.7, "temp": 30.2},
        // ... more cells
    ]
}

// APPS data
{
    "type": "apps",
    "apps1": 2.5,
    "apps2": 2.6,
    "throttle": 0.75
}

// CAN message
{
    "type": "can",
    "message": "ID=0x123 Data=[00 11 22 33]"
}
```

## Views

### Dashboard
- Overview of critical system metrics
- Real-time temperature, voltage, and current monitoring

### Battery
- Total pack voltage and state of charge
- Individual cell voltages and temperatures
- Pack temperature monitoring

### CANBus Monitor
- Real-time CAN message display
- Command interface for sending CAN messages
- Automatic TX/RX message labeling

### APPS
- Real-time sensor readings
- Throttle position calculation
- Sensor calibration interface
- Fault monitoring

## Development

### File Structure
- `index.html` - Main application structure
- `styles.css` - Application styling
- `app.js` - View management and UI updates
- `serial.js` - Serial communication and data handling

### Data Flow
1. Serial data received through Web Serial API
2. JSON parsing and type identification
3. Data distributed to relevant view components
4. Real-time UI updates

## Future Improvements
- Telemetry radio support for wireless monitoring
- Data logging and export capabilities
- Advanced CAN message filtering and decoding
- Graphical data visualization

## Created By
Roshan Christison - York Formula Student