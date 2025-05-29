'use client';

import Layout from '../../components/Layout';
import InverterComponent from '../../features/telemetry/InverterComponent';
import { Breadcrumb } from '../../components/Breadcrumb';
import { useTelemetryStore } from '../../features/telemetry/telemetrySlice';
import Link from 'next/link';

export default function InverterFocusPage() {
  const inverterData = useTelemetryStore(state => state.latestInverterData);
  const isConnected = useTelemetryStore(state => state.isConnected);
  const packetsReceived = useTelemetryStore(state => state.packetsReceived);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'Inverter Focus View' }
  ];

  // Helper functions for additional analysis
  const calculateRPM = (erpm: number) => {
    const polePairs = 7; // Assuming 7 pole pairs for a typical motor
    return erpm / polePairs;
  };

  const calculateEfficiency = () => {
    if (!inverterData?.inputDcVoltage || !inverterData?.dcBatteryCurrent || !inverterData?.acMotorCurrent) return 0;
    const dcPower = inverterData.inputDcVoltage * Math.abs(inverterData.dcBatteryCurrent);
    const acPower = Math.sqrt(3) * 400 * Math.abs(inverterData.acMotorCurrent) * 0.9; // Estimated 3-phase power
    return dcPower > 0 ? (acPower / dcPower) * 100 : 0;
  };

  const getThermalStatus = () => {
    const controllerTemp = inverterData?.controllerTemperature || 0;
    const motorTemp = inverterData?.motorTemperature || 0;
    
    if (controllerTemp > 90 || motorTemp > 90) return { status: 'Critical', color: 'text-red-600' };
    if (controllerTemp > 70 || motorTemp > 70) return { status: 'Hot', color: 'text-orange-600' };
    if (controllerTemp > 40 || motorTemp > 40) return { status: 'Warm', color: 'text-yellow-600' };
    return { status: 'Cool', color: 'text-green-600' };
  };

  const countActiveLimits = () => {
    if (!inverterData?.limitStates) return 0;
    return Object.values(inverterData.limitStates).filter(Boolean).length;
  };

  const efficiency = calculateEfficiency();
  const thermalStatus = getThermalStatus();

  return (
    <Layout title="Inverter Focus View">
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
            <InverterComponent />
            
            {/* Power Flow Visualization */}
            {inverterData && (
              <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                  Power Flow Analysis
                </h3>
                
                <div className="space-y-6">
                  {/* Power Overview */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
                      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                        {((inverterData.inputDcVoltage || 0) * Math.abs(inverterData.dcBatteryCurrent || 0) / 1000).toFixed(1)}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--foreground)' }}>DC Power (kW)</div>
                    </div>
                    <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
                      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                        {efficiency.toFixed(1)}%
                      </div>
                      <div className="text-sm" style={{ color: 'var(--foreground)' }}>Efficiency</div>
                    </div>
                    <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
                      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                        {calculateRPM(inverterData.erpm || 0).toFixed(0)}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--foreground)' }}>Mech RPM</div>
                    </div>
                    <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
                      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                        {(inverterData.dutyCycle || 0).toFixed(3)}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--foreground)' }}>Duty Cycle</div>
                    </div>
                  </div>
                  
                  {/* Power Flow Diagram */}
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      {/* Battery Side */}
                      <div className="text-center p-4 rounded-lg border-2" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--accent)' }}>
                        <div className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Battery</div>
                        <div className="text-sm mt-2" style={{ color: 'var(--foreground)' }}>
                          {(inverterData.inputDcVoltage || 0).toFixed(1)}V
                        </div>
                        <div className="text-sm" style={{ color: 'var(--foreground)' }}>
                          {(inverterData.dcBatteryCurrent || 0).toFixed(1)}A
                        </div>
                      </div>
                      
                      {/* Flow Arrow */}
                      <div className="flex-1 flex items-center justify-center">
                        <div className="flex items-center space-x-2">
                          <div className="h-1 flex-1 rounded" style={{ backgroundColor: 'var(--accent)' }}></div>
                          <div className="text-lg" style={{ color: 'var(--accent)' }}>→</div>
                          <div className="h-1 flex-1 rounded" style={{ backgroundColor: 'var(--accent)' }}></div>
                        </div>
                      </div>
                      
                      {/* Inverter */}
                      <div className="text-center p-4 rounded-lg border-2" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--accent)' }}>
                        <div className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Inverter</div>
                        <div className="text-sm mt-2" style={{ color: 'var(--foreground)' }}>
                          {efficiency.toFixed(1)}% Eff
                        </div>
                        <div className="text-sm" style={{ color: 'var(--foreground)' }}>
                          {(inverterData.controllerTemperature || 0).toFixed(0)}°C
                        </div>
                      </div>
                      
                      {/* Flow Arrow */}
                      <div className="flex-1 flex items-center justify-center">
                        <div className="flex items-center space-x-2">
                          <div className="h-1 flex-1 rounded" style={{ backgroundColor: 'var(--accent)' }}></div>
                          <div className="text-lg" style={{ color: 'var(--accent)' }}>→</div>
                          <div className="h-1 flex-1 rounded" style={{ backgroundColor: 'var(--accent)' }}></div>
                        </div>
                      </div>
                      
                      {/* Motor Side */}
                      <div className="text-center p-4 rounded-lg border-2" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--accent)' }}>
                        <div className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Motor</div>
                        <div className="text-sm mt-2" style={{ color: 'var(--foreground)' }}>
                          {calculateRPM(inverterData.erpm || 0).toFixed(0)} RPM
                        </div>
                        <div className="text-sm" style={{ color: 'var(--foreground)' }}>
                          {(inverterData.motorTemperature || 0).toFixed(0)}°C
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Current Monitoring */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>DC Battery Current</div>
                      <div className="w-full h-4 rounded" style={{ backgroundColor: 'var(--border)' }}>
                        <div
                          className="h-4 rounded transition-all duration-300"
                          style={{ 
                            width: `${Math.min(Math.abs(inverterData.dcBatteryCurrent || 0) / 100 * 100, 100)}%`,
                            backgroundColor: Math.abs(inverterData.dcBatteryCurrent || 0) < 20 ? '#10b981' :
                                           Math.abs(inverterData.dcBatteryCurrent || 0) < 50 ? '#f59e0b' :
                                           Math.abs(inverterData.dcBatteryCurrent || 0) < 80 ? '#f97316' : '#ef4444'
                          }}
                        />
                      </div>
                      <div className="text-xs" style={{ color: 'var(--foreground)' }}>
                        {(inverterData.dcBatteryCurrent || 0).toFixed(1)}A
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>AC Motor Current</div>
                      <div className="w-full h-4 rounded" style={{ backgroundColor: 'var(--border)' }}>
                        <div
                          className="h-4 rounded transition-all duration-300"
                          style={{ 
                            width: `${Math.min(Math.abs(inverterData.acMotorCurrent || 0) / 100 * 100, 100)}%`,
                            backgroundColor: Math.abs(inverterData.acMotorCurrent || 0) < 20 ? '#10b981' :
                                           Math.abs(inverterData.acMotorCurrent || 0) < 50 ? '#f59e0b' :
                                           Math.abs(inverterData.acMotorCurrent || 0) < 80 ? '#f97316' : '#ef4444'
                          }}
                        />
                      </div>
                      <div className="text-xs" style={{ color: 'var(--foreground)' }}>
                        {(inverterData.acMotorCurrent || 0).toFixed(1)}A
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Duty Cycle</div>
                      <div className="w-full h-4 rounded" style={{ backgroundColor: 'var(--border)' }}>
                        <div
                          className="h-4 rounded transition-all duration-300"
                          style={{ 
                            width: `${Math.min(Math.abs(inverterData.dutyCycle || 0) * 100, 100)}%`,
                            backgroundColor: Math.abs(inverterData.dutyCycle || 0) < 0.2 ? '#10b981' :
                                           Math.abs(inverterData.dutyCycle || 0) < 0.5 ? '#f59e0b' :
                                           Math.abs(inverterData.dutyCycle || 0) < 0.8 ? '#f97316' : '#ef4444'
                          }}
                        />
                      </div>
                      <div className="text-xs" style={{ color: 'var(--foreground)' }}>
                        {((inverterData.dutyCycle || 0) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Thermal Management */}
            {inverterData && (
              <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                  Thermal Management
                </h3>
                
                <div className="space-y-4">
                  {/* Temperature Gauges */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-lg font-medium mb-2" style={{ color: 'var(--foreground)' }}>Controller</div>
                      <div className="relative w-32 h-32 mx-auto">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="var(--border)"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={
                              (inverterData.controllerTemperature || 0) < 40 ? '#10b981' :
                              (inverterData.controllerTemperature || 0) < 70 ? '#f59e0b' :
                              (inverterData.controllerTemperature || 0) < 90 ? '#f97316' : '#ef4444'
                            }
                            strokeWidth="3"
                            strokeDasharray={`${Math.min((inverterData.controllerTemperature || 0) / 100 * 100, 100)}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                              {(inverterData.controllerTemperature || 0).toFixed(0)}°
                            </div>
                            <div className="text-xs" style={{ color: 'var(--foreground)' }}>°C</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-medium mb-2" style={{ color: 'var(--foreground)' }}>Motor</div>
                      <div className="relative w-32 h-32 mx-auto">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="var(--border)"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={
                              (inverterData.motorTemperature || 0) < 40 ? '#10b981' :
                              (inverterData.motorTemperature || 0) < 70 ? '#f59e0b' :
                              (inverterData.motorTemperature || 0) < 90 ? '#f97316' : '#ef4444'
                            }
                            strokeWidth="3"
                            strokeDasharray={`${Math.min((inverterData.motorTemperature || 0) / 100 * 100, 100)}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                              {(inverterData.motorTemperature || 0).toFixed(0)}°
                            </div>
                            <div className="text-xs" style={{ color: 'var(--foreground)' }}>°C</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Temperature Status */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
                      <div className="flex justify-between items-center">
                        <span style={{ color: 'var(--foreground)' }}>Controller Status:</span>
                        <span className={thermalStatus.color}>
                          {thermalStatus.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--background-secondary)' }}>
                      <div className="flex justify-between items-center">
                        <span style={{ color: 'var(--foreground)' }}>Cooling Required:</span>
                        <span className={Math.max(inverterData.controllerTemperature || 0, inverterData.motorTemperature || 0) > 60 ? 'text-orange-600' : 'text-green-600'}>
                          {Math.max(inverterData.controllerTemperature || 0, inverterData.motorTemperature || 0) > 60 ? 'Yes' : 'No'}
                        </span>
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
              Inverter Analytics
            </h3>
            
            {!inverterData ? (
              <div className="text-center py-8" style={{ color: 'var(--foreground)' }}>
                <div className="text-sm">No detailed data available</div>
                <div className="text-xs mt-2">Connect to view inverter analytics</div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Performance Metrics */}
                <div>
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Performance
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Efficiency:</span>
                      <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                        {efficiency.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Power Output:</span>
                      <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                        {((inverterData.inputDcVoltage || 0) * Math.abs(inverterData.dcBatteryCurrent || 0) / 1000).toFixed(1)} kW
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Pole Pairs:</span>
                      <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                        7
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thermal Analysis */}
                <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Thermal Status
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Overall:</span>
                      <span className={`font-medium ${thermalStatus.color}`}>
                        {thermalStatus.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Controller:</span>
                      <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                        {(inverterData.controllerTemperature || 0).toFixed(1)}°C
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Motor:</span>
                      <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                        {(inverterData.motorTemperature || 0).toFixed(1)}°C
                      </span>
                    </div>
                  </div>
                </div>

                {/* Operating Limits */}
                <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Operating Limits
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Active Limits:</span>
                      <span className={`font-mono ${countActiveLimits() > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                        {countActiveLimits()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Drive Status:</span>
                      <span className={`font-medium ${inverterData.driveEnabled ? 'text-green-600' : 'text-gray-600'}`}>
                        {inverterData.driveEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--foreground)' }}>Fault Code:</span>
                      <span className="font-mono" style={{ color: 'var(--foreground)' }}>
                        {inverterData.faultCode || 0}
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
                    <div>• 3-phase AC motor controller</div>
                    <div>• Variable frequency drive (VFD)</div>
                    <div>• Regenerative braking capable</div>
                    <div>• Real-time fault monitoring</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            About Motor Controller (Inverter)
          </h3>
          <div className="text-sm space-y-2" style={{ color: 'var(--foreground)' }}>
            <p>
              The Motor Controller (Inverter) is responsible for converting DC power from the battery into 
              variable-frequency AC power to drive the electric motor. It precisely controls motor speed, torque, 
              and direction while monitoring system health and implementing safety protections.
            </p>
            <p>
              <strong>Key Capabilities:</strong> Variable frequency drive control, regenerative braking, 
              thermal protection, overcurrent protection, fault detection, and real-time performance optimization.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
} 