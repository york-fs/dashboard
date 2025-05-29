'use client';

import { useState } from 'react';
import { SerialClient } from '../../services/serialClient';
import { yorkfs } from '../../protobuf/telemetry_pb.js';

export default function TestSerialPage() {
  const [status, setStatus] = useState('Not connected');
  const [client] = useState(() => new SerialClient());
  const [logs, setLogs] = useState<string[]>([]);
  const [textMode, setTextMode] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleRequestPort = async () => {
    try {
      addLog('Requesting serial port...');
      const port = await client.requestPort();
      const portInfo = port.getInfo();
      addLog(`Port selected: ${JSON.stringify(portInfo)}`);
      addLog(`Port readable: ${port.readable !== null}`);
      addLog(`Port writable: ${port.writable !== null}`);
      setStatus('Port selected');
    } catch (error) {
      addLog(`Error requesting port: ${error}`);
    }
  };

  const handleConnect = async () => {
    try {
      addLog('Opening serial port...');
      
      // Check if port is already open
      if (client.getConnectionStatus()) {
        addLog('Port is already connected');
        setStatus('Connected');
        return;
      }
      
      addLog('Attempting to open with baud rate: 57600');
      await client.open(57600);
      setStatus('Connected');
      addLog('Serial port opened successfully');
    } catch (error) {
      addLog(`Error opening port: ${error}`);
      
      // Provide specific guidance for common errors
      const errorStr = String(error);
      if (errorStr.includes('Failed to open serial port')) {
        addLog('💡 Troubleshooting steps:');
        addLog('  1. Close Arduino IDE, PuTTY, screen, minicom');
        addLog('  2. Close other browser tabs using serial');
        addLog('  3. Check if device is still connected (try different USB port)');
        addLog('  4. Try different baud rates (9600, 115200)');
        addLog('  5. Restart browser completely');
        addLog('  6. On Linux: sudo chmod 666 /dev/ttyUSB0 (or your device)');
      }
    }
  };

  const tryDifferentBaudRate = async (baudRate: number) => {
    try {
      addLog(`Trying baud rate: ${baudRate}`);
      await client.open(baudRate);
      setStatus('Connected');
      addLog(`Successfully opened with baud rate: ${baudRate}`);
    } catch (error) {
      addLog(`Failed with baud rate ${baudRate}: ${error}`);
    }
  };

  const handleStartReading = async () => {
    try {
      if (textMode) {
        addLog('Starting to read text data...');
        await client.startRawReading((data) => {
          // Convert bytes to text
          const text = new TextDecoder('utf-8', { fatal: false }).decode(data);
          addLog(`📨 Received text: "${text.trim()}"`);
          addLog(`📊 Raw bytes: ${Array.from(data).map((b: number) => `0x${b.toString(16).padStart(2, '0')}`).join(' ')}`);
        });
      } else {
        addLog('Starting to read telemetry data...');
        await client.startReading((telemetryPacket) => {
          addLog(`Received telemetry: ${JSON.stringify(telemetryPacket)}`);
        });
      }
    } catch (error) {
      addLog(`Error: ${error}`);
    }
  };

  const handleDisconnect = async () => {
    try {
      addLog('Closing serial port...');
      await client.close();
      setStatus('Not connected');
      addLog('Serial port closed');
    } catch (error) {
      addLog(`Error: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const testProtobufParsing = () => {
    // Create a known good protobuf packet for testing
    const { TelemetryPacket, APPSData } = yorkfs.dashboard;
    
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
    addLog(`Generated test protobuf data: ${encoded.length} bytes`);
    addLog(`Test data bytes: ${Array.from(encoded.slice(0, 16)).map((b: number) => `0x${b.toString(16).padStart(2, '0')}`).join(' ')}`);
    
    // Test parsing it back
    try {
      const decoded = TelemetryPacket.decode(encoded);
      addLog(`✅ Test protobuf parsing successful`);
      addLog(`Decoded packet type: ${decoded.type}`);
    } catch (error) {
      addLog(`❌ Test protobuf parsing failed: ${error}`);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Serial Client Test</h1>
      
      <div className="mb-4">
        <span className="font-semibold">Status: </span>
        <span className={`px-2 py-1 rounded ${
          status === 'Connected' ? 'bg-green-100 text-green-800' : 
          status === 'Port selected' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      </div>

      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={textMode}
            onChange={(e) => setTextMode(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="font-semibold">
            📝 Text Mode 
            <span className="font-normal text-gray-600">
              (Read ASCII text like &quot;hello world&quot; instead of protobuf)
            </span>
          </span>
        </label>
      </div>

      <div className="space-x-4 mb-6">
        <button 
          onClick={handleRequestPort}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          1. Request Port
        </button>
        
        <button 
          onClick={handleConnect}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={status === 'Not connected'}
        >
          2. Connect
        </button>
        
        <button 
          onClick={handleStartReading}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          disabled={status !== 'Connected'}
        >
          3. Start Reading {textMode ? '(Text)' : '(Protobuf)'}
        </button>
        
        <button 
          onClick={handleDisconnect}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          disabled={status === 'Not connected'}
        >
          Disconnect
        </button>
        
        <button 
          onClick={clearLogs}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear Logs
        </button>
        
        <button 
          onClick={testProtobufParsing}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Test Protobuf
        </button>
      </div>

      {status === 'Port selected' && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="font-semibold mb-2">Connection failed? Try different baud rates:</p>
          <div className="space-x-2">
            <button 
              onClick={() => tryDifferentBaudRate(9600)}
              className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
            >
              9600
            </button>
            <button 
              onClick={() => tryDifferentBaudRate(19200)}
              className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
            >
              19200
            </button>
            <button 
              onClick={() => tryDifferentBaudRate(38400)}
              className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
            >
              38400
            </button>
            <button 
              onClick={() => tryDifferentBaudRate(57600)}
              className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
            >
              57600
            </button>
            <button 
              onClick={() => tryDifferentBaudRate(115200)}
              className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
            >
              115200
            </button>
          </div>
        </div>
      )}

      <div className="bg-black-100 p-4 rounded h-96 overflow-y-auto">
        <h3 className="font-semibold mb-2">Console Logs:</h3>
        {logs.length === 0 ? (
          <p className="text-gray-500">No logs yet. Click &quot;Request Port&quot; to start.</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="text-sm font-mono mb-1">
              {log}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Requirements:</strong></p>
        <ul className="list-disc list-inside">
          <li>Use Chrome or Edge browser</li>
          <li>Web Serial API must be supported</li>
          <li>Have a USB serial device connected (SiK radio)</li>
        </ul>
      </div>
    </div>
  );
} 