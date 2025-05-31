import React from 'react';
import Link from 'next/link';
import { useTelemetryStore } from './telemetrySlice';

const SHUTDOWN_REASON_NAMES = {
  0: 'UNSPECIFIED',
  1: 'OVERCURRENT',
  2: 'OVERTEMPERATURE',
  3: 'UNDERVOLTAGE',
  4: 'OVERVOLTAGE'
} as const;

export default function BMSComponent() {
  const bmsData = useTelemetryStore(state => state.latestBmsData);
  const lastPacketTime = useTelemetryStore(state => state.lastPacketTime);
  const isConnected = useTelemetryStore(state => state.isConnected);

  // console.log('[BMSComponent] Received bmsData:', bmsData ? JSON.parse(JSON.stringify(bmsData)) : null);

  // Calculate how long ago we received data
  const dataAge = lastPacketTime ? Date.now() - lastPacketTime : null;
  const isDataStale = dataAge ? dataAge > 5000 : true; // Stale if older than 5 seconds

  const getShutdownColor = (isShutdown: boolean) => {
    return isShutdown ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  };

  const getCurrentColor = (current: number) => {
    const absCurrent = Math.abs(current);
    if (absCurrent < 10) return 'text-green-600'; // Low current
    if (absCurrent < 50) return 'text-yellow-600'; // Medium current
    if (absCurrent < 100) return 'text-orange-600'; // High current
    return 'text-red-600'; // Very high current
  };

  // Calculate total pack voltage from all segments
  const calculatePackVoltage = () => {
    if (!bmsData?.segments) return 0;
    return bmsData.segments.reduce((total, segment) => {
      return total + (segment.cellVoltages?.reduce((sum, voltage) => sum + (voltage || 0), 0) || 0);
    }, 0);
  };

  // Get min/max cell voltages across all segments
  const getMinMaxCellVoltages = () => {
    if (!bmsData?.segments) return { min: 0, max: 0 };
    
    let allVoltages: number[] = [];
    bmsData.segments.forEach(segment => {
      if (segment.cellVoltages) {
        allVoltages = allVoltages.concat(segment.cellVoltages);
      }
    });
    
    if (allVoltages.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.min(...allVoltages),
      max: Math.max(...allVoltages)
    };
  };

  // Get min/max temperatures across all segments
  const getMinMaxTemperatures = () => {
    if (!bmsData?.segments) return { min: 0, max: 0 };
    
    let allTemps: number[] = [];
    bmsData.segments.forEach(segment => {
      if (segment.temperatures) {
        allTemps = allTemps.concat(segment.temperatures);
      }
    });
    
    if (allTemps.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.min(...allTemps),
      max: Math.max(...allTemps)
    };
  };

  const packVoltage = calculatePackVoltage();
  const { min: minCellVoltage, max: maxCellVoltage } = getMinMaxCellVoltages();
  const { min: minTemperature, max: maxTemperature } = getMinMaxTemperatures();

  return (
    <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-4">
        <Link href="/bms" className="hover:underline">
          <h2 className="text-xl font-semibold cursor-pointer" style={{ color: 'var(--foreground)' }}>
            Battery Management System (BMS)
          </h2>
        </Link>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected && !isDataStale ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm" style={{ color: 'var(--foreground)' }}>
            {isConnected ? (isDataStale ? 'Stale' : 'Live') : 'Disconnected'}
          </span>
        </div>
      </div>

      {!bmsData ? (
        <div className="text-center py-8" style={{ color: 'var(--foreground)' }}>
          <div className="text-lg mb-2">No BMS data available</div>
          <div className="text-sm">Connect to telemetry source to view data</div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Shutdown Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Shutdown Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getShutdownColor(bmsData.shutdownActivated || false)}`}>
              {bmsData.shutdownActivated ? 'SHUTDOWN' : 'NORMAL'}
            </span>
          </div>

          {/* Shutdown Reason (if shutdown) */}
          {bmsData.shutdownActivated && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Shutdown Reason:</span>
              <span className="text-sm font-medium text-red-600">
                {SHUTDOWN_REASON_NAMES[bmsData.shutdownReason as keyof typeof SHUTDOWN_REASON_NAMES] || 'UNKNOWN'}
              </span>
            </div>
          )}

          {/* LVS 12V Rail */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>12V Rail:</span>
            <span className="text-lg font-mono" style={{ color: 'var(--foreground)' }}>
              {(bmsData.measuredLvs_12vRail || 0).toFixed(2)} V
            </span>
          </div>

          {/* Pack Voltage (calculated) */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Pack Voltage:</span>
            <span className="text-lg font-mono font-bold text-blue-600">
              {packVoltage.toFixed(1)} V
            </span>
          </div>

          {/* Current Measurements */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Positive Current:</span>
              <span className={`text-lg font-mono ${getCurrentColor(bmsData.positiveCurrent || 0)}`}>
                {(bmsData.positiveCurrent || 0).toFixed(1)} A
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Negative Current:</span>
              <span className={`text-lg font-mono ${getCurrentColor(bmsData.negativeCurrent || 0)}`}>
                {(bmsData.negativeCurrent || 0).toFixed(1)} A
              </span>
            </div>
          </div>

          {/* Cell Voltages */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Min Cell Voltage:</span>
              <span className="text-lg font-mono" style={{ color: 'var(--foreground)' }}>
                {minCellVoltage.toFixed(3)} V
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Max Cell Voltage:</span>
              <span className="text-lg font-mono" style={{ color: 'var(--foreground)' }}>
                {maxCellVoltage.toFixed(3)} V
              </span>
            </div>
          </div>

          {/* Temperatures */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Min Temperature:</span>
              <span className="text-lg font-mono" style={{ color: 'var(--foreground)' }}>
                {minTemperature.toFixed(1)}°C
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Max Temperature:</span>
              <span className="text-lg font-mono" style={{ color: 'var(--foreground)' }}>
                {maxTemperature.toFixed(1)}°C
              </span>
            </div>
          </div>

          {/* Segment Count */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Active Segments:</span>
            <span className="text-lg font-mono" style={{ color: 'var(--foreground)' }}>
              {bmsData.segments?.length || 0}
            </span>
          </div>

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