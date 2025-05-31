import React from 'react';
import Link from 'next/link';
import { useTelemetryStore } from './telemetrySlice';

const FAULT_CODE_NAMES = {
  0: 'UNSPECIFIED',
  1: 'NO_FAULTS',
  2: 'OVERVOLTAGE',
  3: 'UNDERVOLTAGE',
  4: 'DRIVE_ERROR',
  5: 'OVERCURRENT',
  6: 'CONTROLLER_OVERTEMPERATURE',
  7: 'MOTOR_OVERTEMPERATURE',
  8: 'SENSOR_WIRE_FAULT',
  9: 'SENSOR_GENERAL_FAULT',
  10: 'CAN_ERROR',
  11: 'ANALOG_INPUT_ERROR'
} as const;

export default function InverterComponent() {
  const inverterData = useTelemetryStore(state => state.latestInverterData);
  const lastPacketTime = useTelemetryStore(state => state.lastPacketTime);
  const isConnected = useTelemetryStore(state => state.isConnected);

  // console.log('[InverterComponent] Received inverterData:', inverterData ? JSON.parse(JSON.stringify(inverterData)) : null);

  // Calculate how long ago we received data
  const dataAge = lastPacketTime ? Date.now() - lastPacketTime : null;
  const isDataStale = dataAge ? dataAge > 5000 : true; // Stale if older than 5 seconds

  const getFaultColor = (faultCode: number) => {
    switch (faultCode) {
      case 1: return 'bg-green-100 text-green-800'; // NO_FAULTS
      case 0: return 'bg-gray-100 text-gray-800'; // UNSPECIFIED
      default: return 'bg-red-100 text-red-800'; // Any fault
    }
  };

  const getDutyCycleColor = (dutyCycle: number) => {
    if (dutyCycle < 0.3) return 'bg-green-500';
    if (dutyCycle < 0.6) return 'bg-yellow-500';
    if (dutyCycle < 0.9) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 40) return 'text-green-600'; // Cool
    if (temp < 70) return 'text-yellow-600'; // Warm
    if (temp < 90) return 'text-orange-600'; // Hot
    return 'text-red-600'; // Critical
  };

  const getCurrentColor = (current: number) => {
    const absCurrent = Math.abs(current);
    if (absCurrent < 20) return 'text-green-600'; // Low current
    if (absCurrent < 50) return 'text-yellow-600'; // Medium current
    if (absCurrent < 100) return 'text-orange-600'; // High current
    return 'text-red-600'; // Very high current
  };

  // Convert ERPM to actual RPM (typically ERPM = RPM * pole pairs)
  const calculateRPM = (erpm: number) => {
    // Assuming 7 pole pairs for a typical motor (14 poles)
    // This is a common configuration but should be configurable
    const polePairs = 7;
    return erpm / polePairs;
  };

  // Count active limit states
  const countActiveLimits = () => {
    if (!inverterData?.limitStates) return 0;
    const limits = inverterData.limitStates;
    return Object.values(limits).filter(Boolean).length;
  };

  return (
    <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-4">
        <Link href="/inverter" className="hover:underline">
          <h2 className="text-xl font-semibold cursor-pointer" style={{ color: 'var(--foreground)' }}>
            Motor Controller (Inverter)
          </h2>
        </Link>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected && !isDataStale ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm" style={{ color: 'var(--foreground)' }}>
            {isConnected ? (isDataStale ? 'Stale' : 'Live') : 'Disconnected'}
          </span>
        </div>
      </div>

      {!inverterData ? (
        <div className="text-center py-8" style={{ color: 'var(--foreground)' }}>
          <div className="text-lg mb-2">No Inverter data available</div>
          <div className="text-sm">Connect to telemetry source to view data</div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Fault Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Fault Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getFaultColor(inverterData.faultCode || 0)}`}>
              {FAULT_CODE_NAMES[inverterData.faultCode as keyof typeof FAULT_CODE_NAMES] || 'UNKNOWN'}
            </span>
          </div>

          {/* Drive Enable Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Drive Enabled:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${inverterData.driveEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {inverterData.driveEnabled ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>

          {/* Motor RPM */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Motor RPM:</span>
            <span className="text-lg font-mono font-bold" style={{ color: 'var(--foreground)' }}>
              {calculateRPM(inverterData.erpm || 0).toLocaleString()} RPM
            </span>
          </div>

          {/* ERPM (raw) */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Electrical RPM:</span>
            <span className="text-lg font-mono" style={{ color: 'var(--foreground)' }}>
              {(inverterData.erpm || 0).toLocaleString()} ERPM
            </span>
          </div>

          {/* Duty Cycle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Duty Cycle:</span>
              <span className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                {((inverterData.dutyCycle || 0) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full rounded-full h-4" style={{ backgroundColor: 'var(--border)' }}>
              <div
                className={`h-4 rounded-full transition-all duration-300 ${getDutyCycleColor(inverterData.dutyCycle || 0)}`}
                style={{ width: `${(inverterData.dutyCycle || 0) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Voltages and Currents */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>DC Input Voltage:</span>
              <span className="text-lg font-mono" style={{ color: 'var(--foreground)' }}>
                {(inverterData.inputDcVoltage || 0).toFixed(1)} V
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>AC Motor Current:</span>
              <span className={`text-lg font-mono ${getCurrentColor(inverterData.acMotorCurrent || 0)}`}>
                {(inverterData.acMotorCurrent || 0).toFixed(1)} A
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>DC Battery Current:</span>
            <span className={`text-lg font-mono ${getCurrentColor(inverterData.dcBatteryCurrent || 0)}`}>
              {(inverterData.dcBatteryCurrent || 0).toFixed(1)} A
            </span>
          </div>

          {/* Temperatures */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Controller Temp:</span>
              <span className={`text-lg font-mono ${getTemperatureColor(inverterData.controllerTemperature || 0)}`}>
                {(inverterData.controllerTemperature || 0).toFixed(1)}°C
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Motor Temp:</span>
              <span className={`text-lg font-mono ${getTemperatureColor(inverterData.motorTemperature || 0)}`}>
                {(inverterData.motorTemperature || 0).toFixed(1)}°C
              </span>
            </div>
          </div>

          {/* Limit States Summary */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Active Limits:</span>
            <span className={`text-lg font-mono ${countActiveLimits() > 0 ? 'text-orange-600' : 'text-green-600'}`}>
              {countActiveLimits()}
            </span>
          </div>

          {/* Detailed Limit States (if any active) */}
          {countActiveLimits() > 0 && inverterData.limitStates && (
            <div className="border-t pt-3" style={{ borderColor: 'var(--border)' }}>
              <div className="text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>Active Limit States:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {inverterData.limitStates.capacitorTemperature && <span className="text-orange-600">• Capacitor Temperature</span>}
                {inverterData.limitStates.dcCurrentLimit && <span className="text-orange-600">• DC Current Limit</span>}
                {inverterData.limitStates.driveEnableLimit && <span className="text-orange-600">• Drive Enable Limit</span>}
                {inverterData.limitStates.igbtAccelerationLimit && <span className="text-orange-600">• IGBT Acceleration Limit</span>}
                {inverterData.limitStates.igbtTemperatureLimit && <span className="text-orange-600">• IGBT Temperature Limit</span>}
                {inverterData.limitStates.inputVoltageLimit && <span className="text-orange-600">• Input Voltage Limit</span>}
                {inverterData.limitStates.motorAccelerationTemperatureLimit && <span className="text-orange-600">• Motor Acceleration Temperature Limit</span>}
                {inverterData.limitStates.motorTemperatureLimit && <span className="text-orange-600">• Motor Temperature Limit</span>}
                {inverterData.limitStates.rpmMinimumLimit && <span className="text-orange-600">• RPM Minimum Limit</span>}
                {inverterData.limitStates.rpmMaximumLimit && <span className="text-orange-600">• RPM Maximum Limit</span>}
                {inverterData.limitStates.powerLimit && <span className="text-orange-600">• Power Limit</span>}
              </div>
            </div>
          )}

          {/* Last Update */}
          {lastPacketTime && (
            <div className="text-xs border-t pt-3" style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}>
              Last update: {new Date(lastPacketTime).toLocaleTimeString()}
              {dataAge && (
                <span className="ml-2">
                  ({dataAge < 1000 ? '<1s' : `${Math.floor(dataAge / 1000)}s`} ago)
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 