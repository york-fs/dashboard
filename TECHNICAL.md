# Technical Documentation 🛠️

## Architecture Deep Dive

### Design Principles

1. **Separation of Concerns**: Clear boundaries between hardware communication, data processing, state management, and UI
2. **Type Safety**: Comprehensive TypeScript coverage from hardware protocols to UI components
3. **Real-time Performance**: Optimized data flow for minimal latency and smooth UI updates
4. **Error Resilience**: Graceful handling of connection failures, parsing errors, and malformed data
5. **Developer Experience**: Hot reloading, comprehensive logging, and debugging tools

### Data Flow Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   SiK Radio     │───▶│   USB Serial     │───▶│  Web Serial API │
│   (Hardware)    │    │   (OS Driver)    │    │   (Browser)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React UI      │◀───│  Zustand Store   │◀───│  SerialClient   │
│  (Components)   │    │  (State Mgmt)    │    │  (Service)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                       ┌──────────────────┐    ┌─────────────────┐
                       │  TelemetryPacket │◀───│ Protobuf Parser │
                       │   (Data Types)   │    │   (Decoder)     │
                       └──────────────────┘    └─────────────────┘
```

## Protocol Implementation

### Protobuf Schema Design

The system uses Protocol Buffers for efficient binary serialization:

```protobuf
message TelemetryPacket {
  enum DataType {
    DATA_TYPE_UNSPECIFIED = 0;
    DATA_TYPE_APPS = 1;
    DATA_TYPE_BMS = 2;
    DATA_TYPE_INVERTER = 3;
  }

  DataType type = 1;
  uint64 timestamp_ms = 2;

  oneof payload {
    APPSData apps_data = 3;
    BMSData bms_data = 4;
    InverterData inverter_data = 5;
  }
}
```

### Wire Format Analysis

Protobuf uses variable-length encoding:
- **Tag**: `(field_number << 3) | wire_type`
- **Wire Types**: 0 (varint), 1 (64-bit), 2 (length-delimited), 5 (32-bit)
- **Field Numbers**: Must be unique within message scope

Example packet breakdown:
```
0x08 0x01 0x10 0x80 0x94 0xEB 0xDC 0x03 0x1A 0x10 ...
│    │    │    │    │    │    │    │    │    │
│    │    │    └────┴────┴────┴────┘    │    └─ Payload data
│    │    │         Timestamp (varint)   │
│    │    └─ Field 2 (timestamp), wire type 0
│    └─ DataType value (1 = APPS)
└─ Field 1 (type), wire type 0
```

### Serial Communication Protocol

#### Connection Parameters
- **Baud Rate**: 57600 (SiK radio standard)
- **Data Bits**: 8
- **Parity**: None
- **Stop Bits**: 1
- **Flow Control**: None

#### Error Handling Strategy
1. **Connection Level**: Automatic reconnection on disconnect
2. **Parsing Level**: Invalid packets logged and discarded
3. **Data Level**: Null safety and default values
4. **UI Level**: Stale data indicators and error messages

## Component Architecture

### Hierarchical Component Structure

```
Layout (Page wrapper)
├── ConnectionPanel (Serial control)
├── TelemetryGrid (Responsive layout)
│   ├── APPSComponent (Accelerator data)
│   ├── BMSComponent (Battery data)
│   └── InverterComponent (Motor controller)
└── StatusFooter (System info)
```

### State Management Pattern

Using Zustand for lightweight, performant state management:

```typescript
// Centralized store with typed selectors
const useTelemetryStore = create<TelemetryState>((set, get) => ({
  // State
  latestAppsData: null,
  isConnected: false,
  packetsReceived: 0,
  
  // Actions with automatic UI updates
  updateTelemetryPacket: (packet) => {
    set((state) => ({
      packetsReceived: state.packetsReceived + 1,
      lastPacketTime: Date.now(),
      // Conditional updates based on packet type
      ...(packet.appsData && { latestAppsData: packet.appsData })
    }));
  }
}));
```

### Component Design Patterns

#### Real-time Data Components
```typescript
export default function APPSComponent() {
  // Selective subscriptions for performance
  const appsData = useTelemetryStore(state => state.latestAppsData);
  const lastPacketTime = useTelemetryStore(state => state.lastPacketTime);
  
  // Computed values
  const dataAge = lastPacketTime ? Date.now() - lastPacketTime : null;
  const isDataStale = dataAge ? dataAge > 5000 : true;
  
  // Conditional rendering based on data availability
  if (!appsData) {
    return <PlaceholderState />;
  }
  
  return <LiveDataDisplay data={appsData} isStale={isDataStale} />;
}
```

## Performance Optimizations

### State Management Optimizations

1. **Selective Subscriptions**: Components only subscribe to needed state slices
2. **Shallow Comparisons**: Zustand uses shallow equality for re-render prevention
3. **Batch Updates**: Multiple state changes in single transaction
4. **Computed Values**: Expensive calculations cached with useMemo

### UI Performance

1. **Virtual Scrolling**: Not implemented (small dataset), but ready for large logs
2. **Throttled Updates**: High-frequency data throttled to 60fps
3. **Conditional Rendering**: Components only render when data available
4. **CSS Transitions**: Hardware-accelerated animations for smooth UX

### Memory Management

1. **Data Retention**: Only latest packet of each type stored
2. **Log Rotation**: Console logs limited to prevent memory leaks
3. **Connection Cleanup**: Proper resource disposal on unmount
4. **Weak References**: Event listeners properly cleaned up

## Error Handling Strategy

### Layered Error Handling

```typescript
// 1. Hardware Layer
class SerialClient {
  async open(baudRate: number) {
    try {
      await this.port.open({ baudRate });
    } catch (error) {
      // Log hardware error
      console.error('Hardware connection failed:', error);
      // Update global state
      useTelemetryStore.getState().setConnectionStatus('error', String(error));
      throw error; // Propagate to calling code
    }
  }
}

