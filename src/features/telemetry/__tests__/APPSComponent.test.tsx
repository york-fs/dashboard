import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import APPSComponent from '../APPSComponent';

// Mock the telemetry store
jest.mock('../telemetrySlice', () => {
  const mockStore = {
    latestAppsData: null,
    lastPacketTime: null,
    isConnected: false,
  };

  return {
    useTelemetryStore: jest.fn((selector) => selector(mockStore)),
    __mockStore: mockStore,
  };
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { __mockStore } = require('../telemetrySlice');

describe('APPSComponent', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders no data message when no APPS data is available', () => {
    __mockStore.latestAppsData = null;
    __mockStore.lastPacketTime = null;
    __mockStore.isConnected = false;

    render(<APPSComponent />);

    expect(screen.getByText('No APPS data available')).toBeInTheDocument();
    expect(screen.getByText('Connect to telemetry source to view data')).toBeInTheDocument();
  });

  it('renders APPS data when available', () => {
    const mockAppsData = {
      state: 4, // READY
      currentThrottlePercentage: 0.75,
      currentMotorCurrent: 25.5,
      currentMotorRpm: 1500,
    };

    __mockStore.latestAppsData = mockAppsData;
    __mockStore.lastPacketTime = Date.now();
    __mockStore.isConnected = true;

    render(<APPSComponent />);

    expect(screen.getByText('Accelerator Pedal Position (APPS)')).toBeInTheDocument();
    expect(screen.getByText('READY')).toBeInTheDocument();
    expect(screen.getByText('75.0%')).toBeInTheDocument();
    expect(screen.getByText('25.5 A')).toBeInTheDocument();
    expect(screen.getByText('1,500 RPM')).toBeInTheDocument();
  });

  it('shows stale data indicator when data is old', () => {
    const mockAppsData = {
      state: 4,
      currentThrottlePercentage: 0.5,
      currentMotorCurrent: 10,
      currentMotorRpm: 1000,
    };

    __mockStore.latestAppsData = mockAppsData;
    __mockStore.lastPacketTime = Date.now() - 10000; // 10 seconds ago
    __mockStore.isConnected = true;

    render(<APPSComponent />);

    expect(screen.getByText('Stale')).toBeInTheDocument();
  });
});