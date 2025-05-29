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

export const ATCommandConsole: React.FC = () => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const isConnected = useTelemetryStore(state => state.isConnected);

  // Auto-scroll to bottom when new history items are added
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when console is expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

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
      const newHistory = [cmd, ...prev.filter(h => h !== cmd)].slice(0, 50); // Keep last 50 commands
      return newHistory;
    });
    setHistoryIndex(-1);

    try {
      // Simulate AT command sending (replace with actual implementation)
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      // Simulate different types of responses
      let response = '';
      let status: 'success' | 'error' = 'success';
      
      if (cmd.toUpperCase().startsWith('AT+')) {
        if (cmd.toUpperCase().includes('ERROR') || cmd.toUpperCase().includes('FAIL')) {
          response = 'ERROR: Command failed';
          status = 'error';
        } else if (cmd.toUpperCase().includes('INFO')) {
          response = 'Device: Electric Vehicle Telemetry Unit v2.1\nFirmware: 1.0.3\nSerial: EV-TEL-001\nStatus: Online';
        } else if (cmd.toUpperCase().includes('STATUS')) {
          response = 'System Status: OK\nConnection: Active\nData Rate: 100Hz\nUptime: 2h 34m 12s';
        } else if (cmd.toUpperCase().includes('RESET')) {
          response = 'System reset initiated...\nOK';
        } else {
          response = 'OK';
        }
      } else if (cmd.toUpperCase() === 'AT') {
        response = 'OK';
      } else {
        response = 'ERROR: Unknown command';
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
      second: '2-digit' 
    });
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg transition-all hover:scale-105"
          style={{ 
            backgroundColor: 'var(--background)', 
            border: '1px solid var(--border)',
            color: 'var(--foreground)'
          }}
        >
          <span className="text-sm font-medium">AT Console</span>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-80 z-50 rounded-lg shadow-xl border" 
         style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>AT Command Console</span>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearHistory}
            className="text-xs px-2 py-1 rounded hover:opacity-80"
            style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--foreground)' }}
          >
            Clear
          </button>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-sm hover:opacity-80"
            style={{ color: 'var(--foreground)' }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Command History */}
      <div 
        ref={historyRef}
        className="flex-1 p-3 overflow-y-auto text-xs font-mono"
        style={{ height: '200px', backgroundColor: 'var(--background-secondary)' }}
      >
        {history.length === 0 ? (
          <div className="text-center py-8" style={{ color: 'var(--foreground)' }}>
            <div className="text-sm mb-2">AT Command Console Ready</div>
            <div className="text-xs opacity-60">
              Type AT commands below. Try: AT, AT+INFO, AT+STATUS
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span style={{ color: 'var(--accent)' }}>[{formatTimestamp(item.timestamp)}]</span>
                  <span style={{ color: 'var(--foreground)' }}>→ {item.command}</span>
                </div>
                <div className="ml-4">
                  {item.status === 'pending' ? (
                    <span style={{ color: 'var(--foreground)' }}>Sending...</span>
                  ) : (
                    <div className={`whitespace-pre-wrap ${item.status === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                      {item.response}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isConnected ? "Enter AT command..." : "Not connected"}
            disabled={!isConnected}
            className="flex-1 px-3 py-1 text-sm font-mono rounded border focus:outline-none focus:ring-1"
            style={{ 
              backgroundColor: 'var(--background-secondary)', 
              borderColor: 'var(--border)',
              color: 'var(--foreground)'
            }}
          />
          <button
            type="submit"
            disabled={!isConnected || !command.trim()}
            className="px-3 py-1 text-sm rounded transition-colors disabled:opacity-50"
            style={{ 
              backgroundColor: 'var(--accent)', 
              color: 'white'
            }}
          >
            Send
          </button>
        </form>
        <div className="text-xs mt-1 opacity-60" style={{ color: 'var(--foreground)' }}>
          Use ↑↓ arrows for command history
        </div>
      </div>
    </div>
  );
}; 