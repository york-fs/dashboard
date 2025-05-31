'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SerialClient } from '../../services/serialClient'; // Adjusted path

export default function SimpleConsolePage() {
  const [serialClient, setSerialClient] = useState<SerialClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');
  const outputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize SerialClient on component mount - use global one if available
  useEffect(() => {
    const globalClient = (window as any).serialClient as SerialClient | undefined;
    if (globalClient) {
      setSerialClient(globalClient);
      setIsConnected(globalClient.isInATCommandMode());
      setOutput(prev => prev + "Using existing serial client from main dashboard.\n" +
                                 (globalClient.isConnected() ? "Telemetry simulation is active.\n" : "Telemetry simulation is not active. Start it from dashboard.\n") +
                                 "Ready for AT commands.\n");
    } else {
      setOutput(prev => prev + "Error: Serial client not found. Please navigate to the main dashboard first.\n");
    }
  }, []);

  // Listen for AT command responses
  useEffect(() => {
    const handleATResponse = (event: CustomEvent) => {
      const response = event.detail;
      setOutput(prev => prev + response); // Append raw response
    };

    window.addEventListener('atResponse', handleATResponse as EventListener);
    
    return () => {
      window.removeEventListener('atResponse', handleATResponse as EventListener);
    };
  }, [serialClient]);

  const handleEnterATMode = async () => {
    if (!serialClient) {
      setOutput(prev => prev + "Error: Serial client not available.\n");
      return;
    }
    if (serialClient.isInATCommandMode()) {
       setOutput(prev => prev + "Already in AT mode.\n"); return;
    }
    setOutput(prev => prev + "Entering AT mode...\n");
    try {
      await serialClient.enterATMode(); // This will dispatch "OK" via event
      setIsConnected(true); // Reflects AT mode status
    } catch (error) {
      setOutput(prev => prev + `Error entering AT mode: ${error instanceof Error ? error.message : String(error)}\n`);
      setIsConnected(false);
    }
  };

  const handleExitATMode = async () => {
    if (!serialClient || !serialClient.isInATCommandMode()) {
       setOutput(prev => prev + "Not in AT mode or client not available.\n"); return;
    }
    setOutput(prev => prev + "Exiting AT mode...\n");
    try {
      await serialClient.exitATMode(); // This will dispatch "OK" via event
      setIsConnected(false); // Reflects AT mode status
    } catch (error) {
      setOutput(prev => prev + `Error exiting AT mode: ${error instanceof Error ? error.message : String(error)}\n`);
    }
  };

  const handleSendCommand = async () => {
    if (!serialClient || !isConnected) { // isConnected now means isInATCommandMode
      setOutput(prev => prev + "Error: Not in AT mode.\n");
      return;
    }
    if (command.trim() === '') {
      return;
    }

    setOutput(prev => prev + `AT> ${command}\n`); // Echo command

    try {
      // Response is handled by the 'atResponse' event listener
      await serialClient.sendATCommand(command);
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
        <button onClick={handleEnterATMode} disabled={isConnected} style={{ marginRight: '10px' }}>
          Enter AT Mode
        </button>
        <button onClick={handleExitATMode} disabled={!isConnected}>
          Exit AT Mode
        </button>
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        Status: {isConnected ? 'In AT Mode' : 'Not in AT Mode'}
      </div>
      
      <textarea
        ref={outputRef}
        readOnly
        value={output}
        style={{ width: '100%', height: '300px', border: '1px solid #ccc', marginBottom: '10px', whiteSpace: 'pre-wrap' }}
        placeholder="Console output will appear here..."
      />
      
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter' && isConnected) handleSendCommand(); }}
          style={{ flexGrow: 1, marginRight: '10px', padding: '5px' }}
          placeholder={isConnected ? "Enter AT command (e.g., ATI, ATS1?)" : "Enter AT mode to send commands"}
          disabled={!isConnected}
        />
        <button onClick={handleSendCommand} disabled={!isConnected || command.trim() === ''}>
          Send
        </button>
      </div>
    </div>
  );
}
