/**
 * Serial Client Service
 * Handles Web Serial API communication with SiK telemetry radios
 */

import { yorkfs } from '../protobuf/telemetry_pb.js';
import { useTelemetryStore } from '../features/telemetry/telemetrySlice';

// Extract protobuf classes
const { TelemetryPacket } = yorkfs.dashboard;

export class SerialClient {
  private port: SerialPort | null = null;
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private writer: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private isConnected = false;
  private dataBuffer: Uint8Array = new Uint8Array(0);

  /**
   * Request access to a serial port using Web Serial API
   */
  async requestPort(): Promise<SerialPort> {
    if (!('serial' in navigator)) {
      throw new Error('Web Serial API is not supported in this browser');
    }

    try {
      const port = await navigator.serial.requestPort();
      this.port = port;
      console.log('Serial port access granted:', port);
      return port;
    } catch (error) {
      console.error('Failed to request serial port:', error);
      useTelemetryStore.getState().setConnectionStatus('error', String(error));
      throw error;
    }
  }

  /**
   * Open the serial port with specified baud rate
   */
  async open(baudRate: number = 57600): Promise<void> {
    if (!this.port) {
      throw new Error('No serial port available. Call requestPort() first.');
    }

    try {
      useTelemetryStore.getState().setConnectionStatus('connecting');
      
      await this.port.open({ baudRate });
      
      // Set up reader and writer
      if (this.port.readable) {
        this.reader = this.port.readable.getReader();
      }
      
      if (this.port.writable) {
        this.writer = this.port.writable.getWriter();
      }

      this.isConnected = true;
      useTelemetryStore.getState().setConnectionStatus('connected');
      console.log(`Serial port opened with baud rate: ${baudRate}`);
    } catch (error) {
      console.error('Failed to open serial port:', error);
      useTelemetryStore.getState().setConnectionStatus('error', String(error));
      throw error;
    }
  }

  /**
   * Read incoming data from the serial port
   */
  async readData(): Promise<Uint8Array> {
    if (!this.reader) {
      throw new Error('Serial port is not open or readable');
    }

    try {
      const { value, done } = await this.reader.read();
      
      if (done) {
        console.log('Serial port reading completed');
        return new Uint8Array(0);
      }

      console.log('Received raw data:', value);
      return value;
    } catch (error) {
      console.error('Failed to read from serial port:', error);
      throw error;
    }
  }

  /**
   * Concatenate two Uint8Arrays
   */
  private concatUint8Arrays(a: Uint8Array, b: Uint8Array): Uint8Array {
    const result = new Uint8Array(a.length + b.length);
    result.set(a, 0);
    result.set(b, a.length);
    return result;
  }

  /**
   * Try to extract and parse complete protobuf packets from buffer
   */
  private processBuffer(): yorkfs.dashboard.ITelemetryPacket[] {
    const packets: yorkfs.dashboard.ITelemetryPacket[] = [];
    
    if (this.dataBuffer.length < 2) {
      return packets; // Need at least 2 bytes
    }
    
    console.log(`🔍 Processing buffer: ${this.dataBuffer.length} bytes`);
    
    // Simple approach: try to parse one packet from the beginning
    try {
      const packet = TelemetryPacket.decode(this.dataBuffer);
      
      // Calculate consumed bytes by re-encoding
      const encodedPacket = TelemetryPacket.encode(packet).finish();
      const consumedBytes = encodedPacket.length;
      
      console.log(`✅ Successfully parsed packet, consumed ${consumedBytes} bytes`);
      packets.push(packet);
      
      // Dispatch to global state
      useTelemetryStore.getState().updateTelemetryPacket(packet);
      
      // Remove consumed bytes from buffer
      this.dataBuffer = this.dataBuffer.slice(consumedBytes);
      
    } catch (error) {
      console.log(`⚠️ Failed to parse packet: ${(error as Error).message}`);
      
      // If parsing fails, look for the next potential packet start (0x08)
      let nextStart = -1;
      for (let i = 1; i < Math.min(this.dataBuffer.length, 50); i++) {
        if (this.dataBuffer[i] === 0x08) {
          nextStart = i;
          break;
        }
      }
      
      if (nextStart > 0) {
        console.log(`🔍 Discarding ${nextStart} bytes, found potential start`);
        this.dataBuffer = this.dataBuffer.slice(nextStart);
      } else if (this.dataBuffer.length > 1000) {
        // Clear buffer if it gets too large
        console.log(`⚠️ Buffer too large, clearing`);
        this.dataBuffer = new Uint8Array(0);
      }
    }
    
    return packets;
  }

  /**
   * Write data to the serial port
   */
  async writeData(data: Uint8Array): Promise<void> {
    if (!this.writer) {
      throw new Error('Serial port is not open or writable');
    }

    try {
      await this.writer.write(data);
      console.log('Data written to serial port:', data);
    } catch (error) {
      console.error('Failed to write to serial port:', error);
      throw error;
    }
  }

  /**
   * Start continuous reading from the serial port with telemetry parsing
   */
  async startReading(onTelemetryData?: (packet: yorkfs.dashboard.ITelemetryPacket) => void): Promise<void> {
    if (!this.isConnected || !this.reader) {
      throw new Error('Serial port is not connected');
    }

    try {
      while (this.isConnected) {
        const rawData = await this.readData();
        if (rawData.length > 0) {
          // Add new data to buffer
          this.dataBuffer = this.concatUint8Arrays(this.dataBuffer, rawData);
          
          // Process complete packets from buffer
          const telemetryPackets = this.processBuffer();
          for (const packet of telemetryPackets) {
            if (packet && onTelemetryData) {
              onTelemetryData(packet);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error during continuous reading:', error);
      useTelemetryStore.getState().setConnectionStatus('error', String(error));
      throw error;
    }
  }

  /**
   * Start continuous reading with raw data callback (for debugging)
   */
  async startRawReading(onRawData: (data: Uint8Array) => void): Promise<void> {
    if (!this.isConnected || !this.reader) {
      throw new Error('Serial port is not connected');
    }

    try {
      while (this.isConnected) {
        const data = await this.readData();
        if (data.length > 0) {
          onRawData(data);
        }
      }
    } catch (error) {
      console.error('Error during continuous reading:', error);
      useTelemetryStore.getState().setConnectionStatus('error', String(error));
      throw error;
    }
  }

  /**
   * Close the serial port connection
   */
  async close(): Promise<void> {
    this.isConnected = false;

    try {
      // Release reader and writer
      if (this.reader) {
        await this.reader.cancel();
        this.reader.releaseLock();
        this.reader = null;
      }

      if (this.writer) {
        await this.writer.close();
        this.writer = null;
      }

      // Close the port
      if (this.port) {
        await this.port.close();
        console.log('Serial port closed');
      }
      
      // Clear data buffer
      this.dataBuffer = new Uint8Array(0);
      
      useTelemetryStore.getState().setConnectionStatus('disconnected');
    } catch (error) {
      console.error('Failed to close serial port:', error);
      useTelemetryStore.getState().setConnectionStatus('error', String(error));
      throw error;
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Get port info (if available)
   */
  getPortInfo(): SerialPortInfo | null {
    return this.port?.getInfo() || null;
  }
} 