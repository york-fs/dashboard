'use client';

import { useState, useRef } from 'react';

export default function DebugSerialPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [port, setPort] = useState<SerialPort | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [rawDataCount, setRawDataCount] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [parsedPackets, setParsedPackets] = useState(0);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const isReadingRef = useRef(false);
  const dataBufferRef = useRef<Uint8Array>(new Uint8Array(0));

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-25), `[${timestamp}] ${message}`]);
  };

  const concatUint8Arrays = (a: Uint8Array, b: Uint8Array): Uint8Array => {
    const result = new Uint8Array(a.length + b.length);
    result.set(a, 0);
    result.set(b, a.length);
    return result;
  };

  const processBuffer = async () => {
    const { yorkfs } = await import('../../protobuf/telemetry_pb.js');
    const { TelemetryPacket } = yorkfs.dashboard;
    
    if (dataBufferRef.current.length < 2) {
      return; // Need at least 2 bytes
    }
    
    addLog(`🔍 Processing buffer: ${dataBufferRef.current.length} bytes`);
    
    // Simple approach: try to parse one packet from the beginning
    try {
      const packet = TelemetryPacket.decode(dataBufferRef.current);
      
      // Calculate consumed bytes by re-encoding
      const encodedPacket = TelemetryPacket.encode(packet).finish();
      const consumedBytes = encodedPacket.length;
      
      addLog(`✅ Successfully parsed packet type ${packet.type}, consumed ${consumedBytes} bytes`);
      setParsedPackets(prev => prev + 1);
      
      // Remove consumed bytes from buffer
      dataBufferRef.current = dataBufferRef.current.slice(consumedBytes);
      
    } catch (error) {
      const errorMsg = (error as Error).message;
      addLog(`⚠️ Failed to parse: ${errorMsg.slice(0, 30)}...`);
      
      // If parsing fails, look for the next 0x08 (packet start)
      let nextStart = -1;
      for (let i = 1; i < Math.min(dataBufferRef.current.length, 30); i++) {
        if (dataBufferRef.current[i] === 0x08) {
          nextStart = i;
          break;
        }
      }
      
      if (nextStart > 0) {
        addLog(`🔍 Discarding ${nextStart} bytes, found potential start`);
        dataBufferRef.current = dataBufferRef.current.slice(nextStart);
      } else if (dataBufferRef.current.length > 500) {
        addLog(`⚠️ Buffer too large, clearing`);
        dataBufferRef.current = new Uint8Array(0);
      }
    }
  };

  const connectToSerial = async () => {
    if (!('serial' in navigator)) {
      addLog('❌ Web Serial API not supported');
      return;
    }

    try {
      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 57600 });
      
      setPort(selectedPort);
      setIsConnected(true);
      addLog('✅ Connected to serial port');

      // Start reading
      if (selectedPort.readable) {
        readerRef.current = selectedPort.readable.getReader();
        isReadingRef.current = true;
        startReading();
      }
    } catch (error) {
      addLog(`❌ Connection failed: ${error}`);
    }
  };

  const startReading = async () => {
    if (!readerRef.current || !isReadingRef.current) return;

    try {
      while (isReadingRef.current) {
        const { value, done } = await readerRef.current.read();
        
        if (done) {
          addLog('📡 Reading completed');
          break;
        }

        if (value && value.length > 0) {
          setRawDataCount(prev => prev + 1);
          setTotalBytes(prev => prev + value.length);
          
          // Show first few bytes
          const firstBytes = Array.from(value.slice(0, 8))
            .map(b => `0x${b.toString(16).padStart(2, '0')}`)
            .join(' ');
          
          addLog(`📦 Chunk ${rawDataCount + 1}: ${value.length} bytes [${firstBytes}...]`);
          
          // Add to buffer and process
          dataBufferRef.current = concatUint8Arrays(dataBufferRef.current, value);
          await processBuffer();
        }
      }
    } catch (error) {
      addLog(`❌ Reading error: ${error}`);
    }
  };

  const disconnect = async () => {
    isReadingRef.current = false;
    
    if (readerRef.current) {
      await readerRef.current.cancel();
      readerRef.current.releaseLock();
      readerRef.current = null;
    }

    if (port) {
      await port.close();
      setPort(null);
    }

    setIsConnected(false);
    dataBufferRef.current = new Uint8Array(0);
    addLog('🔌 Disconnected');
  };

  const clearLogs = () => {
    setLogs([]);
    setRawDataCount(0);
    setTotalBytes(0);
    setParsedPackets(0);
    dataBufferRef.current = new Uint8Array(0);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🐛 Serial Debug Tool (Buffered)</h1>
      
      <div className="mb-6 space-x-4">
        <button
          onClick={connectToSerial}
          disabled={isConnected}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
          Connect to Serial Port
        </button>
        
        <button
          onClick={disconnect}
          disabled={!isConnected}
          className="px-4 py-2 bg-red-600 text-white rounded disabled:bg-gray-400"
        >
          Disconnect
        </button>
        
        <button
          onClick={clearLogs}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Clear Logs
        </button>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <div className="text-sm text-gray-600">Status</div>
          <div className="text-lg font-bold">
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>
        </div>
        
        <div className="bg-green-100 p-4 rounded">
          <div className="text-sm text-gray-600">Data Chunks</div>
          <div className="text-lg font-bold">{rawDataCount}</div>
        </div>
        
        <div className="bg-purple-100 p-4 rounded">
          <div className="text-sm text-gray-600">Total Bytes</div>
          <div className="text-lg font-bold">{totalBytes}</div>
        </div>
        
        <div className="bg-yellow-100 p-4 rounded">
          <div className="text-sm text-gray-600">Parsed Packets</div>
          <div className="text-lg font-bold text-green-600">{parsedPackets}</div>
        </div>
      </div>

      <div className="bg-black text-green-400 p-4 rounded h-96 overflow-y-auto font-mono text-sm">
        <div className="mb-2 text-gray-400">🔍 Serial Debug Log (with buffering):</div>
        {logs.length === 0 ? (
          <div className="text-gray-500">No logs yet. Connect to a serial port to start debugging.</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="mb-1">{log}</div>
          ))
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <h3 className="font-bold mb-2">🔧 Debug Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Click "Connect to Serial Port" and select your telemetry radio port</li>
          <li>Start your Python vehicle simulator on the other machine</li>
          <li>Watch the "Parsed Packets" counter - it should increase steadily</li>
          <li>Look for "✅ Successfully parsed packet" messages in the log</li>
          <li>This version uses the same buffering logic as the main dashboard</li>
        </ol>
      </div>
    </div>
  );
} 