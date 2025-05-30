'use client';

import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/Layout';
import { SerialClient } from '../../services/serialClient';
import Link from 'next/link';

export default function ConsolePage() {
  const [serialClient, setSerialClient] = useState<SerialClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');
  const outputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize SerialClient on component mount - use global one if available
  useEffect(() => {
    const globalClient = (window as any).serialClient;
    if (globalClient) {
      setSerialClient(globalClient);
      setIsConnected(globalClient.isConnected());
      setOutput(prev => prev + "Using existing connection from main dashboard.\n");
    } else {
      setSerialClient(new SerialClient());
      setOutput(prev => prev + "Initialized new serial client.\n");
    }
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
    <Layout title="SiK Radio AT Console">
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Connection Controls */}
        <div className="flex items-center gap-4 p-4 rounded-lg border" 
             style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
          <button 
            onClick={handleConnect} 
            disabled={isConnected}
            className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            Connect
          </button>
          <button 
            onClick={handleDisconnect} 
            disabled={!isConnected}
            className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
          >
            Disconnect
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            <span className="font-medium">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>

        {/* Console Output */}
        <div className="space-y-4">
          <textarea
            ref={outputRef}
            readOnly
            value={output}
            className="w-full h-80 p-4 rounded-lg border font-mono text-sm resize-none"
            style={{ 
              backgroundColor: 'var(--background)', 
              borderColor: 'var(--border)', 
              color: 'var(--foreground)',
              whiteSpace: 'pre-wrap'
            }}
            placeholder="Console output will appear here..."
          />
          
          {/* Command Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') handleSendCommand(); }}
              className="flex-1 p-3 rounded-lg border"
              style={{ 
                backgroundColor: 'var(--background)', 
                borderColor: 'var(--border)', 
                color: 'var(--foreground)'
              }}
              placeholder="Enter AT command (e.g., ATI, ATS1?)"
            />
            <button 
              onClick={handleSendCommand} 
              disabled={!isConnected}
              className="px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            >
              Send
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="p-4 rounded-lg border" 
             style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
          <h3 className="font-semibold mb-2">Common AT Commands:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div><code>ATI</code> - Radio information</div>
            <div><code>ATS1?</code> - Check parameter 1</div>
            <div><code>ATS3=57</code> - Set parameter 3 to 57</div>
            <div><code>AT&W</code> - Write parameters to EEPROM</div>
            <div><code>ATZ</code> - Reboot radio</div>
            <div><code>RT</code> - Remote AT mode</div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 