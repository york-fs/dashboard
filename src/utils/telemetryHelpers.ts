// Shared utility functions for telemetry components

// APPS State Colors
export const getStateColor = (state: number): string => {
  switch (state) {
    case 0: return 'bg-gray-100 text-gray-800'; // IDLE
    case 1: case 7: return 'bg-red-100 text-red-800'; // ERROR, FAULT
    case 2: case 3: return 'bg-yellow-100 text-yellow-800'; // INITIALIZING, CALIBRATING
    case 4: return 'bg-blue-100 text-blue-800'; // READY
    case 5: case 6: return 'bg-green-100 text-green-800'; // ACTIVE, RUNNING
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Throttle Position Colors
export const getThrottleColor = (percentage: number): string => {
  if (percentage < 0.2) return 'bg-green-500';
  if (percentage < 0.5) return 'bg-yellow-500';
  if (percentage < 0.8) return 'bg-orange-500';
  return 'bg-red-500';
};

// BMS Shutdown Colors
export const getShutdownColor = (isShutdown: boolean): string => {
  return isShutdown ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
};

// Current Colors
export const getCurrentColor = (current: number): string => {
  const absCurrent = Math.abs(current);
  if (absCurrent < 10) return 'text-green-600'; // Low current
  if (absCurrent < 50) return 'text-yellow-600'; // Medium current
  if (absCurrent < 100) return 'text-orange-600'; // High current
  return 'text-red-600'; // Very high current
};

// Inverter Fault Colors
export const getFaultColor = (faultCode: number): string => {
  switch (faultCode) {
    case 1: return 'bg-green-100 text-green-800'; // NO_FAULTS
    case 0: return 'bg-gray-100 text-gray-800'; // UNSPECIFIED
    default: return 'bg-red-100 text-red-800'; // Any fault
  }
};

// Duty Cycle Colors
export const getDutyCycleColor = (dutyCycle: number): string => {
  if (dutyCycle < 0.3) return 'bg-green-500';
  if (dutyCycle < 0.6) return 'bg-yellow-500';
  if (dutyCycle < 0.9) return 'bg-orange-500';
  return 'bg-red-500';
};

// Temperature Colors
export const getTemperatureColor = (temp: number): string => {
  if (temp < 40) return 'text-green-600'; // Cool
  if (temp < 70) return 'text-yellow-600'; // Warm
  if (temp < 90) return 'text-orange-600'; // Hot
  return 'text-red-600'; // Critical
};

// Connection Status Colors
export const getConnectionStatusColor = (status: string): string => {
  switch (status) {
    case 'connecting': return 'bg-yellow-500';
    case 'connected': return 'bg-green-500';
    case 'disconnected': return 'bg-gray-500';
    case 'error': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

// Data Age Check
export const isDataStale = (lastPacketTime: number | null, threshold: number = 5000): boolean => {
  if (!lastPacketTime) return true;
  const dataAge = Date.now() - lastPacketTime;
  return dataAge > threshold;
};