'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTelemetryStore } from '../../features/telemetry/telemetrySlice';
import { Breadcrumb } from '../../components/Breadcrumb';
import Link from 'next/link';

interface CommandHistoryItem {
  id: string;
  command: string;
  response: string;
  timestamp: Date;
  status: 'success' | 'error' | 'pending';
}

// Global serial client instance
declare global {
  interface Window {
    serialClient?: {
      enterATMode: () => Promise<boolean>;
      exitATMode: () => Promise<void>;
      sendATCommand: (command: string) => Promise<string>;
      isInATCommandMode: () => boolean;
    };
  }
}

export default function ConsolePage() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { isConnected, packetsReceived, lastPacketTime } = useTelemetryStore();

  // Auto-scroll terminal when new content is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
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
    const newCommand: CommandHistoryItem = {
      id: commandId,
      command: cmd,
      response: '',
      timestamp: new Date(),
      status: 'pending'
    };

    setHistory(prev => [...prev, newCommand]);
    setIsExecuting(true);

    try {
      // Get the serial client instance
      const serialClient = window.serialClient;
      if (!serialClient) {
        throw new Error('Serial client not available');
      }

      let response: string;

      // Handle special commands
      if (cmd === '+++') {
        // Enter AT mode
        const success = await serialClient.enterATMode();
        response = success ? 'OK\r\nEntered AT mode' : 'ERROR\r\nFailed to enter AT mode';
      } else if (cmd.toUpperCase() === 'ATO') {
        // Exit AT mode
        await serialClient.exitATMode();
        response = 'OK\r\nExited AT mode';
      } else {
        // Send regular AT command
        response = await serialClient.sendATCommand(cmd);
      }

      // Update the command with the response
      setHistory(prev => prev.map(item => 
        item.id === commandId 
          ? { ...item, response, status: 'success' as const }
          : item
      ));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setHistory(prev => prev.map(item => 
        item.id === commandId 
          ? { ...item, response: `ERROR: ${errorMessage}`, status: 'error' as const }
          : item
      ));
    } finally {
      setIsExecuting(false);
    }
  };

  const quickCommands = [
    { label: 'Test', command: 'AT', description: 'Basic AT test' },
    { label: 'Info', command: 'ATI', description: 'Product identification' },
    { label: 'Version', command: 'ATI1', description: 'Version string' },
    { label: 'Board ID', command: 'ATI2', description: 'Board identification' },
    { label: 'Frequency', command: 'ATI3', description: 'Board frequency' },
    { label: 'Parameters', command: 'ATI5', description: 'All parameters' },
    { label: 'TDM Timing', command: 'ATI6', description: 'TDM timing info' },
    { label: 'RSSI', command: 'ATI7', description: 'RSSI information' },
    { label: 'RSSI Debug', command: 'AT&T=RSSI', description: 'Toggle RSSI debug' },
    { label: 'TDM Debug', command: 'AT&T=TDM', description: 'Toggle TDM debug' },
    { label: 'Factory Reset', command: 'AT&F', description: 'Restore defaults' },
    { label: 'Save Config', command: 'AT&W', description: 'Write to flash' },
    { label: 'Exit AT Mode', command: 'ATO', description: 'Return to data mode' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim() && !isExecuting) {
      sendCommand(command);
      setCommand('');
      setHistoryIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const commands = history.map(h => h.command);
      if (commands.length > 0) {
        const newIndex = historyIndex === -1 ? commands.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCommand(commands[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const commands = history.map(h => h.command);
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commands.length) {
          setHistoryIndex(-1);
          setCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCommand(commands[newIndex]);
        }
      }
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setHistoryIndex(-1);
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

  const getConnectionStatusColor = () => {
    if (!isConnected) return 'bg-red-500';
    return window.serialClient?.isInATCommandMode() ? 'bg-yellow-500' : 'bg-green-500';
  };

  const getConnectionStatusText = () => {
    if (!isConnected) return 'Disconnected';
    return window.serialClient?.isInATCommandMode() ? 'AT Mode' : 'Data Mode';
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'AT Console' }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold">SiK Radio AT Console</h1>
              <p className="text-sm opacity-75 mt-1">
                Command interface for SiK telemetry radios
              </p>
            </div>
            <Link 
              href="/"
              className="px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--foreground)' }}
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Terminal */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
              {/* Terminal Header */}
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="font-mono text-sm">SiK AT Terminal</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}></div>
                    <span className="text-sm">{getConnectionStatusText()}</span>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-sm px-3 py-1 rounded transition-colors"
                    style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Terminal Content */}
              <div 
                ref={terminalRef}
                className="h-96 overflow-y-auto p-4 font-mono text-sm bg-black text-green-400"
              >
                {history.length === 0 && (
                  <div className="text-gray-500">
                    SiK Radio AT Command Console v1.0<br/>
                    Type &apos;+++&apos; to enter AT mode, &apos;ATO&apos; to exit AT mode<br/>
                    Use ↑↓ arrows for command history<br/>
                    <br/>
                    {!isConnected && <span className="text-red-400">⚠ Radio not connected. Connect to radio first.</span>}
                    {isConnected && <span className="text-green-400">✓ Radio connected. Ready for commands.</span>}
                    <br/>
                  </div>
                )}
                
                {history.map((item) => (
                  <div key={item.id} className="mb-3">
                    <div className="flex items-center gap-2 text-blue-400">
                      <span className="text-gray-500 text-xs">{formatTimestamp(item.timestamp)}</span>
                      <span>&gt; {item.command}</span>
                    </div>
                    {item.status === 'pending' ? (
                      <div className="text-yellow-400 text-xs ml-16">Executing command...</div>
                    ) : (
                      <div className={`ml-4 whitespace-pre-wrap text-xs ${
                        item.status === 'error' ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {item.response}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Terminal Input */}
              <form onSubmit={handleSubmit} className="p-4 border-t bg-black" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-mono">&gt;</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-green-400 font-mono outline-none"
                    placeholder={isConnected ? "Enter AT command..." : "Connect to radio first"}
                    disabled={!isConnected || isExecuting}
                  />
                  {isExecuting && (
                    <span className="text-yellow-400 text-sm">Executing...</span>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Connection Info */}
            <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-3">Connection Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}></div>
                    <span>{getConnectionStatusText()}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Packets:</span>
                  <span>{packetsReceived}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Data:</span>
                  <span>{lastPacketTime ? new Date(lastPacketTime).toLocaleTimeString() : 'Never'}</span>
                </div>
              </div>
            </div>

            {/* Quick Commands */}
            <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-3">Quick Commands</h3>
              <div className="space-y-2">
                {quickCommands.map((cmd, index) => (
                  <button
                    key={index}
                    onClick={() => !isExecuting && sendCommand(cmd.command)}
                    disabled={!isConnected || isExecuting}
                    className="w-full text-left p-2 rounded text-sm transition-colors disabled:opacity-50 hover:opacity-80"
                    style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                    title={cmd.description}
                  >
                    <div className="font-mono">{cmd.command}</div>
                    <div className="text-xs opacity-60">{cmd.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Help */}
            <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
              <h3 className="font-semibold mb-3">AT Command Help</h3>
              <div className="text-xs space-y-2 opacity-75">
                <div><strong>+++</strong> - Enter AT mode</div>
                <div><strong>ATO</strong> - Exit AT mode</div>
                <div><strong>AT</strong> - Test command</div>
                <div><strong>ATI</strong> - Device info</div>
                <div><strong>ATI5</strong> - All parameters</div>
                <div><strong>AT&T=RSSI</strong> - RSSI debug</div>
                <div><strong>AT&F</strong> - Factory reset</div>
                <div><strong>AT&W</strong> - Save config</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 