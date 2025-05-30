/**
 * Serial Client Service
 * Handles Web Serial API communication with SiK telemetry radios
 * Supports both telemetry data and AT command communication
 */

import { yorkfs } from '../protobuf/telemetry_pb.js';
import { useTelemetryStore } from '../features/telemetry/telemetrySlice';

// Extract protobuf classes
const { TelemetryPacket } = yorkfs.dashboard;

export class SerialClient {
  private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private isReading = false;
  private dataBuffer = new Uint8Array(0);
  private isInATMode = false;
  private atModeTimeout: NodeJS.Timeout | null = null;

  constructor() {
    // Initialize the store reference
  }

  /**
   * Request access to a serial port using Web Serial API
   */
  async requestPort(): Promise<void> {
    if (!('serial' in navigator)) {
      throw new Error('Web Serial API not supported');
    }

    try {
      this.port = await navigator.serial.requestPort();
      useTelemetryStore.getState().setConnectionStatus('connecting');
    } catch (error) {
      useTelemetryStore.getState().setConnectionStatus('error', `Port selection failed: ${error}`);
      throw error;
    }
  }

  /**
   * Open the serial port with specified baud rate
   */
  async open(baudRate: number = 57600): Promise<void> {
    if (!this.port) {
      throw new Error('No port selected');
    }

    try {
      await this.port.open({ 
        baudRate,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        flowControl: 'none'
      });

      // Get the writer for sending AT commands
      this.writer = this.port.writable?.getWriter() || null;
      
      useTelemetryStore.getState().setConnectionStatus('connected');
    } catch (error) {
      useTelemetryStore.getState().setConnectionStatus('error', `Connection failed: ${error}`);
      throw error;
    }
  }

  /**
   * Close the serial port and clean up resources
   */
  async close(): Promise<void> {
    this.isReading = false;
    
    // Exit AT mode if we're in it
    if (this.isInATMode) {
      await this.exitATMode();
    }

    if (this.reader) {
      try {
        await this.reader.cancel();
        this.reader.releaseLock();
      } catch (error) {
        console.warn('Error cleaning up reader:', error);
      }
      this.reader = null;
    }

    if (this.writer) {
      try {
        this.writer.releaseLock();
      } catch (error) {
        console.warn('Error cleaning up writer:', error);
      }
      this.writer = null;
    }

    if (this.port) {
      try {
        await this.port.close();
      } catch (error) {
        console.warn('Error closing port:', error);
      }
      this.port = null;
    }

    if (this.atModeTimeout) {
      clearTimeout(this.atModeTimeout);
      this.atModeTimeout = null;
    }

    useTelemetryStore.getState().setConnectionStatus('disconnected');
  }

  /**
   * Start continuous reading from the serial port
   */
  async startReading(onTelemetryPacket?: (packet: yorkfs.dashboard.ITelemetryPacket) => void): Promise<void> {
    if (!this.port || !this.port.readable) {
      throw new Error('Port not open or readable');
    }

    this.reader = this.port.readable.getReader();
    this.isReading = true;

    // Use a separate async function to avoid blocking the main thread
    this.readLoop(onTelemetryPacket);
  }

