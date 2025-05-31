'use client';

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import APPSComponent from '../features/telemetry/APPSComponent';
import BMSComponent from '../features/telemetry/BMSComponent';
import InverterComponent from '../features/telemetry/InverterComponent';
import { useTelemetryStore } from '../features/telemetry/telemetrySlice';
import { SerialClient } from '../services/serialClient';
import Link from 'next/link';

export default function DashboardPage() {
  const [serialClient] = useState(() => new SerialClient());
  const [isConnecting, setIsConnecting] = useState(false);
  const { isConnected, connectionStatus, lastError } = useTelemetryStore();

  // Make serial client available globally for AT console
  useEffect(() => {
    window.serialClient = serialClient;
    
    // Cleanup function to close connection when component unmounts
    return () => {
      // console.log("DashboardPage unmounting, but serialClient simulation will persist.");
      // No longer deleting window.serialClient or closing connection here.
      // This will be handled by the explicit "Disconnect" button.
    };
  }, [serialClient]);

  const handleConnect = async () => {
    if (isConnecting || isConnected) return;
    
    setIsConnecting(true);
    try {
      await serialClient.startTelemetrySimulation();
    } catch (error) {
      console.error('Connection failed:', error);
      // The store should be updated by SerialClient methods in case of error
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    console.log('[DashboardPage] handleDisconnect called');
    try {
      await serialClient.close();
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connecting': return 'Connecting...';
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connecting': return 'bg-yellow-500';
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Layout title="Overview">
      <div className="space-y-6">
        {/* Connection Controls */}
        <div className="flex items-center justify-between p-4 rounded-lg border" 
             style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getConnectionStatusColor()}`}></div>
              <span className="font-medium">{getConnectionStatusText()}</span>
            </div>
            {/* Simulation mode indicators removed as it's the only mode now */}
            {lastError && (
              <span className="text-red-500 text-sm ml-2">Error: {lastError}</span>
            )}
          </div>
          
          <div className="flex gap-2">
            {!isConnected ? (
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
              >
                {isConnecting ? 'Connecting...' : 'Start Simulation'}
              </button>
            ) : (
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
              >
                Disconnect
              </button>
            )}
            
            <Link
              href="/console"
              className="px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--foreground)', border: '1px solid var(--border)' }}
            >
              AT Console
            </Link>
          </div>
        </div>

        {/* Telemetry Components Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <APPSComponent />
          <BMSComponent />
          <InverterComponent />
        </div>
      </div>
    </Layout>
  );
}