// 2. Parsing Layer
private parseTelemetryData(data: Uint8Array) {
  try {
    return TelemetryPacket.decode(data);
  } catch (error) {
    // Log parsing error with context
    console.error('Protobuf parsing failed:', {
      error,
      dataLength: data.length,
      firstBytes: Array.from(data.slice(0, 8)).map(b => `0x${b.toString(16)}`)
    });
    return null; // Return null instead of throwing
  }
}

// 3. UI Layer
function APPSComponent() {
  const lastError = useTelemetryStore(state => state.lastError);
  
  return (
    <div>
      {lastError && (
        <ErrorBanner message={lastError} onDismiss={clearError} />
      )}
      {/* Normal component content */}
    </div>
  );
}
```

### Error Recovery Strategies

1. **Automatic Reconnection**: Exponential backoff for connection retries
2. **Graceful Degradation**: UI remains functional with stale data
3. **User Feedback**: Clear error messages with suggested actions
4. **Fallback Modes**: Text mode for debugging malformed protobuf

## Testing Strategy

### Unit Testing Approach

```typescript
// Mock SerialClient for component testing
jest.mock('../services/serialClient', () => ({
  SerialClient: jest.fn().mockImplementation(() => ({
    requestPort: jest.fn(),
    open: jest.fn(),
    startReading: jest.fn(),
    close: jest.fn()
  }))
}));