  /**
   * Async reading loop that doesn't block the main thread
   */
  private async readLoop(onTelemetryPacket?: (packet: yorkfs.dashboard.ITelemetryPacket) => void): Promise<void> {
    try {
      while (this.isReading && this.reader) {
        const { value, done } = await this.reader.read();
        
        if (done) {
          console.log('Serial reading completed');
          break;
        }

        if (value) {
          // If we're in AT mode, handle AT responses differently
          if (this.isInATMode) {
            this.handleATResponse(value);
          } else {
            // Normal telemetry data processing
            this.processIncomingData(value, onTelemetryPacket);
          }
        }

        // Yield control back to the event loop to prevent blocking
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    } catch (readError) {
      console.error('Reading error:', readError);
      useTelemetryStore.getState().setConnectionStatus('error', `Reading error: ${readError}`);
    } finally {
      // Clean up reader
      if (this.reader) {
        try {
          this.reader.releaseLock();
        } catch (e) {
          console.warn('Error releasing reader lock:', e);
        }
        this.reader = null;
      }
    }
  }

  /**
   * Handle AT command responses
   */
  private handleATResponse(data: Uint8Array): void {
    // Convert bytes to string for AT responses
    const response = new TextDecoder().decode(data);
    
    // Dispatch AT response to any listeners
    const event = new CustomEvent('atResponse', { detail: response });
    window.dispatchEvent(event);
  }

  /**
   * Process incoming telemetry data
   */
  private processIncomingData(data: Uint8Array, onTelemetryPacket?: (packet: yorkfs.dashboard.ITelemetryPacket) => void): void {
    // Append new data to buffer
    const newBuffer = new Uint8Array(this.dataBuffer.length + data.length);
    newBuffer.set(this.dataBuffer);
    newBuffer.set(data, this.dataBuffer.length);
    this.dataBuffer = newBuffer;

    // Prevent buffer from growing too large
    if (this.dataBuffer.length > 10000) {
      console.warn('Data buffer too large, clearing');
      this.dataBuffer = new Uint8Array(0);
      return;
    }

    // Try to parse complete packets (limit iterations to prevent infinite loops)
    let iterations = 0;
    const maxIterations = 10;
    
    while (this.dataBuffer.length > 0 && iterations < maxIterations) {
      iterations++;
      
      try {
        // Try to decode a packet from the buffer
        const packet = TelemetryPacket.decode(this.dataBuffer);
        
        // If we successfully decoded a packet, process it
        if (onTelemetryPacket) {
          onTelemetryPacket(packet);
        }
        useTelemetryStore.getState().updateTelemetryPacket(packet);
        
        // Calculate how many bytes were consumed
        const encodedSize = TelemetryPacket.encode(packet).finish().length;
        
        // Ensure we're making progress
        if (encodedSize === 0) {
          console.warn('Zero-length packet detected, clearing buffer');
          this.dataBuffer = new Uint8Array(0);
          break;
        }
        
        // Remove processed bytes from buffer
        this.dataBuffer = this.dataBuffer.slice(encodedSize);
        
      } catch {
        // If we can't decode a packet, remove the first byte and try again
        // This handles cases where we're in the middle of a packet or have corrupted data
        if (this.dataBuffer.length > 1) {
          this.dataBuffer = this.dataBuffer.slice(1);
        } else {
          // If only one byte left and it's not valid, clear the buffer
          this.dataBuffer = new Uint8Array(0);
          break;
        }
      }
    }

    // If we hit the iteration limit, something might be wrong
    if (iterations >= maxIterations) {
      console.warn('Hit maximum packet processing iterations, clearing buffer');
      this.dataBuffer = new Uint8Array(0);
    }
  }

  // AT Command Methods

  /**
   * Enter AT command mode using the +++ sequence
   */
  async enterATMode(): Promise<boolean> {
    if (!this.writer) {
      throw new Error('No writer available');
    }

    try {
      // Send +++ sequence to enter AT mode
      const plusSequence = new TextEncoder().encode('+++');
      await this.writer.write(plusSequence);
      
      // Wait for 1 second as required by SiK firmware
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.isInATMode = true;
      
      // Set timeout to automatically exit AT mode after 30 seconds of inactivity
      this.resetATModeTimeout();
      
      return true;
    } catch (error) {
      console.error('Failed to enter AT mode:', error);
      return false;
    }
  }

  /**
   * Exit AT command mode
   */
  async exitATMode(): Promise<void> {
    if (!this.writer || !this.isInATMode) {
      return;
    }

    try {
      // Send ATO command to exit AT mode
      const atoCommand = new TextEncoder().encode('ATO\r\n');
      await this.writer.write(atoCommand);
      
      this.isInATMode = false;
      
      if (this.atModeTimeout) {
        clearTimeout(this.atModeTimeout);
        this.atModeTimeout = null;
      }
    } catch (error) {
      console.error('Failed to exit AT mode:', error);
    }
  }

  /**
   * Send an AT command and wait for response
   */
  async sendATCommand(command: string): Promise<string> {
    if (!this.writer) {
      throw new Error('No writer available');
    }

    // Enter AT mode if not already in it
    if (!this.isInATMode) {
      const entered = await this.enterATMode();
      if (!entered) {
        throw new Error('Failed to enter AT mode');
      }
    }

    // Reset the AT mode timeout
    this.resetATModeTimeout();

    return new Promise((resolve, reject) => {
      let responseBuffer = '';
      const responseTimeout: NodeJS.Timeout = setTimeout(() => {
        window.removeEventListener('atResponse', handleATResponse as EventListener);
        reject(new Error('AT command timeout'));
      }, 5000);

      // Listen for AT responses
      const handleATResponse = (event: CustomEvent) => {
        responseBuffer += event.detail;
        
        // Check if we have a complete response (ends with OK, ERROR, or specific response)
        if (responseBuffer.includes('OK\r\n') || 
            responseBuffer.includes('ERROR\r\n') || 
            responseBuffer.includes('\r\n\r\n')) {
          
          window.removeEventListener('atResponse', handleATResponse as EventListener);
          clearTimeout(responseTimeout);
          resolve(responseBuffer.trim());
        }
      };

      // Set up response listener
      window.addEventListener('atResponse', handleATResponse as EventListener);

      // Send the command
      const commandBytes = new TextEncoder().encode(command + '\r\n');
      this.writer!.write(commandBytes).catch(reject);
    });
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
  getPortInfo(): SerialPortInfo | null {
    return this.port?.getInfo() || null;
  }
} 