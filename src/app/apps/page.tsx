'use client';

import Layout from '../../components/Layout';
import APPSComponent from '../../features/telemetry/APPSComponent';
import { useTelemetryStore } from '../../features/telemetry/telemetrySlice';
import Link from 'next/link';

export default function APPSFocusPage() {
  const appsData = useTelemetryStore(state => state.latestAppsData);
  const isConnected = useTelemetryStore(state => state.isConnected);
  const packetsReceived = useTelemetryStore(state => state.packetsReceived);

  return (
    <Layout title="APPS Focus View">
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm">
          <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>
            Dashboard
          </Link>
          <span style={{ color: 'var(--foreground)' }}>›</span>
          <span style={{ color: 'var(--foreground)' }}>APPS Focus View</span>
        </div>

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

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Component Display */}
          <div className="lg:col-span-2">
            <APPSComponent />
          </div>

          {/* Additional Details Panel */}
          <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              APPS Details
            </h3>
            
            {!appsData ? (
              <div className="text-center py-8" style={{ color: 'var(--foreground)' }}>
                <div className="text-sm">No detailed data available</div>
                <div className="text-xs mt-2">Connect to view APPS details</div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Raw Data Section */}
                <div>
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Raw Values
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>State Code:</span>
                      <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                        {appsData.state}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Throttle (Raw):</span>
                      <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                        {appsData.currentThrottlePercentage?.toFixed(6)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Motor Current (Raw):</span>
                      <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                        {appsData.currentMotorCurrent?.toFixed(3)} A
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Motor RPM (Raw):</span>
                      <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                        {appsData.currentMotorRpm} RPM
                      </span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Performance Analysis
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Throttle Range:</span>
                      <span style={{ color: 'var(--foreground)' }}>
                        0% - 100%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Response Time:</span>
                      <span className="text-green-600">
                        Real-time
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Safety Status:</span>
                      <span className={appsData.state === 4 || appsData.state === 5 || appsData.state === 6 ? 'text-green-600' : 'text-yellow-600'}>
                        {appsData.state === 4 || appsData.state === 5 || appsData.state === 6 ? 'Operational' : 'Standby'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* System Information */}
                <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    System Info
                  </h4>
                  <div className="text-xs space-y-1" style={{ color: 'var(--foreground)' }}>
                    <div>• Accelerator Pedal Position Sensor</div>
                    <div>• Dual-channel safety design</div>
                    <div>• Real-time telemetry monitoring</div>
                    <div>• Integrated with motor controller</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            About APPS (Accelerator Pedal Position Sensor)
          </h3>
          <div className="text-sm space-y-2" style={{ color: 'var(--foreground)' }}>
            <p>
              The Accelerator Pedal Position Sensor (APPS) is a critical safety component that translates driver input 
              into throttle commands for the motor controller. It provides real-time feedback on pedal position and 
              ensures safe operation through multiple redundant channels.
            </p>
            <p>
              <strong>Key Features:</strong> Dual-channel design for safety redundancy, real-time position feedback, 
              integration with motor control systems, and comprehensive fault detection.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
} 