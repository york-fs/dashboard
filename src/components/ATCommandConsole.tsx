'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTelemetryStore } from '../features/telemetry/telemetrySlice';

interface CommandHistoryItem {
  id: string;
  command: string;
  response: string;
  timestamp: Date;
  status: 'success' | 'error' | 'pending';
}

// Global serial client instance (should be passed as prop in real implementation)
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

export const ATCommandConsole: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { isConnected } = useTelemetryStore();

  // Auto-scroll terminal when new content is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

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

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
          disabled={!isConnected}
        >
          <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`} />
          <span className="text-sm font-mono">AT Console</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-green-400 rounded-lg shadow-2xl border border-gray-700 w-96 h-80">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`} />
          <span className="text-sm font-mono text-white">AT Console</span>
          <span className="text-xs text-gray-400">({getConnectionStatusText()})</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={clearHistory}
            className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded"
            title="Clear history"
          >
            Clear
          </button>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-gray-400 hover:text-white text-lg leading-none"
            title="Minimize"
          >
            −
          </button>
        </div>
      </div>

      {/* Terminal */}
      <div 
        ref={terminalRef}
        className="h-48 overflow-y-auto p-3 font-mono text-sm bg-black"
      >
        {history.length === 0 && (
          <div className="text-gray-500 text-xs">
            SiK Radio AT Command Console<br/>
            Type &apos;+++&apos; to enter AT mode, &apos;ATO&apos; to exit<br/>
            Use ↑↓ arrows for command history<br/>
            {!isConnected && <span className="text-red-400">⚠ Not connected to radio</span>}
          </div>
        )}
        
        {history.map((item) => (
          <div key={item.id} className="mb-2">
            <div className="flex items-center gap-2 text-blue-400">
              <span className="text-gray-500 text-xs">{formatTimestamp(item.timestamp)}</span>
              <span>&gt; {item.command}</span>
            </div>
            {item.status === 'pending' ? (
              <div className="text-yellow-400 text-xs ml-16">Executing...</div>
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

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700">
        <div className="flex gap-2">
          <span className="text-green-400 font-mono">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-green-400 font-mono text-sm outline-none"
            placeholder={isConnected ? "Enter AT command..." : "Connect to radio first"}
            disabled={!isConnected || isExecuting}
          />
        </div>
      </form>
    </div>
  );
}; 