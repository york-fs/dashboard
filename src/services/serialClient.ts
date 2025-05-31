/**
 * Serial Client Service
 * Handles Web Serial API communication with SiK telemetry radios
 * Supports both telemetry data and AT command communication
 */

import { yorkfs } from '../protobuf/telemetry_pb.js';
import { useTelemetryStore } from '../features/telemetry/telemetrySlice';
import { generateMockAPPSData, generateMockBMSData, generateMockInverterData } from './mockDataGenerator';

// Extract protobuf classes
// Ensure TelemetryPacket, APPSData, BMSData, InverterData are all available
const { TelemetryPacket, APPSData, BMSData, InverterData } = yorkfs.dashboard;

export class SerialClient {
  private isReading = false; // Represents if telemetry simulation is active
  private isInATMode = false;
  private atModeTimeout: NodeJS.Timeout | null = null;
  private simulationIntervalId: NodeJS.Timeout | null = null;
  private simulationPacketTypeCounter = 0;
  private mockSRegisters: Map<number, number> = new Map([
    [0, 0],
    [1, 0],
    [2, 43],
    [3, 30],
    [4, 1],
    [5, 1]
  ]);

  constructor() {
    // Constructor is now simplified as Web Serial specific setup is removed.
    console.log('SerialClient: Initialized in simulation-only mode.');
  }

  /**
   * Starts the telemetry simulation.
   * Renamed from open() and simplified.
   */
  async startTelemetrySimulation(): Promise<void> {
    console.log("Starting telemetry simulation.");
    useTelemetryStore.getState().setConnectionStatus('connecting');

    this.startSimulation(); // This method sets isReading = true and starts the interval

    useTelemetryStore.getState().setConnectionStatus('connected');
    return Promise.resolve();
  }

  /**
   * Stops the telemetry simulation and cleans up.
   * Simplified version of close().
   */
  async close(): Promise<void> {
    console.log("Stopping telemetry simulation.");
    this.isReading = false;

    if (this.simulationIntervalId) {
      clearInterval(this.simulationIntervalId);
      this.simulationIntervalId = null;
    }

    // AT mode related cleanup (will be further adapted in next steps)
    if (this.isInATMode) {
      await this.exitATMode();
    }

    if (this.atModeTimeout) {
      clearTimeout(this.atModeTimeout);
      this.atModeTimeout = null;
    }

    useTelemetryStore.getState().setConnectionStatus('disconnected');
    return Promise.resolve();
  }

  /**
   * Start data simulation. This method remains largely the same.
   */
  private startSimulation(): void {
    if (this.simulationIntervalId) {
      clearInterval(this.simulationIntervalId);
      this.simulationIntervalId = null;
    }

    this.isReading = true; // Or a specific simulation flag if needed

    this.simulationIntervalId = setInterval(() => {
      let packetPayload: any;
      let packetType: yorkfs.dashboard.TelemetryPacket.DataType;

      switch (this.simulationPacketTypeCounter) {
        case 0:
          packetPayload = { appsData: generateMockAPPSData() };
          packetType = TelemetryPacket.DataType.DATA_TYPE_APPS;
          break;
        case 1:
          packetPayload = { bmsData: generateMockBMSData() };
          packetType = TelemetryPacket.DataType.DATA_TYPE_BMS;
          break;
        case 2:
        default: // Fallback to inverter and reset counter for next cycle
          packetPayload = { inverterData: generateMockInverterData() };
          packetType = TelemetryPacket.DataType.DATA_TYPE_INVERTER;
          this.simulationPacketTypeCounter = -1; // Will be incremented to 0
          break;
      }

      this.simulationPacketTypeCounter++;

      const mockPacket: yorkfs.dashboard.ITelemetryPacket = {
        type: packetType,
        timestampMs: Date.now(),
        payload: packetPayload // Spread operator removed as payload is already structured
      };

      useTelemetryStore.getState().updateTelemetryPacket(mockPacket);
      // console.log(`Simulation: Sent mock ${TelemetryPacket.DataType[packetType]} packet`, mockPacket); // More descriptive log
    }, 1000); // Send a packet every second
  }

  // AT Command Methods

