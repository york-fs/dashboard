'use client';

import Layout from '../../components/Layout';
import { Breadcrumb } from '../../components/Breadcrumb';
import { useTelemetryStore } from '../../features/telemetry/telemetrySlice';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface CommandHistoryItem {
  id: string;
  command: string;
  response: string;
  timestamp: Date;
  status: 'success' | 'error' | 'pending';
}

export default function ConsolePage() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const isConnected = useTelemetryStore(state => state.isConnected);
  const packetsReceived = useTelemetryStore(state => state.packetsReceived);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'AT Console' }
  ];

  // Auto-scroll to bottom when new history items are added
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const sendCommand = async (cmd: string) => {
    if (!cmd.trim() || !isConnected) return;

    const commandId = Date.now().toString();
    const newHistoryItem: CommandHistoryItem = {
      id: commandId,
      command: cmd,
      response: '',
      timestamp: new Date(),
      status: 'pending'
    };

    setHistory(prev => [...prev, newHistoryItem]);
    setCommand('');
    
    // Add to command history for up/down arrow navigation
    setCommandHistory(prev => {
      const newHistory = [cmd, ...prev.filter(h => h !== cmd)].slice(0, 100); // Keep last 100 commands
      return newHistory;
    });
    setHistoryIndex(-1);

    try {
      // Simulate AT command sending (replace with actual implementation)
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
      
      // Enhanced command simulation with more realistic responses
      let response = '';
      let status: 'success' | 'error' = 'success';
      
      const upperCmd = cmd.toUpperCase();
      
      if (upperCmd === 'AT') {
        response = 'OK';
      } else if (upperCmd === 'ATI' || upperCmd.includes('INFO')) {
        response = `Electric Vehicle Telemetry Unit
Model: EV-TEL-2024
Firmware: v2.1.3 (Build 20241201)
Hardware: Rev C
Serial Number: EV-TEL-001-2024
Manufacturer: EV Systems Inc.
Certification: FCC ID: ABC123, IC: 456-789

OK`;
      } else if (upperCmd.includes('STATUS') || upperCmd === 'AT+STATUS') {
        response = `System Status Report:
Connection: Active (${isConnected ? 'Connected' : 'Disconnected'})
Data Rate: 100 Hz
Packets Received: ${packetsReceived.toLocaleString()}
Uptime: ${Math.floor(Date.now() / 1000 / 60)} minutes
Memory Usage: 45%
CPU Usage: 23%
Temperature: 42°C
Voltage: 12.3V

OK`;
      } else if (upperCmd.includes('RESET') || upperCmd === 'AT+RESET') {
        response = `System reset initiated...
Stopping telemetry services...
Clearing buffers...
Reinitializing hardware...
System ready.

OK`;
      } else if (upperCmd.includes('VERSION') || upperCmd === 'AT+VERSION') {
        response = `AT Command Processor v1.2.0
Telemetry Engine v2.1.3
Protocol Stack v1.0.8
Bootloader v1.1.2

OK`;
      } else if (upperCmd.includes('HELP') || upperCmd === 'AT+HELP') {
        response = `Available AT Commands:
AT              - Test command
ATI             - Device information
AT+STATUS       - System status
AT+VERSION      - Version information
AT+RESET        - System reset
AT+HELP         - This help message
AT+TELEMETRY    - Telemetry control
AT+CONFIG       - Configuration commands
AT+DEBUG        - Debug commands

For detailed help on a command, use: AT+HELP=<command>

OK`;
      } else if (upperCmd.includes('TELEMETRY')) {
        response = `Telemetry System Status:
State: ${isConnected ? 'ACTIVE' : 'INACTIVE'}
Mode: Real-time
Frequency: 100 Hz
Components: APPS, BMS, Inverter
Buffer: 85% full
Last Update: ${new Date().toISOString()}

OK`;
      } else if (upperCmd.includes('CONFIG')) {
        response = `Configuration Settings:
Baud Rate: 115200
Data Bits: 8
Stop Bits: 1
Parity: None
Flow Control: None
Echo: ON
Verbose: ON

OK`;
      } else if (upperCmd.includes('DEBUG')) {
        response = `Debug Information:
Log Level: INFO
Debug Port: 8080
Trace Buffer: 1024 KB
Error Count: 0
Warning Count: 2
Last Error: None

OK`;
      } else if (upperCmd.includes('ERROR') || upperCmd.includes('FAIL')) {
        response = 'ERROR: Command execution failed';
        status = 'error';
      } else if (upperCmd.startsWith('AT+')) {
        response = 'ERROR: Unknown command. Type AT+HELP for available commands.';
        status = 'error';
      } else {
        response = 'ERROR: Invalid AT command format';
        status = 'error';
      }

      setHistory(prev => prev.map(item => 
        item.id === commandId 
          ? { ...item, response, status }
          : item
      ));
    } catch (error) {
      setHistory(prev => prev.map(item => 
        item.id === commandId 
          ? { ...item, response: 'ERROR: Connection timeout', status: 'error' }
          : item
      ));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendCommand(command);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const quickCommands = [
    { label: 'Device Info', command: 'ATI' },
    { label: 'Status', command: 'AT+STATUS' },
    { label: 'Version', command: 'AT+VERSION' },
    { label: 'Help', command: 'AT+HELP' },
    { label: 'Telemetry', command: 'AT+TELEMETRY' },
    { label: 'Reset', command: 'AT+RESET' }
  ];

  return (
    <Layout title="AT Command Console">
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header with Back Button and Status */}
        <div className="flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border transition-colors hover:opacity-80"
            style={{ 
              backgroundColor: 'var(--background-secondary)', 
              borderColor: 'var(--border)', 
              color: 'var(--foreground)' 
            }}
          >
            ← Back to Dashboard
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm" style={{ color: 'var(--foreground)' }}>
              Packets: {packetsReceived.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Console Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Terminal */}
          <div className="lg:col-span-3">
            <div className="rounded-lg shadow-md border" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
              {/* Terminal Header */}
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    AT Command Terminal
                  </span>
                </div>
                <button
                  onClick={clearHistory}
                  className="text-sm px-3 py-1 rounded hover:opacity-80"
                  style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--foreground)' }}
                >
                  Clear
                </button>
              </div>

              {/* Terminal Content */}
              <div 
                ref={historyRef}
                className="p-4 font-mono text-sm overflow-y-auto"
                style={{ 
                  height: '500px', 
                  backgroundColor: 'var(--background-secondary)',
                  color: 'var(--foreground)'
                }}
              >
                {history.length === 0 ? (
                  <div className="space-y-2">
                    <div style={{ color: 'var(--accent)' }}>
                      Electric Vehicle Telemetry Console v2.1.3
                    </div>
                    <div style={{ color: 'var(--foreground)' }}>
                      Copyright (c) 2024 EV Systems Inc. All rights reserved.
                    </div>
                    <div style={{ color: 'var(--foreground)' }}>
                      Type 'AT+HELP' for available commands.
                    </div>
                    <div style={{ color: 'var(--foreground)' }}>
                      Connection status: {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                    </div>
                    <br />
                  </div>
                ) : null}
                
                <div className="space-y-1">
                  {history.map((item) => (
                    <div key={item.id} className="space-y-1">
                      <div className="flex items-start space-x-2">
                        <span style={{ color: 'var(--accent)' }}>
                          [{formatTimestamp(item.timestamp)}]
                        </span>
                        <span style={{ color: 'var(--foreground)' }}>
                          $ {item.command}
                        </span>
                      </div>
                      <div className="ml-16">
                        {item.status === 'pending' ? (
                          <span style={{ color: 'var(--foreground)' }}>Executing...</span>
                        ) : (
                          <div className={`whitespace-pre-wrap ${item.status === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                            {item.response}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminal Input */}
              <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <span className="text-sm font-mono self-center" style={{ color: 'var(--accent)' }}>
                    $
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isConnected ? "Enter AT command..." : "Device not connected"}
                    disabled={!isConnected}
                    className="flex-1 px-3 py-2 font-mono rounded border focus:outline-none focus:ring-2"
                    style={{ 
                      backgroundColor: 'var(--background-secondary)', 
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!isConnected || !command.trim()}
                    className="px-4 py-2 rounded transition-colors disabled:opacity-50"
                    style={{ 
                      backgroundColor: 'var(--accent)', 
                      color: 'white'
                    }}
                  >
                    Send
                  </button>
                </form>
                <div className="text-xs mt-2 opacity-60" style={{ color: 'var(--foreground)' }}>
                  Use ↑↓ arrows for command history • Ctrl+L to clear • Tab for autocomplete
                </div>
              </div>
            </div>
          </div>

          {/* Quick Commands Panel */}
          <div className="space-y-6">
            <div className="rounded-lg shadow-md p-4" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                Quick Commands
              </h3>
              <div className="space-y-2">
                {quickCommands.map((cmd) => (
                  <button
                    key={cmd.command}
                    onClick={() => sendCommand(cmd.command)}
                    disabled={!isConnected}
                    className="w-full text-left px-3 py-2 text-sm rounded border transition-colors hover:opacity-80 disabled:opacity-50"
                    style={{ 
                      backgroundColor: 'var(--background-secondary)', 
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)'
                    }}
                  >
                    <div className="font-medium">{cmd.label}</div>
                    <div className="text-xs font-mono opacity-60">{cmd.command}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg shadow-md p-4" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                Connection Info
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--foreground)' }}>Status:</span>
                  <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--foreground)' }}>Packets:</span>
                  <span style={{ color: 'var(--foreground)' }}>{packetsReceived.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--foreground)' }}>Commands:</span>
                  <span style={{ color: 'var(--foreground)' }}>{history.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 