import { create } from 'zustand';
import { yorkfs } from '../../protobuf/telemetry_pb.js';

// Type definitions for the telemetry state
interface TelemetryState {
  // Latest telemetry data
  latestPacket: yorkfs.dashboard.ITelemetryPacket | null;
  latestAppsData: yorkfs.dashboard.IAPPSData | null;
  latestBmsData: yorkfs.dashboard.IBMSData | null;
  latestInverterData: yorkfs.dashboard.IInverterData | null;
  
  // Connection state
  isConnected: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  lastError: string | null;
  
  // Packet statistics
  packetsReceived: number;
  lastPacketTime: number | null;
  
  // Actions
  updateTelemetryPacket: (packet: yorkfs.dashboard.ITelemetryPacket) => void;
  setConnectionStatus: (status: 'disconnected' | 'connecting' | 'connected' | 'error', error?: string) => void;
  clearData: () => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  // Initial state
  latestPacket: null,
  latestAppsData: null,
  latestBmsData: null,
  latestInverterData: null,
  
  isConnected: false,
  connectionStatus: 'disconnected',
  lastError: null,
  
  packetsReceived: 0,
  lastPacketTime: null,
  
  // Actions
  updateTelemetryPacket: (packet: yorkfs.dashboard.ITelemetryPacket) => {
    // console.log('[TelemetrySlice] Received packet:', JSON.parse(JSON.stringify(packet))); // Log a deep copy
    set((state) => {
      const updates: Partial<TelemetryState> = {
        latestPacket: packet,
        packetsReceived: state.packetsReceived + 1,
        lastPacketTime: Date.now(),
      };
      
      // Update specific data based on packet type
      if (packet.appsData) {
        updates.latestAppsData = packet.appsData;
      }
      
      if (packet.bmsData) {
        updates.latestBmsData = packet.bmsData;
      }
      
      if (packet.inverterData) {
        updates.latestInverterData = packet.inverterData;
      }
      
      // console.log('[TelemetrySlice] Prepared updates:', JSON.parse(JSON.stringify(updates))); // Log a deep copy
      return updates;
    });
  },
  
  setConnectionStatus: (status: 'disconnected' | 'connecting' | 'connected' | 'error', error?: string) => {
    set({
      connectionStatus: status,
      isConnected: status === 'connected',
      lastError: error || null,
    });
  },
  
  clearData: () => {
    set({
      latestPacket: null,
      latestAppsData: null,
      latestBmsData: null,
      latestInverterData: null,
      packetsReceived: 0,
      lastPacketTime: null,
      lastError: null,
    });
  },
})); 