  /**
   * Enter AT command mode using the +++ sequence
   */
  async enterATMode(): Promise<boolean> {
    // No actual "+++" sequence to send
    console.log('Simulating: Entering AT mode');
    this.isInATMode = true;
    this.resetATModeTimeout(); // Keep timeout logic

    // Simulate a slight delay and "OK" response
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('atResponse', { detail: 'OK\r\n' }));
    }, 100); // 100ms delay

    return true;
  }

  /**
   * Exit AT command mode
   */
  async exitATMode(): Promise<void> {
    if (!this.isInATMode) {
      return;
    }
    console.log('Simulating: Exiting AT mode');
    // No actual "ATO" command to send
    this.isInATMode = false;
    if (this.atModeTimeout) {
      clearTimeout(this.atModeTimeout);
      this.atModeTimeout = null;
    }
    // Dispatch OK for ATO or implicit exit by timeout
    window.dispatchEvent(new CustomEvent('atResponse', { detail: 'OK\r\n' }));
  }

  /**
   * Send an AT command and wait for response
   */
  async sendATCommand(command: string): Promise<string> {
    command = command.trim().toUpperCase(); // Normalize command
    let response = '';
    let suppressResponseDispatch = false;

    console.log(`Simulating: Received AT command: ${command}`);

    if (!this.isInATMode && command !== '+++') { // Allow "+++" to pass through to enterATMode logic
      // Attempt to enter AT mode automatically if a command is sent.
      const entered = await this.enterATMode(); // enterATMode will dispatch its own OK
      if (!entered) {
        // Dispatch an error if auto-entry fails
        window.dispatchEvent(new CustomEvent('atResponse', { detail: 'ERROR\r\n' }));
        return Promise.reject(new Error('Failed to enter AT mode for simulation'));
      }
      // Add a small delay to simulate mode change before command processing
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    this.resetATModeTimeout(); // Reset inactivity timer

    // Command parsing and response generation
    if (command === 'ATI') {
      response = 'Mock Radio Firmware v1.0\r\nOK\r\n';
    } else if (command === 'AT&V') {
      let sRegsString = '';
      this.mockSRegisters.forEach((value, key) => {
        sRegsString += `S${key}:${value} `;
      });
      response = `${sRegsString.trim()}\r\nOK\r\n`;
    } else if (command.startsWith('ATS') && command.endsWith('?')) { // ATSn?
      const regNumMatch = command.match(/S(\d+)\?/);
      if (regNumMatch && regNumMatch[1]) {
        const regNum = parseInt(regNumMatch[1]);
        if (this.mockSRegisters.has(regNum)) {
          response = `${this.mockSRegisters.get(regNum)}\r\nOK\r\n`;
        } else {
          response = 'ERROR\r\n'; // Register not found
        }
      } else {
        response = 'ERROR\r\n'; // Invalid format
      }
    } else if (command.startsWith('ATS') && command.includes('=')) { // ATSn=X
      const regSetMatch = command.match(/S(\d+)=(\d+)/);
      if (regSetMatch && regSetMatch[1] && regSetMatch[2]) {
        const regNum = parseInt(regSetMatch[1]);
        const regVal = parseInt(regSetMatch[2]);
        // Basic validation for mock S-register values (0-255 for example)
        if (regVal >= 0 && regVal <= 255) {
            this.mockSRegisters.set(regNum, regVal);
            response = 'OK\r\n';
        } else {
            response = 'ERROR\r\n'; // Value out of range
        }
      } else {
        response = 'ERROR\r\n'; // Invalid format
      }
    } else if (command === 'ATO') { // Explicit exit
      await this.exitATMode(); // this already sends OK
      suppressResponseDispatch = true; // exitATMode handles the OK
    } else if (command === 'ATZ') { // Reset
      this.mockSRegisters.clear();
      this.mockSRegisters.set(0,0).set(1,0).set(2,43).set(3,30).set(4,1).set(5,1); // Reset to defaults
      response = 'OK\r\n';
    } else if (command === '+++') { // "+++" sequence to enter AT mode
        // If already in AT mode, it might just reset the timeout or do nothing.
        // If not in AT mode, enterATMode should be called (handled by the check above)
        // For now, assume if '+++' is sent explicitly, we ensure AT mode.
        if (!this.isInATMode) {
            await this.enterATMode(); // Dispatches its own OK
        } else {
             // Already in AT mode, radios might just respond with OK or nothing.
             // Let's send OK for consistency of getting a response.
            response = 'OK\r\n';
        }
        suppressResponseDispatch = command === '+++' && !this.isInATMode; // enterATMode dispatches OK
    } else {
      response = 'ERROR\r\n'; // Default for unknown commands
    }

    if (response && !suppressResponseDispatch) {
       window.dispatchEvent(new CustomEvent('atResponse', { detail: response }));
    }

    return Promise.resolve(response.trim());
  }

  /**
   * Reset the AT mode timeout
   */
  private resetATModeTimeout(): void {
    if (this.atModeTimeout) {
      clearTimeout(this.atModeTimeout);
    }
    
    // Auto-exit AT mode after 30 seconds of inactivity
    this.atModeTimeout = setTimeout(() => {
      this.exitATMode();
    }, 30000);
  }

  // Public getters

  /**
   * Get connection status
   */
  getConnectionStatus(): string {
    return useTelemetryStore.getState().connectionStatus;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return useTelemetryStore.getState().isConnected;
  }

  /**
   * Check if in AT command mode
   */
  isInATCommandMode(): boolean {
    return this.isInATMode;
  }

  /**
   * Get port information
   */
  // getPortInfo(): SerialPortInfo | null { // Removed as this.port is removed
  //   return null;
  // }
} 