// Test component with mock data
test('APPSComponent displays throttle percentage', () => {
  const mockStore = createMockStore({
    latestAppsData: { currentThrottlePercentage: 0.75 }
  });
  
  render(<APPSComponent />, { wrapper: StoreProvider(mockStore) });
  
  expect(screen.getByText('75.0%')).toBeInTheDocument();
});
```

### Integration Testing

```typescript
// Test full data flow
test('Serial data updates UI components', async () => {
  const mockSerialPort = createMockSerialPort();
  const client = new SerialClient();
  
  // Simulate hardware connection
  await client.requestPort();
  await client.open(57600);
  
  // Send mock protobuf data
  const testPacket = TelemetryPacket.create({
    type: 1, // APPS
    appsData: { currentThrottlePercentage: 0.5 }
  });
  
  mockSerialPort.simulateData(TelemetryPacket.encode(testPacket));
  
  // Verify state update
  await waitFor(() => {
    expect(useTelemetryStore.getState().latestAppsData).toEqual(
      expect.objectContaining({ currentThrottlePercentage: 0.5 })
    );
  });
});
```

### Hardware Testing

1. **Mock Hardware**: Software simulation of SiK radio data
2. **Real Hardware**: Automated tests with actual devices
3. **Boundary Testing**: Invalid data, connection failures, edge cases
4. **Performance Testing**: High-frequency data streams, memory usage

## Security Considerations

### Web Serial API Security

1. **User Permission**: Explicit user consent required for port access
2. **Origin Isolation**: Permissions tied to specific domains
3. **Sandboxing**: Browser security model applies
4. **No Network Access**: Direct serial only, no network bridges

### Data Validation

```typescript
// Input validation at every layer
function validateTelemetryPacket(packet: ITelemetryPacket): boolean {
  // Type validation
  if (!packet.type || packet.type < 0 || packet.type > 3) {
    return false;
  }
  
  // Timestamp validation
  if (!packet.timestampMs || packet.timestampMs <= 0) {
    return false;
  }
  
  // Payload validation based on type
  switch (packet.type) {
    case 1: // APPS
      return validateAPPSData(packet.appsData);
    case 2: // BMS
      return validateBMSData(packet.bmsData);
    case 3: // Inverter
      return validateInverterData(packet.inverterData);
    default:
      return false;
  }
}
```

### Memory Safety

1. **Bounds Checking**: Array access validation
2. **Type Guards**: Runtime type validation
3. **Resource Limits**: Maximum packet size enforcement
4. **Sanitization**: User input validation and encoding

## Deployment Considerations

### Build Optimization

```javascript
// next.config.js
module.exports = {
  // Bundle analysis
  experimental: {
    bundlePagesRouterDependencies: true
  },
  
  // Protobuf handling
  webpack: (config) => {
    config.module.rules.push({
      test: /\.proto$/,
      type: 'asset/source'
    });
    return config;
  },
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
};
```

### Browser Compatibility

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Web Serial API | ✅ 89+ | ✅ 89+ | ❌ | ❌ |
| Protobuf.js | ✅ | ✅ | ✅ | ✅ |
| ES2020 Features | ✅ | ✅ | ✅ | ✅ |
| WebAssembly | ✅ | ✅ | ✅ | ✅ |

### Production Deployment

1. **Static Generation**: Pre-render non-dynamic pages
2. **Code Splitting**: Automatic chunk optimization
3. **CDN Distribution**: Static assets via CDN
4. **Service Worker**: Offline functionality (future enhancement)

## Future Enhancements

### Planned Features

1. **Data Logging**: SQLite/IndexedDB storage for historical data
2. **Chart Visualization**: Real-time plotting with Chart.js/D3
3. **Alert System**: Configurable thresholds and notifications
4. **Export Functions**: CSV/JSON data export
5. **Configuration UI**: Runtime parameter adjustment

### Scalability Considerations

1. **Multi-Device Support**: Connect multiple SiK radios
2. **Protocol Versioning**: Backward compatibility handling
3. **Plugin Architecture**: Extensible component system
4. **WebRTC Integration**: Remote monitoring capabilities

### Performance Monitoring

```typescript
// Performance metrics collection
class PerformanceMonitor {
  private metrics = {
    packetsPerSecond: 0,
    parseTime: 0,
    renderTime: 0,
    memoryUsage: 0
  };
  
  recordPacketParse(startTime: number) {
    this.metrics.parseTime = performance.now() - startTime;
  }
  
  recordRender(componentName: string, renderTime: number) {
    console.log(`${componentName} render: ${renderTime}ms`);
  }
}
```

## Development Workflow

### Code Quality Tools

```json
{
  "scripts": {
    "lint": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest --watch",
    "test:ci": "jest --coverage --watchAll=false",
    "format": "prettier --write .",
    "analyze": "ANALYZE=true npm run build"
  }
}
```

### Git Workflow

1. **Feature Branches**: `feature/component-name`
2. **Conventional Commits**: `feat:`, `fix:`, `docs:`, `refactor:`
3. **Pre-commit Hooks**: Lint, format, type-check
4. **CI/CD Pipeline**: Automated testing and deployment

### Debug Utilities

```typescript
// Development helpers
if (process.env.NODE_ENV === 'development') {
  // Expose store to window for debugging
  (window as any).telemetryStore = useTelemetryStore;
  
  // Performance monitoring
  (window as any).performanceMonitor = new PerformanceMonitor();
  
  // Serial data injection for testing
  (window as any).injectTestData = (data: any) => {
    useTelemetryStore.getState().updateTelemetryPacket(data);
  };
}
``` 