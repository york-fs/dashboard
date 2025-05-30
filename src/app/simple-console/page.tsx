'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SerialClient } from '../../services/serialClient'; // Adjusted path

export default function SimpleConsolePage() {
  const [serialClient, setSerialClient] = useState<SerialClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');
  const outputRef = useRef<HTMLTextAreaElement>(null);
  const keepReadingRef = useRef(false);

  // Initialize SerialClient on component mount
  useEffect(() => {
    setSerialClient(new SerialClient());
  }, []);

  const startReadLoop = async () => {
    if (!serialClient || !serialClient.port || !serialClient.port.readable) {
      setOutput(prev => prev + "Error: Serial port not available for reading.\n");
      keepReadingRef.current = false;
      setIsConnected(false); // Reflect that we cannot read
      return;
    }

    const reader = serialClient.port.readable.getReader();
    try {
      while (keepReadingRef.current) {
        const { value, done } = await reader.read();
        if (done) {
          setOutput(prev => prev + "Reader stream closed.\n");
          keepReadingRef.current = false;
          break;
        }
        if (value) {
          const textChunk = new TextDecoder().decode(value);
          setOutput(prev => prev + textChunk);
        }
      }
    } catch (error) {
      setOutput(prev => prev + `Error during read loop: ${error instanceof Error ? error.message : String(error)}\n`);
      keepReadingRef.current = false;
      // Consider setting isConnected to false if the error is critical
      // For now, just log and stop reading. The user might need to disconnect/reconnect.
    } finally {
      reader.releaseLock();
      setOutput(prev => prev + "Reader released.\n");
      // If the loop was stopped externally (e.g. by disconnect) and port is still technically open,
      // but we are no longer reading, we might want to reflect this.
      // However, handleDisconnect should set isConnected to false.
      if (!keepReadingRef.current && isConnected){
        // This case implies reading stopped but we didn't explicitly disconnect.
        // This might happen if serialClient.close() was called elsewhere or port was lost.
        // setIsConnected(false); // Let handleDisconnect manage this primarily.
      }
    }
  };

  const handleConnect = async () => {
    if (!serialClient) {
      setOutput(prev => prev + "Error: Serial client not initialized.\n");
      return;
    }

    setOutput(prev => prev + "Requesting port...\n");
    try {
      await serialClient.requestPort();
      setOutput(prev => prev + "Port selected.\n");
    } catch (error) {
      setOutput(prev => prev + `Error requesting port: ${error instanceof Error ? error.message : String(error)}\n`);
      setIsConnected(false);
      return;
    }

    setOutput(prev => prev + "Opening port...\n");
    try {
      await serialClient.open({ baudRate: 57600 });
      setIsConnected(true);
      setOutput(prev => prev + "Connected.\n");
      keepReadingRef.current = true;
      startReadLoop(); // Start reading after connection
    } catch (error) {
      setOutput(prev => prev + `Error opening port: ${error instanceof Error ? error.message : String(error)}\n`);
      setIsConnected(false);
      keepReadingRef.current = false;
    }
  };

  const handleDisconnect = async () => {
    keepReadingRef.current = false; // Signal the read loop to stop

    if (!serialClient) { // No serialClient, can't do much
        setOutput(prev => prev + "Serial client not initialized. Cannot disconnect.\n");
        setIsConnected(false); // Ensure UI reflects disconnected state
        return;
    }
    
    if (!serialClient.port) { // Port wasn't even opened or obtained
        setOutput(prev => prev + "Port not available. Already disconnected or connection never established.\n");
        setIsConnected(false);
        return;
    }

    setOutput(prev => prev + "Disconnecting...\n");
    try {
      // The read loop's reader should be released by reader.releaseLock() when it sees keepReadingRef.current = false
      // or when serialClient.close() causes the stream to be done.
      await serialClient.close();
      setOutput(prev => prev + "Disconnected.\n");
    } catch (error) {
      setOutput(prev => prev + `Error disconnecting: ${error instanceof Error ? error.message : String(error)}\n`);
    } finally {
      // Ensure state is updated regardless of errors during close
      setIsConnected(false);
      keepReadingRef.current = false; // Re-affirm, though should already be false
    }
  };

  const handleSendCommand = async () => {
    if (!serialClient || !isConnected || !serialClient.port || !serialClient.port.writable) {
      setOutput(prev => prev + "Error: Not connected or port not writable.\n");
      return;
    }
    if (command.trim() === '') {
      return;
    }

    setOutput(prev => prev + `> ${command}\n`);
    const writer = serialClient.port.writable.getWriter();
    try {
      const data = new TextEncoder().encode(command + '\r\n'); // Common to send CR+LF
      await writer.write(data);
    } catch (error) {
      setOutput(prev => prev + `Error writing to port: ${error instanceof Error ? error.message : String(error)}\n`);
    } finally {
      writer.releaseLock();
    }
    setCommand('');
  };

  // Effect to scroll output to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Simple SiK Radio Console</h1>
      
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleConnect} disabled={isConnected} style={{ marginRight: '10px' }}>
          Connect
        </button>
        <button onClick={handleDisconnect} disabled={!isConnected}>
          Disconnect
        </button>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        Status: {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      
      <textarea
        ref={outputRef}
        readOnly
        value={output}
        style={{ width: '100%', height: '300px', border: '1px solid #ccc', marginBottom: '10px', whiteSpace: 'pre-wrap' }}
      />
      
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleSendCommand(); }}
          style={{ flexGrow: 1, marginRight: '10px', padding: '5px' }}
          placeholder="Enter AT command"
        />
        <button onClick={handleSendCommand} disabled={!isConnected}>
          Send
        </button>
      </div>
    </div>
  );
}
