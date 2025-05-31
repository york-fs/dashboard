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
    const globalClient = (window as any).serialClient as SerialClient | undefined;
    if (globalClient) {
      setSerialClient(globalClient);
      // Check if AT mode is active for the specific console "connected" state
      setIsConnected(globalClient.isInATCommandMode());
      setOutput(prev => prev + "Using existing serial client from main dashboard.\n" +
                                 (globalClient.isConnected() ? "Telemetry simulation is active.\n" : "Telemetry simulation is not active. Start it from dashboard.\n") +
                                 "Ready for AT commands.\n");
    } else {
      setOutput(prev => prev + "Error: Serial client not found. Please navigate to the main dashboard first.\n");
      // Optionally disable controls if no globalClient
    }
  }, []);

  // AT Response Event Listener
  useEffect(() => {
    const handleATResponse = (event: CustomEvent) => {
      setOutput(prev => prev + event.detail); // Append raw response
    };
    window.addEventListener('atResponse', handleATResponse as EventListener);
    return () => {
      window.removeEventListener('atResponse', handleATResponse as EventListener);
    };
  }, [serialClient]); // Re-run if serialClient instance changes (though it shouldn't here)

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
            onClick={handleEnterATMode}
            disabled={isConnected} // Disabled if already in AT mode
            className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            Enter AT Mode
          </button>
          <button 
            onClick={handleExitATMode}
            disabled={!isConnected} // Disabled if not in AT mode
            className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
          >
            Exit AT Mode
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            <span className="font-medium">{isConnected ? 'In AT Mode' : 'Not in AT Mode'}</span>
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
                whiteSpace: 'pre-wrap' // Ensure newlines are preserved
            }}
            placeholder="Console output will appear here..."
          />
          
          {/* Command Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter' && isConnected) handleSendCommand(); }}
              className="flex-1 p-3 rounded-lg border"
              style={{ 
                backgroundColor: 'var(--background)', 
                borderColor: 'var(--border)', 
                color: 'var(--foreground)'
              }}
              placeholder={isConnected ? "Enter AT command (e.g., ATI, ATS1?)" : "Enter AT mode to send commands"}
              disabled={!isConnected} // Disable input if not in AT mode
            />
            <button 
              onClick={handleSendCommand} 
              disabled={!isConnected || command.trim() === ''} // Also disable if command is empty
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