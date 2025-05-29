'use client';

import Layout from '../components/Layout';
import APPSComponent from '../features/telemetry/APPSComponent';
import BMSComponent from '../features/telemetry/BMSComponent';
import InverterComponent from '../features/telemetry/InverterComponent';
import { useTelemetryStore } from '../features/telemetry/telemetrySlice';
import { SerialClient } from '../services/serialClient';
import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [client] = useState(() => new SerialClient());
  const [isConnecting, setIsConnecting] = useState(false);
  const isConnected = useTelemetryStore(state => state.isConnected);
  const connectionStatus = useTelemetryStore(state => state.connectionStatus);
  const packetsReceived = useTelemetryStore(state => state.packetsReceived);
  const lastError = useTelemetryStore(state => state.lastError);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Request port selection
      await client.requestPort();
      
      // Open the connection
      await client.open(57600);
      
      // Start reading telemetry data
      await client.startReading((telemetryPacket) => {
        // Data is automatically dispatched to the store by SerialClient
        console.log('Received telemetry packet:', telemetryPacket);
      });
      
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await client.close();
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  return (
    <Layout title="Electric Car Dashboard">
      <div className="space-y-6">
        {/* Connection Controls */}
        <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="text-sm" style={{ color: 'var(--foreground)' }}>
                Packets: {packetsReceived.toLocaleString()}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link 
                href="/console"
                className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border transition-colors hover:opacity-80"
                style={{ 
                  backgroundColor: 'var(--background-secondary)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--foreground)' 
                }}
              >
                <span className="mr-2">⚡</span>
                AT Console
              </Link>
              <button
                onClick={handleConnect}
                disabled={isConnected}
                className="px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                style={{ 
                  backgroundColor: isConnected ? 'var(--background-secondary)' : 'var(--accent)', 
                  color: isConnected ? 'var(--foreground)' : 'white',
                  border: `1px solid ${isConnected ? 'var(--border)' : 'var(--accent)'}`
                }}
              >
                {isConnected ? 'Connected' : 'Connect'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span style={{ color: 'var(--foreground)' }}>Packets Received:</span>
              <span className="font-mono" style={{ color: 'var(--foreground)' }}>{packetsReceived.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--foreground)' }}>Status:</span>
              <span className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          
          {lastError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              <strong>Last Error:</strong> {lastError}
            </div>
          )}
          
          {!isConnected && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
              <strong>Requirements:</strong> Use Chrome or Edge browser with a USB serial device (SiK telemetry radio) connected.
              <br />
              <strong>Troubleshooting:</strong> Visit <a href="/test-serial" className="underline">/test-serial</a> for detailed diagnostics.
            </div>
          )}
        </div>

        {/* Telemetry Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <APPSComponent />
          <BMSComponent />
          <InverterComponent />
        </div>

        {/* Data Not Available Notice */}
        {!isConnected && (
          <div className="text-center py-12" style={{ color: 'var(--foreground)' }}>
            <div className="text-xl mb-2">🔌 Not Connected</div>
            <div className="text-lg mb-4">Connect to telemetry source to view real-time data</div>
            <div className="text-sm">
              Each component above will populate with live data once connected to your SiK telemetry radio.
            </div>
          </div>
        )}
    </div>
    </Layout>
  );
}
