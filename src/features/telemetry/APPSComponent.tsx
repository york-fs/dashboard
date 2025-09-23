import React from 'react';
import Link from 'next/link';
import { useTelemetryStore } from './telemetrySlice';
import { getStateColor, getThrottleColor, isDataStale } from '../../utils/telemetryHelpers';

const APPS_STATE_NAMES = {
  0: 'IDLE',
  1: 'ERROR',
  2: 'INITIALIZING',
  3: 'CALIBRATING',
  4: 'READY',
  5: 'ACTIVE',
  6: 'RUNNING',
  7: 'FAULT'
} as const;

export default function APPSComponent() {
  const appsData = useTelemetryStore(state => state.latestAppsData);
  const lastPacketTime = useTelemetryStore(state => state.lastPacketTime);
  const isConnected = useTelemetryStore(state => state.isConnected);

  // Calculate how long ago we received data
  const dataAge = lastPacketTime ? Date.now() - lastPacketTime : null;
  const isDataStaleFlag = isDataStale(lastPacketTime);

  return (
    <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-4">
        <Link href="/apps" className="hover:underline">
          <h2 className="text-xl font-semibold cursor-pointer" style={{ color: 'var(--foreground)' }}>
            Accelerator Pedal Position (APPS)
          </h2>
        </Link>
        <div className="flex items-center space-x-2">
           <div className={`w-3 h-3 rounded-full ${isConnected && !isDataStaleFlag ? 'bg-green-500' : 'bg-red-500'}`}></div>
           <span className="text-sm" style={{ color: 'var(--foreground)' }}>
             {isConnected ? (isDataStaleFlag ? 'Stale' : 'Live') : 'Disconnected'}
           </span>
        </div>
      </div>

      {!appsData ? (
        <div className="text-center py-8" style={{ color: 'var(--foreground)' }}>
          <div className="text-lg mb-2">No APPS data available</div>
          <div className="text-sm">Connect to telemetry source to view data</div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* State */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStateColor(appsData.state || 0)}`}>
              {APPS_STATE_NAMES[appsData.state as keyof typeof APPS_STATE_NAMES] || 'UNKNOWN'}
            </span>
          </div>

          {/* Throttle Percentage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Throttle Position:</span>
              <span className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                {((appsData.currentThrottlePercentage || 0) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full rounded-full h-4" style={{ backgroundColor: 'var(--border)' }}>
              <div
                className={`h-4 rounded-full transition-all duration-300 ${getThrottleColor(appsData.currentThrottlePercentage || 0)}`}
                style={{ width: `${(appsData.currentThrottlePercentage || 0) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Motor Current */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Motor Current:</span>
            <span className="text-lg font-mono" style={{ color: 'var(--foreground)' }}>
              {(appsData.currentMotorCurrent || 0).toFixed(1)} A
            </span>
          </div>

          {/* Motor RPM */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Motor RPM:</span>
            <span className="text-lg font-mono" style={{ color: 'var(--foreground)' }}>
              {(appsData.currentMotorRpm || 0).toLocaleString()} RPM
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