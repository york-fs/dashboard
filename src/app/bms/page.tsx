'use client';

import Layout from '../../components/Layout';
import BMSComponent from '../../features/telemetry/BMSComponent';
import { Breadcrumb } from '../../components/Breadcrumb';
import { useTelemetryStore } from '../../features/telemetry/telemetrySlice';
import Link from 'next/link';

export default function BMSFocusPage() {
  const bmsData = useTelemetryStore(state => state.latestBmsData);
  const isConnected = useTelemetryStore(state => state.isConnected);
  const packetsReceived = useTelemetryStore(state => state.packetsReceived);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'BMS Focus View' }
  ];

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
            <BMSComponent />
            
            {/* Enhanced Cell Voltage Visualization */}
            {bmsData && bmsData.segments && (
              <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                  Cell Voltage Distribution
                </h3>
                
                <div className="space-y-6">
                  {/* Pack Overview */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
                      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                        {packVoltage.toFixed(1)}V
                      </div>
                      <div className="text-sm" style={{ color: 'var(--foreground)' }}>Pack Voltage</div>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
                      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                        {cellStats.avg.toFixed(3)}V
                      </div>
                      <div className="text-sm" style={{ color: 'var(--foreground)' }}>Avg Cell</div>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
                      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                        {(cellStats.max - cellStats.min).toFixed(3)}V
                      </div>
                      <div className="text-sm" style={{ color: 'var(--foreground)' }}>Voltage Spread</div>
                    </div>
                  </div>
                  
                  {/* Individual Segment Visualization */}
                  {bmsData.segments.map((segment, segmentIndex) => (
                    <div key={segmentIndex} className="space-y-3">
                      <h4 className="text-md font-medium" style={{ color: 'var(--foreground)' }}>
                        Segment {segmentIndex + 1} - {segment.cellVoltages?.length || 0} Cells
                      </h4>
                      
                      {/* Cell Voltage Bars */}
                      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
                        {segment.cellVoltages?.map((voltage, cellIndex) => {
                          const normalizedVoltage = ((voltage - cellStats.min) / (cellStats.max - cellStats.min)) * 100;
                          const isLow = voltage < cellStats.avg - 0.05;
                          const isHigh = voltage > cellStats.avg + 0.05;
                          
                          return (
                            <div key={cellIndex} className="text-center">
                              <div 
                                className="w-full h-16 rounded-sm border relative group cursor-pointer"
                                style={{ backgroundColor: 'var(--border)' }}
                              >
                                <div
                                  className="absolute bottom-0 w-full rounded-sm transition-all duration-300"
                                  style={{ 
                                    height: `${Math.max(normalizedVoltage, 5)}%`,
                                    backgroundColor: isLow ? '#ef4444' : isHigh ? '#f59e0b' : '#10b981'
                                  }}
                                />
                                
                                {/* Tooltip on hover */}
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                  {voltage.toFixed(3)}V
                                </div>
                              </div>
                              <div className="text-xs mt-1" style={{ color: 'var(--foreground)' }}>
                                {cellIndex + 1}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Segment Statistics */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--foreground)' }}>Min:</span>
                          <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                            {Math.min(...(segment.cellVoltages || [])).toFixed(3)}V
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--foreground)' }}>Max:</span>
                          <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                            {Math.max(...(segment.cellVoltages || [])).toFixed(3)}V
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--foreground)' }}>Spread:</span>
                          <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                            {(Math.max(...(segment.cellVoltages || [])) - Math.min(...(segment.cellVoltages || []))).toFixed(3)}V
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Temperature Monitoring */}
            {bmsData && bmsData.segments && (
              <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                  Temperature Monitoring
                </h3>
                
                <div className="space-y-4">
                  {/* Temperature Overview */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
                      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                        {tempStats.avg.toFixed(1)}°C
                      </div>
                      <div className="text-sm" style={{ color: 'var(--foreground)' }}>Average</div>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
                      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                        {tempStats.max.toFixed(1)}°C
                      </div>
                      <div className="text-sm" style={{ color: 'var(--foreground)' }}>Hottest</div>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
                      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                        {(tempStats.max - tempStats.min).toFixed(1)}°C
                      </div>
                      <div className="text-sm" style={{ color: 'var(--foreground)' }}>Range</div>
                    </div>
                  </div>
                  
                  {/* Temperature Sensors by Segment */}
                  {bmsData.segments.map((segment, segmentIndex) => (
                    <div key={segmentIndex} className="space-y-2">
                      <h4 className="text-md font-medium" style={{ color: 'var(--foreground)' }}>
                        Segment {segmentIndex + 1} Temperatures
                      </h4>
                      
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                        {segment.temperatures?.map((temp, tempIndex) => {
                          const tempColor = temp < 30 ? '#3b82f6' : 
                                          temp < 40 ? '#10b981' :
                                          temp < 50 ? '#f59e0b' :
                                          temp < 60 ? '#f97316' : '#ef4444';
                          
                          return (
                            <div key={tempIndex} className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
                              <div className="text-lg font-bold" style={{ color: tempColor }}>
                                {temp.toFixed(1)}°
                              </div>
                              <div className="text-xs" style={{ color: 'var(--foreground)' }}>
                                T{tempIndex + 1}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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