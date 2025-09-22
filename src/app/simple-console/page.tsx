'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SerialClient } from '../../services/serialClient'; // Adjusted path

export default function SimpleConsolePage() {
  const [serialClient, setSerialClient] = useState<SerialClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');
  const outputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize SerialClient on component mount
  useEffect(() => {
    setSerialClient(new SerialClient());
  }, []);


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
      await serialClient.open(57600);
      setIsConnected(true);
      setOutput(prev => prev + "Connected.\n");
      
      // Start reading for responses
      await serialClient.startReading();
      setOutput(prev => prev + "Started reading for responses.\n");
    } catch (error) {
      setOutput(prev => prev + `Error opening port: ${error instanceof Error ? error.message : String(error)}\n`);
      setIsConnected(false);
    }
  };

  const handleDisconnect = async () => {
    if (!serialClient) {
      setOutput(prev => prev + "Serial client not initialized. Cannot disconnect.\n");
      setIsConnected(false);
      return;
    }

    setOutput(prev => prev + "Disconnecting...\n");
    try {
      await serialClient.close();
      setOutput(prev => prev + "Disconnected.\n");
    } catch (error) {
      setOutput(prev => prev + `Error disconnecting: ${error instanceof Error ? error.message : String(error)}\n`);
    } finally {
      setIsConnected(false);
    }
  };

  const handleSendCommand = async () => {
    if (!serialClient || !isConnected) {
      setOutput(prev => prev + "Error: Not connected.\n");
      return;
    }
    if (command.trim() === '') {
      return;
    }

    setOutput(prev => prev + `Sending AT command: ${command}\n`);

    try {
      const response = await serialClient.sendATCommand(command);
      setOutput(prev => prev + `Command response: ${response}\n`);
    } catch (error) {
      setOutput(prev => prev + `AT command error: ${error instanceof Error ? error.message : String(error)}\n`);
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
          placeholder="Enter AT command (e.g., ATI, ATS1?)"
        />
        <button onClick={handleSendCommand} disabled={!isConnected}>
          Send
        </button>
      </div>
    </div>
  );
}
