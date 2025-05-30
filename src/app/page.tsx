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
      delete window.serialClient;
      if (serialClient.isConnected()) {
        serialClient.close().catch(console.error);
      }
    };
  }, [serialClient]);

  const handleConnect = async () => {
    if (isConnecting || isConnected) return;
    
    setIsConnecting(true);
    try {
      await serialClient.requestPort();
      await serialClient.open();
      
      // Start reading telemetry data (don't await this as it's a continuous process)
      serialClient.startReading((packet) => {
        // Packet is automatically handled by the SerialClient and sent to the store
        console.log('Received telemetry packet:', packet);
      }).catch(error => {
        console.error('Reading error:', error);
      });
      
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
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
    <Layout title="Electric Vehicle Dashboard">
      <div className="space-y-6">
        {/* Connection Controls */}
        <div className="flex items-center justify-between p-4 rounded-lg border" 
             style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getConnectionStatusColor()}`}></div>
              <span className="font-medium">{getConnectionStatusText()}</span>
            </div>
            {lastError && (
              <span className="text-red-500 text-sm">Error: {lastError}</span>
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
                {isConnecting ? 'Connecting...' : 'Connect to Radio'}
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

        {/* Status Information */}
        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border text-center" 
                 style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                {useTelemetryStore.getState().packetsReceived}
              </div>
              <div className="text-sm opacity-75">Packets Received</div>
            </div>
            
            <div className="p-4 rounded-lg border text-center" 
                 style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                {useTelemetryStore.getState().lastPacketTime ? 
                  new Date(useTelemetryStore.getState().lastPacketTime!).toLocaleTimeString() : 
                  'Never'
                }
              </div>
              <div className="text-sm opacity-75">Last Packet</div>
            </div>
            
            <div className="p-4 rounded-lg border text-center" 
                 style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                {serialClient.isInATCommandMode() ? 'AT Mode' : 'Data Mode'}
              </div>
              <div className="text-sm opacity-75">Radio Mode</div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
