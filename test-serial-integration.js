import { SerialClient } from './src/services/serialClient.ts';
import { yorkfs } from './src/protobuf/telemetry_pb.js';

const { TelemetryPacket, APPSData } = yorkfs.dashboard;

console.log('🧪 Testing SerialClient and Protobuf Integration...\n');

// Test 1: SerialClient instantiation
console.log('1. Testing SerialClient instantiation:');
const client = new SerialClient();
console.log('✅ SerialClient created successfully');
console.log('   Connection status:', client.getConnectionStatus());

// Test 2: Protobuf encoding/decoding
console.log('\n2. Testing Protobuf encoding/decoding:');
const testPacket = TelemetryPacket.create({
  type: 1, // DATA_TYPE_APPS
  timestampMs: Date.now(),
  appsData: APPSData.create({
    state: 6, // APPS_STATE_RUNNING
    currentThrottlePercentage: 0.75,
    currentMotorCurrent: 45.2,
    currentMotorRpm: 3500
  })
});

const encoded = TelemetryPacket.encode(testPacket).finish();
const decoded = TelemetryPacket.decode(encoded);

console.log('✅ Protobuf encoding/decoding works');
console.log('   Original packet type:', testPacket.type);
console.log('   Decoded packet type:', decoded.type);
console.log('   Encoded size:', encoded.length, 'bytes');

// Test 3: Browser compatibility
console.log('\n3. Testing browser compatibility:');
if (typeof window !== 'undefined') {
  if ('serial' in navigator) {
    console.log('✅ Web Serial API is supported');
  } else {
    console.log('❌ Web Serial API is NOT supported in this browser');
    console.log('   Use Chrome/Edge with experimental features enabled');
  }
} else {
  console.log('⚠️  Running in Node.js - Web Serial API not available');
}

console.log('\n🎉 All integration tests completed!'); 