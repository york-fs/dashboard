'use client';

import Layout from '../../components/Layout';
import APPSComponent from '../../features/telemetry/APPSComponent';
import { Breadcrumb } from '../../components/Breadcrumb';
import { useTelemetryStore } from '../../features/telemetry/telemetrySlice';
import Link from 'next/link';

export default function APPSFocusPage() {
  const appsData = useTelemetryStore(state => state.latestAppsData);
  const isConnected = useTelemetryStore(state => state.isConnected);
  const packetsReceived = useTelemetryStore(state => state.packetsReceived);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'APPS Focus View' }
  ];

  return (
    <Layout title="APPS Focus View">
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

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Component Display */}
          <div className="lg:col-span-2 space-y-6">
            <APPSComponent />
            
            {/* Enhanced Throttle Visualization */}
            {appsData && (
              <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                  Throttle Response Visualization
                </h3>
                
                <div className="space-y-4">
                  {/* Large Throttle Display */}
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                      {((appsData.currentThrottlePercentage || 0) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm" style={{ color: 'var(--foreground)' }}>Current Throttle Position</div>
                  </div>
                  
                  {/* Enhanced Progress Bar */}
                  <div className="relative">
                    <div className="w-full h-8 rounded-lg" style={{ backgroundColor: 'var(--border)' }}>
                      <div
                        className="h-8 rounded-lg transition-all duration-300 flex items-center justify-end pr-2"
                        style={{ 
                          width: `${(appsData.currentThrottlePercentage || 0) * 100}%`,
                          backgroundColor: (appsData.currentThrottlePercentage || 0) < 0.2 ? '#10b981' :
                                         (appsData.currentThrottlePercentage || 0) < 0.5 ? '#f59e0b' :
                                         (appsData.currentThrottlePercentage || 0) < 0.8 ? '#f97316' : '#ef4444'
                        }}
                      >
                        <span className="text-white text-sm font-medium">
                          {((appsData.currentThrottlePercentage || 0) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Throttle Range Markers */}
                    <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--foreground)' }}>
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  
                  {/* Motor Response Indicators */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
                      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                        {(appsData.currentMotorCurrent || 0).toFixed(1)}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--foreground)' }}>Motor Current (A)</div>
                      <div className="w-full h-2 mt-2 rounded" style={{ backgroundColor: 'var(--border)' }}>
                        <div
                          className="h-2 rounded transition-all duration-300"
                          style={{ 
                            width: `${Math.min((Math.abs(appsData.currentMotorCurrent || 0) / 100) * 100, 100)}%`,
                            backgroundColor: Math.abs(appsData.currentMotorCurrent || 0) < 20 ? '#10b981' :
                                           Math.abs(appsData.currentMotorCurrent || 0) < 50 ? '#f59e0b' :
                                           Math.abs(appsData.currentMotorCurrent || 0) < 80 ? '#f97316' : '#ef4444'
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
                      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                        {(appsData.currentMotorRpm || 0).toLocaleString()}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--foreground)' }}>Motor RPM</div>
                      <div className="w-full h-2 mt-2 rounded" style={{ backgroundColor: 'var(--border)' }}>
                        <div
                          className="h-2 rounded transition-all duration-300"
                          style={{ 
                            width: `${Math.min((Math.abs(appsData.currentMotorRpm || 0) / 5000) * 100, 100)}%`,
                            backgroundColor: Math.abs(appsData.currentMotorRpm || 0) < 1000 ? '#10b981' :
                                           Math.abs(appsData.currentMotorRpm || 0) < 3000 ? '#f59e0b' :
                                           Math.abs(appsData.currentMotorRpm || 0) < 4000 ? '#f97316' : '#ef4444'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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