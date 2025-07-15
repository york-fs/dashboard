# Dashboard

A real-time telemetry dashboard for electric vehicles using Web Serial API, protobuf, and React. Displays live data from APPS (Accelerator Pedal Position), BMS (Battery Management System), and Inverter (Motor Controller) via SiK telemetry radios.

## Quick Start

### Prerequisites

- **Browser**: Chrome or Edge (Web Serial API support required)
- **Runtime**: [Bun](https://bun.sh/) (recommended) or Node.js 18+
- **Hardware**: SiK telemetry radio connected via USB
- **Optional**: To simulate how the program works when receiving data without the hardware of a car/emulator, you can use [Cleansend](https://github.com/york-fs/cleansend)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd dashboard

# Install dependencies
bun install

# Start development server
bun run dev
```

Visit `http://localhost:3000` to access the dashboard.

## Features

### Real-time Telemetry Display
- **APPS Component**: Throttle position, motor current/RPM, status monitoring
- **BMS Component**: Battery voltage, current, temperature, cell monitoring, shutdown status
- **Inverter Component**: Motor control, fault codes, temperature, limit states

### Modern UI/UX
- Responsive design (mobile → tablet → desktop)
- Real-time connection status indicators
- Color-coded warnings and status displays
- Professional dashboard layout

### Robust Communication
- Web Serial API integration
- Protobuf message parsing
- Automatic reconnection handling
- Comprehensive error reporting

### Developer Experience
- Full TypeScript support
- Component-based architecture
- Global state management (Zustand)
- Hot module reloading
- Comprehensive testing tools

## Architecture

### System Overview

```
SiK Radio → USB Serial → Web Serial API → SerialClient → Protobuf Parser → Zustand Store → React Components
```

### Directory Structure

```
dashboard/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Main dashboard page
│   │   └── test-serial/       # Diagnostic page
│   ├── components/            # Reusable UI components
│   │   └── Layout.tsx         # Page layout wrapper
│   ├── features/
│   │   └── telemetry/         # Telemetry feature module
│   │       ├── APPSComponent.tsx
│   │       ├── BMSComponent.tsx
│   │       ├── InverterComponent.tsx
│   │       └── telemetrySlice.ts  # State management
│   ├── services/              # Core services
│   │   └── serialClient.ts    # Serial communication
│   ├── protobuf/              # Protocol buffer definitions
│   │   ├── telemetry.proto    # Schema definition
│   │   ├── telemetry_pb.js    # Generated JavaScript
│   │   └── telemetry_pb.d.ts  # Generated TypeScript types
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

### Data Flow

1. **Hardware Layer**: SiK telemetry radio transmits protobuf data
2. **Communication Layer**: SerialClient handles Web Serial API
3. **Parsing Layer**: Protobuf decoder converts binary to structured data
4. **State Layer**: Zustand store manages global telemetry state
5. **UI Layer**: React components display real-time data

### Key Components

#### SerialClient (`src/services/serialClient.ts`)
- Manages Web Serial API connection
- Handles protobuf parsing
- Automatic state updates
- Error handling and recovery

#### Telemetry Store (`src/features/telemetry/telemetrySlice.ts`)
- Global state management with Zustand
- Real-time data updates
- Connection status tracking
- Packet statistics

#### UI Components
- **Layout**: Consistent page structure
- **APPSComponent**: Accelerator pedal monitoring
- **BMSComponent**: Battery system monitoring
- **InverterComponent**: Motor controller monitoring

## Hardware Setup

### SiK Telemetry Radio Configuration

1. **Connection**: Connect SiK radio to USB port
2. **Baud Rate**: 57600 (default, configurable)
3. **Data Format**: Binary protobuf messages
4. **Protocol**: See `src/protobuf/telemetry.proto`

### Supported Message Types

- `APPSData`: Accelerator pedal position sensor data
- `BMSData`: Battery management system data
- `InverterData`: Motor controller data

### Linux Permissions (if needed)

```bash
# Add user to dialout group
sudo usermod -a -G dialout $USER

# Set device permissions
sudo chmod 666 /dev/ttyUSB0
```

## Usage Guide

### Connecting to Telemetry

1. **Start Dashboard**: Run `bun run dev`
2. **Connect Hardware**: Ensure SiK radio is connected
3. **Browser Setup**: Use Chrome or Edge
4. **Connect**: Click "Connect Serial" button
5. **Select Port**: Choose your USB serial device
6. **Monitor**: View real-time telemetry data

### Dashboard Features

#### Connection Panel
- **Status Indicator**: Green (connected) / Red (disconnected)
- **Packet Counter**: Shows received message count
- **Error Display**: Shows connection or parsing errors
- **Quick Connect**: One-click connection setup

#### APPS Monitor
- **Status**: Current sensor state (IDLE, RUNNING, ERROR, etc.)
- **Throttle Position**: Visual bar showing 0-100% position
- **Motor Metrics**: Current (A) and RPM readings
- **Data Age**: Time since last update

#### BMS Monitor
- **Shutdown Status**: Normal operation or shutdown state
- **Pack Voltage**: Calculated total from all segments
- **Current Flow**: Positive/negative current measurements
- **Cell Stats**: Min/max voltages and temperatures
- **Segment Count**: Number of active battery segments

#### Inverter Monitor
- **Fault Status**: NO_FAULTS, error codes, or specific faults
- **Drive Status**: Enabled/disabled state
- **Motor Control**: RPM, duty cycle, current measurements
- **Temperature**: Controller and motor temperature monitoring
- **Limit States**: Active protection limits

### Troubleshooting Connection

Visit `/test-serial` for detailed diagnostics:
- Serial port detection
- Connection testing
- Raw data inspection
- Protobuf parsing verification
- Text mode for debugging

## Development

### Development Setup

```bash
# Install dependencies
bun install

# Start development server with hot reload
bun run dev

# Build for production
bun run build

# Run production build
bun run start

# Type checking
bun run type-check

# Linting
bun run lint
```

### Environment Requirements

- **Node.js**: 18+ or Bun runtime
- **Browser**: Chrome/Edge for Web Serial API
- **TypeScript**: 5.0+
- **React**: 18+
- **Next.js**: 15+

### Key Dependencies

```json
{
  "next": "^15.3.2",
  "react": "^19.0.0",
  "zustand": "^5.0.2",
  "protobufjs": "^7.4.0",
  "tailwindcss": "^3.4.1",
  "typescript": "^5.6.3"
}
```

### Adding New Telemetry Types

1. **Update Protobuf Schema**:
   ```protobuf
   // Add to src/protobuf/telemetry.proto
   message NewSensorData {
     float value = 1;
     uint32 timestamp = 2;
   }
   ```

2. **Regenerate Types**:
   ```bash
   npx pbjs -t static-module -w es6 -o src/protobuf/telemetry_pb.js src/protobuf/telemetry.proto
   npx pbts -o src/protobuf/telemetry_pb.d.ts src/protobuf/telemetry_pb.js
   ```

3. **Update State Management**:
   ```typescript
   // Add to telemetrySlice.ts
   latestNewSensorData: INewSensorData | null;
   ```

4. **Create Component**:
   ```typescript
   // Create NewSensorComponent.tsx
   const newSensorData = useTelemetryStore(state => state.latestNewSensorData);
   ```

### Testing

#### Manual Testing
- Use `/test-serial` page for connection testing
- Test with different baud rates
- Verify protobuf parsing with known data

#### Hardware Testing
- Connect SiK radio with test data
- Verify all message types parse correctly
- Test connection recovery scenarios

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Standard configuration
- **Prettier**: Automatic formatting
- **Components**: Functional components with hooks
- **State**: Zustand for global state, local state for UI

## API Reference

### SerialClient Class

```typescript
class SerialClient {
  // Request port access
  async requestPort(): Promise<SerialPort>
  
  // Open connection with baud rate
  async open(baudRate: number = 57600): Promise<void>
  
  // Start reading telemetry data
  async startReading(callback?: (packet: ITelemetryPacket) => void): Promise<void>
  
  // Start reading raw data (debugging)
  async startRawReading(callback: (data: Uint8Array) => void): Promise<void>
  
  // Close connection
  async close(): Promise<void>
  
  // Get connection status
  getConnectionStatus(): boolean
}
```

### Telemetry Store

```typescript
interface TelemetryState {
  // Latest data
  latestAppsData: IAPPSData | null;
  latestBmsData: IBMSData | null;
  latestInverterData: IInverterData | null;
  
  // Connection state
  isConnected: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  
  // Statistics
  packetsReceived: number;
  lastPacketTime: number | null;
  
  // Actions
  updateTelemetryPacket(packet: ITelemetryPacket): void;
  setConnectionStatus(status: string, error?: string): void;
}
```

### Protobuf Messages

See `src/protobuf/telemetry.proto` for complete message definitions:

- `TelemetryPacket`: Root message container
- `APPSData`: Accelerator pedal position sensor
- `BMSData`: Battery management system
- `InverterData`: Motor controller

## Troubleshooting

### Common Issues

#### "Web Serial API not supported"
- **Solution**: Use Chrome or Edge browser
- **Check**: `chrome://flags/#enable-experimental-web-platform-features`

#### "Failed to open serial port"
- **Causes**: Port in use, permission denied, wrong baud rate
- **Solutions**: 
  - Close other applications using the port
  - Check Linux permissions (`sudo chmod 666 /dev/ttyUSB0`)
  - Try different baud rates (9600, 115200)

#### "Invalid wire type" protobuf error
- **Cause**: Receiving text data instead of binary protobuf
- **Solution**: Enable text mode in test page, verify data source

#### Connection drops frequently
- **Causes**: USB cable, power management, interference
- **Solutions**: Try different USB port/cable, disable USB power management

### Debug Mode

Use the test page at `/test-serial`:
1. Enable text mode for ASCII data
2. View raw bytes for protobuf debugging
3. Test different baud rates
4. Monitor connection status

### Logging

Enable detailed logging:
```javascript
// In browser console
localStorage.setItem('debug', 'serial:*');
```

## Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** pull request

### Code Standards

- Follow TypeScript strict mode
- Use functional components
- Add JSDoc comments for public APIs
- Test changes with real hardware when possible
- Update documentation for new features

### Issue Reporting

Include:
- Browser version and OS
- Hardware configuration
- Steps to reproduce
- Error messages and console logs
- Screenshots if applicable

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Next.js** for the React framework
- **Bun** for fast JavaScript runtime
- **Tailwind CSS** for styling
- **Zustand** for state management
- **protobuf.js** for protocol buffer support
- **Web Serial API** for hardware communication

---

