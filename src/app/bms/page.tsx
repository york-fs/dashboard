'use client';

import Layout from '../../components/Layout';
import BMSComponent from '../../features/telemetry/BMSComponent';
import { useTelemetryStore } from '../../features/telemetry/telemetrySlice';
import Link from 'next/link';

export default function BMSFocusPage() {
  const bmsData = useTelemetryStore(state => state.latestBmsData);
  const isConnected = useTelemetryStore(state => state.isConnected);
  const packetsReceived = useTelemetryStore(state => state.packetsReceived);

  // Helper functions for additional analysis
  const calculatePackVoltage = () => {
    if (!bmsData?.segments) return 0;
    return bmsData.segments.reduce((total, segment) => {
      return total + (segment.cellVoltages?.reduce((sum, voltage) => sum + (voltage || 0), 0) || 0);
    }, 0);
  };

  const getCellStats = () => {
    if (!bmsData?.segments) return { count: 0, min: 0, max: 0, avg: 0 };
    
    let allVoltages: number[] = [];
    bmsData.segments.forEach(segment => {
      if (segment.cellVoltages) {
        allVoltages = allVoltages.concat(segment.cellVoltages);
      }
    });
    
    if (allVoltages.length === 0) return { count: 0, min: 0, max: 0, avg: 0 };
    return {
      count: allVoltages.length,
      min: Math.min(...allVoltages),
      max: Math.max(...allVoltages),
      avg: allVoltages.reduce((sum, v) => sum + v, 0) / allVoltages.length
    };
  };

  const getTemperatureStats = () => {
    if (!bmsData?.segments) return { count: 0, min: 0, max: 0, avg: 0 };
    
    let allTemps: number[] = [];
    bmsData.segments.forEach(segment => {
      if (segment.temperatures) {
        allTemps = allTemps.concat(segment.temperatures);
      }
    });
    
    if (allTemps.length === 0) return { count: 0, min: 0, max: 0, avg: 0 };
    return {
      count: allTemps.length,
      min: Math.min(...allTemps),
      max: Math.max(...allTemps),
      avg: allTemps.reduce((sum, t) => sum + t, 0) / allTemps.length
    };
  };

  const packVoltage = calculatePackVoltage();
  const cellStats = getCellStats();
  const tempStats = getTemperatureStats();

  return (
    <Layout title="BMS Focus View">
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm">
          <Link href="/" className="hover:underline" style={{ color: 'var(--accent)' }}>
            Dashboard
          </Link>
          <span style={{ color: 'var(--foreground)' }}>›</span>
          <span style={{ color: 'var(--foreground)' }}>BMS Focus View</span>
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
            <BMSComponent />
          </div>

          {/* Additional Details Panel */}
          <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              BMS Analytics
            </h3>
            
            {!bmsData ? (
              <div className="text-center py-8" style={{ color: 'var(--foreground)' }}>
                <div className="text-sm">No detailed data available</div>
                <div className="text-xs mt-2">Connect to view BMS analytics</div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Cell Statistics */}
                <div>
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Cell Statistics
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Total Cells:</span>
                      <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                        {cellStats.count}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Average Voltage:</span>
                      <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                        {cellStats.avg.toFixed(3)} V
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Voltage Spread:</span>
                      <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                        {(cellStats.max - cellStats.min).toFixed(3)} V
                      </span>
                    </div>
                  </div>
                </div>

                {/* Temperature Statistics */}
                <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Temperature Analysis
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Sensors:</span>
                      <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                        {tempStats.count}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Average Temp:</span>
                      <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                        {tempStats.avg.toFixed(1)}°C
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Temp Range:</span>
                      <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                        {(tempStats.max - tempStats.min).toFixed(1)}°C
                      </span>
                    </div>
                  </div>
                </div>

                {/* Power Analysis */}
                <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Power Analysis
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Pack Power:</span>
                      <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                        {((bmsData.positiveCurrent || 0) * packVoltage / 1000).toFixed(1)} kW
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Energy Flow:</span>
                      <span className={`font-mono ${(bmsData.positiveCurrent || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {(bmsData.positiveCurrent || 0) > 0 ? 'Discharging' : 'Charging'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>12V System:</span>
                      <span className={`font-mono ${(bmsData.measuredLvs_12vRail || 0) > 11.5 ? 'text-green-600' : 'text-red-600'}`}>
                        {(bmsData.measuredLvs_12vRail || 0) > 11.5 ? 'Good' : 'Low'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* System Health */}
                <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    System Health
                  </h4>
                  <div className="text-xs space-y-1" style={{ color: 'var(--foreground)' }}>
                    <div>• {bmsData.segments?.length || 0} active segment(s)</div>
                    <div>• {cellStats.count} cells monitored</div>
                    <div>• {tempStats.count} temperature sensors</div>
                    <div>• Continuous safety monitoring</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            About BMS (Battery Management System)
          </h3>
          <div className="text-sm space-y-2" style={{ color: 'var(--foreground)' }}>
            <p>
              The Battery Management System (BMS) is the critical safety and monitoring system for the high-voltage 
              battery pack. It continuously monitors cell voltages, temperatures, and currents to ensure safe operation 
              and optimal performance of the electric vehicle's energy storage system.
            </p>
            <p>
              <strong>Key Functions:</strong> Cell balancing, thermal management, state of charge estimation, 
              fault detection and protection, current monitoring, and emergency shutdown capabilities.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
} 