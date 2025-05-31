import { yorkfs } from '../protobuf/telemetry_pb.js'; // Adjust path if necessary
const { APPSData, BMSData, InverterData, TelemetryPacket } = yorkfs.dashboard;

export function generateMockAPPSData(): yorkfs.dashboard.IAPPSData {
  const states = [
    APPSData.APPSState.APPS_STATE_IDLE,
    APPSData.APPSState.APPS_STATE_RUNNING,
    APPSData.APPSState.APPS_STATE_READY,
  ];
  return {
    state: states[Math.floor(Math.random() * states.length)],
    currentThrottlePercentage: Math.random(),
    currentMotorCurrent: Math.random() * 150,
    currentMotorRpm: Math.floor(Math.random() * 5000),
    // pedalState and fault are optional, can be added if needed
  };
}

export function generateMockBMSData(): yorkfs.dashboard.IBMSData {
  const generateSegment = (): yorkfs.dashboard.IBMSSegmentData => ({
    buckConverterRailVoltage: 3.2 + Math.random() * 0.2,
    connectedCellTapBitset: 0xFFF, // All 12 cells
    degradedCellTapBitset: Math.random() > 0.9 ? 1 << Math.floor(Math.random() * 12) : 0,
    connectedThermistorBitset: 0x7FFFFF, // All 23 thermistors (example, proto has 23)
    cellVoltages: Array(12).fill(0).map(() => 3.0 + Math.random() * 1.2),
    temperatures: Array(8).fill(0).map(() => 20 + Math.random() * 25), // Simpler: 8 thermistors for mock
    // segmentId is optional and can be omitted or added if needed
  });

  const shutdown = Math.random() > 0.95;
  return {
    shutdownActivated: shutdown,
    shutdownReason: shutdown ? BMSData.ShutdownReason.SHUTDOWN_REASON_OVERCURRENT : BMSData.ShutdownReason.SHUTDOWN_REASON_UNSPECIFIED,
    measuredLvs12vRail: 11.5 + Math.random() * 2,
    positiveCurrent: Math.random() * 100,
    negativeCurrent: Math.random() * 20,
    segments: [generateSegment(), generateSegment()], // Simulate 2 segments
    // lvsLoadFault, lvsLoadStatus, amsFault are optional
  };
}

export function generateMockInverterData(): yorkfs.dashboard.IInverterData {
  const faultCodes = [
    InverterData.FaultCode.FAULT_CODE_NO_FAULTS,
    InverterData.FaultCode.FAULT_CODE_OVERVOLTAGE,
    InverterData.FaultCode.FAULT_CODE_MOTOR_OVERTEMPERATURE,
    InverterData.FaultCode.FAULT_CODE_CONTROLLER_OVERTEMPERATURE,
    InverterData.FaultCode.FAULT_CODE_DC_BUS_OVERVOLTAGE,
    InverterData.FaultCode.FAULT_CODE_SOFTWARE_OVERCURRENT,
  ];
  return {
    faultCode: faultCodes[Math.floor(Math.random() * faultCodes.length)],
    erpm: Math.floor(Math.random() * 20000), // Electrical RPM
    dutyCycle: Math.random(),
    inputDcVoltage: 90 + Math.random() * 40, // e.g. 90V to 130V
    acMotorCurrent: Math.random() * 150, // RMS current to motor
    dcBatteryCurrent: Math.random() * 150, // Current from battery
    controllerTemperature: 30 + Math.random() * 50, // Celsius
    motorTemperature: 30 + Math.random() * 70, // Celsius
    driveEnabled: Math.random() > 0.1, // Mostly true
    limitStates: { // yorkfs.dashboard.IInverterLimitStates
      capacitorTemperature: Math.random() > 0.9,
      dcCurrentLimit: Math.random() > 0.9,
      driveEnableLimit: Math.random() > 0.9,
      igbtAccelerationLimit: Math.random() > 0.9,
      igbtTemperatureLimit: Math.random() > 0.9,
      inputVoltageLimit: Math.random() > 0.9,
      motorAccelerationTemperatureLimit: Math.random() > 0.9,
      motorTemperatureLimit: Math.random() > 0.9,
      rpmMinimumLimit: Math.random() > 0.9,
      rpmMaximumLimit: Math.random() > 0.9,
      powerLimit: Math.random() > 0.9,
    },
    // phaseACurrent, phaseBCurrent, phaseCCurrent, hwVersion, swVersion are optional
  };
}

// Example of how to generate a full TelemetryPacket with oneof payload
export function generateMockTelemetryPacket(dataType?: yorkfs.dashboard.TelemetryPacket.DataType): yorkfs.dashboard.ITelemetryPacket {
  const packetType = dataType || TelemetryPacket.DataType.DATA_TYPE_APPS; // Default or specified

  let payload: yorkfs.dashboard.TelemetryPacket.IPayload;

  switch (packetType) {
    case TelemetryPacket.DataType.DATA_TYPE_APPS:
      payload = { appsData: generateMockAPPSData() };
      break;
    case TelemetryPacket.DataType.DATA_TYPE_BMS:
      payload = { bmsData: generateMockBMSData() };
      break;
    case TelemetryPacket.DataType.DATA_TYPE_INVERTER:
      payload = { inverterData: generateMockInverterData() };
      break;
    default:
      // Fallback to APPS data if type is unspecified or unknown in this context
      console.warn(`Unknown or unspecified data type for mock packet: ${packetType}, defaulting to APPS.`);
      payload = { appsData: generateMockAPPSData() };
      break;
  }

  return {
    type: packetType,
    timestampMs: Date.now(),
    payload: payload,
  };
}
