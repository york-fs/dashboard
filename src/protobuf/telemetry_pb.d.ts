import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace yorkfs. */
export namespace yorkfs {

    /** Namespace dashboard. */
    namespace dashboard {

        /** Properties of a APPSData. */
        interface IAPPSData {

            /** APPSData state */
            state?: (yorkfs.dashboard.APPSData.APPSState|null);

            /** APPSData currentThrottlePercentage */
            currentThrottlePercentage?: (number|null);

            /** APPSData currentMotorCurrent */
            currentMotorCurrent?: (number|null);

            /** APPSData currentMotorRpm */
            currentMotorRpm?: (number|null);
        }

        /** Represents a APPSData. */
        class APPSData implements IAPPSData {

            /**
             * Constructs a new APPSData.
             * @param [properties] Properties to set
             */
            constructor(properties?: yorkfs.dashboard.IAPPSData);

            /** APPSData state. */
            public state: yorkfs.dashboard.APPSData.APPSState;

            /** APPSData currentThrottlePercentage. */
            public currentThrottlePercentage: number;

            /** APPSData currentMotorCurrent. */
            public currentMotorCurrent: number;

            /** APPSData currentMotorRpm. */
            public currentMotorRpm: number;

            /**
             * Creates a new APPSData instance using the specified properties.
             * @param [properties] Properties to set
             * @returns APPSData instance
             */
            public static create(properties?: yorkfs.dashboard.IAPPSData): yorkfs.dashboard.APPSData;

            /**
             * Encodes the specified APPSData message. Does not implicitly {@link yorkfs.dashboard.APPSData.verify|verify} messages.
             * @param message APPSData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: yorkfs.dashboard.IAPPSData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified APPSData message, length delimited. Does not implicitly {@link yorkfs.dashboard.APPSData.verify|verify} messages.
             * @param message APPSData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: yorkfs.dashboard.IAPPSData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a APPSData message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns APPSData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): yorkfs.dashboard.APPSData;

            /**
             * Decodes a APPSData message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns APPSData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): yorkfs.dashboard.APPSData;

            /**
             * Verifies a APPSData message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a APPSData message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns APPSData
             */
            public static fromObject(object: { [k: string]: any }): yorkfs.dashboard.APPSData;

            /**
             * Creates a plain object from a APPSData message. Also converts values to other types if specified.
             * @param message APPSData
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: yorkfs.dashboard.APPSData, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this APPSData to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for APPSData
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace APPSData {

            /** APPSState enum. */
            enum APPSState {
                APPS_STATE_UNSPECIFIED = 0,
                APPS_STATE_INVERTER_MISMATCH = 1,
                APPS_STATE_SENSOR_ERROR = 2,
                APPS_STATE_UNCALIBRATED = 3,
                APPS_STATE_CALIBRATING = 4,
                APPS_STATE_CALIBRATION_HOLD = 5,
                APPS_STATE_RUNNING = 6
            }
        }

        /** Properties of a BMSSegmentData. */
        interface IBMSSegmentData {

            /** BMSSegmentData buckConverterRailVoltage */
            buckConverterRailVoltage?: (number|null);

            /** BMSSegmentData connectedCellTapBitset */
            connectedCellTapBitset?: (number|null);

            /** BMSSegmentData degradedCellTapBitset */
            degradedCellTapBitset?: (number|null);

            /** BMSSegmentData connectedThermistorBitset */
            connectedThermistorBitset?: (number|null);

            /** BMSSegmentData cellVoltages */
            cellVoltages?: (number[]|null);

            /** BMSSegmentData temperatures */
            temperatures?: (number[]|null);
        }

        /** Represents a BMSSegmentData. */
        class BMSSegmentData implements IBMSSegmentData {

            /**
             * Constructs a new BMSSegmentData.
             * @param [properties] Properties to set
             */
            constructor(properties?: yorkfs.dashboard.IBMSSegmentData);

            /** BMSSegmentData buckConverterRailVoltage. */
            public buckConverterRailVoltage: number;

            /** BMSSegmentData connectedCellTapBitset. */
            public connectedCellTapBitset: number;

            /** BMSSegmentData degradedCellTapBitset. */
            public degradedCellTapBitset: number;

            /** BMSSegmentData connectedThermistorBitset. */
            public connectedThermistorBitset: number;

            /** BMSSegmentData cellVoltages. */
            public cellVoltages: number[];

            /** BMSSegmentData temperatures. */
            public temperatures: number[];

            /**
             * Creates a new BMSSegmentData instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BMSSegmentData instance
             */
            public static create(properties?: yorkfs.dashboard.IBMSSegmentData): yorkfs.dashboard.BMSSegmentData;

            /**
             * Encodes the specified BMSSegmentData message. Does not implicitly {@link yorkfs.dashboard.BMSSegmentData.verify|verify} messages.
             * @param message BMSSegmentData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: yorkfs.dashboard.IBMSSegmentData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BMSSegmentData message, length delimited. Does not implicitly {@link yorkfs.dashboard.BMSSegmentData.verify|verify} messages.
             * @param message BMSSegmentData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: yorkfs.dashboard.IBMSSegmentData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BMSSegmentData message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BMSSegmentData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): yorkfs.dashboard.BMSSegmentData;

            /**
             * Decodes a BMSSegmentData message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BMSSegmentData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): yorkfs.dashboard.BMSSegmentData;

            /**
             * Verifies a BMSSegmentData message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BMSSegmentData message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BMSSegmentData
             */
            public static fromObject(object: { [k: string]: any }): yorkfs.dashboard.BMSSegmentData;

            /**
             * Creates a plain object from a BMSSegmentData message. Also converts values to other types if specified.
             * @param message BMSSegmentData
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: yorkfs.dashboard.BMSSegmentData, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BMSSegmentData to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for BMSSegmentData
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a BMSData. */
        interface IBMSData {

            /** BMSData shutdownActivated */
            shutdownActivated?: (boolean|null);

            /** BMSData shutdownReason */
            shutdownReason?: (yorkfs.dashboard.BMSData.ShutdownReason|null);

            /** BMSData measuredLvs_12vRail */
            measuredLvs_12vRail?: (number|null);

            /** BMSData positiveCurrent */
            positiveCurrent?: (number|null);

            /** BMSData negativeCurrent */
            negativeCurrent?: (number|null);

            /** BMSData segments */
            segments?: (yorkfs.dashboard.IBMSSegmentData[]|null);
        }

        /** Represents a BMSData. */
        class BMSData implements IBMSData {

            /**
             * Constructs a new BMSData.
             * @param [properties] Properties to set
             */
            constructor(properties?: yorkfs.dashboard.IBMSData);

            /** BMSData shutdownActivated. */
            public shutdownActivated: boolean;

            /** BMSData shutdownReason. */
            public shutdownReason: yorkfs.dashboard.BMSData.ShutdownReason;

            /** BMSData measuredLvs_12vRail. */
            public measuredLvs_12vRail: number;

            /** BMSData positiveCurrent. */
            public positiveCurrent: number;

            /** BMSData negativeCurrent. */
            public negativeCurrent: number;

            /** BMSData segments. */
            public segments: yorkfs.dashboard.IBMSSegmentData[];

            /**
             * Creates a new BMSData instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BMSData instance
             */
            public static create(properties?: yorkfs.dashboard.IBMSData): yorkfs.dashboard.BMSData;

            /**
             * Encodes the specified BMSData message. Does not implicitly {@link yorkfs.dashboard.BMSData.verify|verify} messages.
             * @param message BMSData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: yorkfs.dashboard.IBMSData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BMSData message, length delimited. Does not implicitly {@link yorkfs.dashboard.BMSData.verify|verify} messages.
             * @param message BMSData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: yorkfs.dashboard.IBMSData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BMSData message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BMSData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): yorkfs.dashboard.BMSData;

            /**
             * Decodes a BMSData message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BMSData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): yorkfs.dashboard.BMSData;

            /**
             * Verifies a BMSData message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BMSData message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BMSData
             */
            public static fromObject(object: { [k: string]: any }): yorkfs.dashboard.BMSData;

            /**
             * Creates a plain object from a BMSData message. Also converts values to other types if specified.
             * @param message BMSData
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: yorkfs.dashboard.BMSData, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BMSData to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for BMSData
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace BMSData {

            /** ShutdownReason enum. */
            enum ShutdownReason {
                SHUTDOWN_REASON_UNSPECIFIED = 0,
                SHUTDOWN_REASON_OVERCURRENT = 1,
                SHUTDOWN_REASON_OVERTEMPERATURE = 2,
                SHUTDOWN_REASON_UNDERVOLTAGE = 3,
                SHUTDOWN_REASON_OVERVOLTAGE = 4
            }
        }

        /** Properties of an InverterData. */
        interface IInverterData {

            /** InverterData faultCode */
            faultCode?: (yorkfs.dashboard.InverterData.FaultCode|null);

            /** InverterData erpm */
            erpm?: (number|null);

            /** InverterData dutyCycle */
            dutyCycle?: (number|null);

            /** InverterData inputDcVoltage */
            inputDcVoltage?: (number|null);

            /** InverterData acMotorCurrent */
            acMotorCurrent?: (number|null);

            /** InverterData dcBatteryCurrent */
            dcBatteryCurrent?: (number|null);

            /** InverterData controllerTemperature */
            controllerTemperature?: (number|null);

            /** InverterData motorTemperature */
            motorTemperature?: (number|null);

            /** InverterData driveEnabled */
            driveEnabled?: (boolean|null);

            /** InverterData limitStates */
            limitStates?: (yorkfs.dashboard.InverterData.IInverterLimitStates|null);
        }

        /** Represents an InverterData. */
        class InverterData implements IInverterData {

            /**
             * Constructs a new InverterData.
             * @param [properties] Properties to set
             */
            constructor(properties?: yorkfs.dashboard.IInverterData);

            /** InverterData faultCode. */
            public faultCode: yorkfs.dashboard.InverterData.FaultCode;

            /** InverterData erpm. */
            public erpm: number;

            /** InverterData dutyCycle. */
            public dutyCycle: number;

            /** InverterData inputDcVoltage. */
            public inputDcVoltage: number;

            /** InverterData acMotorCurrent. */
            public acMotorCurrent: number;

            /** InverterData dcBatteryCurrent. */
            public dcBatteryCurrent: number;

            /** InverterData controllerTemperature. */
            public controllerTemperature: number;

            /** InverterData motorTemperature. */
            public motorTemperature: number;

            /** InverterData driveEnabled. */
            public driveEnabled: boolean;

            /** InverterData limitStates. */
            public limitStates?: (yorkfs.dashboard.InverterData.IInverterLimitStates|null);

            /**
             * Creates a new InverterData instance using the specified properties.
             * @param [properties] Properties to set
             * @returns InverterData instance
             */
            public static create(properties?: yorkfs.dashboard.IInverterData): yorkfs.dashboard.InverterData;

            /**
             * Encodes the specified InverterData message. Does not implicitly {@link yorkfs.dashboard.InverterData.verify|verify} messages.
             * @param message InverterData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: yorkfs.dashboard.IInverterData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified InverterData message, length delimited. Does not implicitly {@link yorkfs.dashboard.InverterData.verify|verify} messages.
             * @param message InverterData message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: yorkfs.dashboard.IInverterData, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an InverterData message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns InverterData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): yorkfs.dashboard.InverterData;

            /**
             * Decodes an InverterData message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns InverterData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): yorkfs.dashboard.InverterData;

            /**
             * Verifies an InverterData message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an InverterData message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns InverterData
             */
            public static fromObject(object: { [k: string]: any }): yorkfs.dashboard.InverterData;

            /**
             * Creates a plain object from an InverterData message. Also converts values to other types if specified.
             * @param message InverterData
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: yorkfs.dashboard.InverterData, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this InverterData to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for InverterData
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace InverterData {

            /** FaultCode enum. */
            enum FaultCode {
                FAULT_CODE_UNSPECIFIED = 0,
                FAULT_CODE_NO_FAULTS = 1,
                FAULT_CODE_OVERVOLTAGE = 2,
                FAULT_CODE_UNDERVOLTAGE = 3,
                FAULT_CODE_DRIVE_ERROR = 4,
                FAULT_CODE_OVERCURRENT = 5,
                FAULT_CODE_CONTROLLER_OVERTEMPERATURE = 6,
                FAULT_CODE_MOTOR_OVERTEMPERATURE = 7,
                FAULT_CODE_SENSOR_WIRE_FAULT = 8,
                FAULT_CODE_SENSOR_GENERAL_FAULT = 9,
                FAULT_CODE_CAN_ERROR = 10,
                FAULT_CODE_ANALOG_INPUT_ERROR = 11
            }

            /** Properties of an InverterLimitStates. */
            interface IInverterLimitStates {

                /** InverterLimitStates capacitorTemperature */
                capacitorTemperature?: (boolean|null);

                /** InverterLimitStates dcCurrentLimit */
                dcCurrentLimit?: (boolean|null);

                /** InverterLimitStates driveEnableLimit */
                driveEnableLimit?: (boolean|null);

                /** InverterLimitStates igbtAccelerationLimit */
                igbtAccelerationLimit?: (boolean|null);

                /** InverterLimitStates igbtTemperatureLimit */
                igbtTemperatureLimit?: (boolean|null);

                /** InverterLimitStates inputVoltageLimit */
                inputVoltageLimit?: (boolean|null);

                /** InverterLimitStates motorAccelerationTemperatureLimit */
                motorAccelerationTemperatureLimit?: (boolean|null);

                /** InverterLimitStates motorTemperatureLimit */
                motorTemperatureLimit?: (boolean|null);

                /** InverterLimitStates rpmMinimumLimit */
                rpmMinimumLimit?: (boolean|null);

                /** InverterLimitStates rpmMaximumLimit */
                rpmMaximumLimit?: (boolean|null);

                /** InverterLimitStates powerLimit */
                powerLimit?: (boolean|null);
            }

            /** Represents an InverterLimitStates. */
            class InverterLimitStates implements IInverterLimitStates {

                /**
                 * Constructs a new InverterLimitStates.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: yorkfs.dashboard.InverterData.IInverterLimitStates);

                /** InverterLimitStates capacitorTemperature. */
                public capacitorTemperature: boolean;

                /** InverterLimitStates dcCurrentLimit. */
                public dcCurrentLimit: boolean;

                /** InverterLimitStates driveEnableLimit. */
                public driveEnableLimit: boolean;

                /** InverterLimitStates igbtAccelerationLimit. */
                public igbtAccelerationLimit: boolean;

                /** InverterLimitStates igbtTemperatureLimit. */
                public igbtTemperatureLimit: boolean;

                /** InverterLimitStates inputVoltageLimit. */
                public inputVoltageLimit: boolean;

                /** InverterLimitStates motorAccelerationTemperatureLimit. */
                public motorAccelerationTemperatureLimit: boolean;

                /** InverterLimitStates motorTemperatureLimit. */
                public motorTemperatureLimit: boolean;

                /** InverterLimitStates rpmMinimumLimit. */
                public rpmMinimumLimit: boolean;

                /** InverterLimitStates rpmMaximumLimit. */
                public rpmMaximumLimit: boolean;

                /** InverterLimitStates powerLimit. */
                public powerLimit: boolean;

                /**
                 * Creates a new InverterLimitStates instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns InverterLimitStates instance
                 */
                public static create(properties?: yorkfs.dashboard.InverterData.IInverterLimitStates): yorkfs.dashboard.InverterData.InverterLimitStates;

                /**
                 * Encodes the specified InverterLimitStates message. Does not implicitly {@link yorkfs.dashboard.InverterData.InverterLimitStates.verify|verify} messages.
                 * @param message InverterLimitStates message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: yorkfs.dashboard.InverterData.IInverterLimitStates, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified InverterLimitStates message, length delimited. Does not implicitly {@link yorkfs.dashboard.InverterData.InverterLimitStates.verify|verify} messages.
                 * @param message InverterLimitStates message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: yorkfs.dashboard.InverterData.IInverterLimitStates, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an InverterLimitStates message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns InverterLimitStates
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): yorkfs.dashboard.InverterData.InverterLimitStates;

                /**
                 * Decodes an InverterLimitStates message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns InverterLimitStates
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): yorkfs.dashboard.InverterData.InverterLimitStates;

                /**
                 * Verifies an InverterLimitStates message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an InverterLimitStates message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns InverterLimitStates
                 */
                public static fromObject(object: { [k: string]: any }): yorkfs.dashboard.InverterData.InverterLimitStates;

                /**
                 * Creates a plain object from an InverterLimitStates message. Also converts values to other types if specified.
                 * @param message InverterLimitStates
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: yorkfs.dashboard.InverterData.InverterLimitStates, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this InverterLimitStates to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };

                /**
                 * Gets the default type url for InverterLimitStates
                 * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns The default type url
                 */
                public static getTypeUrl(typeUrlPrefix?: string): string;
            }
        }

        /** Properties of a TelemetryPacket. */
        interface ITelemetryPacket {

            /** TelemetryPacket type */
            type?: (yorkfs.dashboard.TelemetryPacket.DataType|null);

            /** TelemetryPacket timestampMs */
            timestampMs?: (number|Long|null);

            /** TelemetryPacket appsData */
            appsData?: (yorkfs.dashboard.IAPPSData|null);

            /** TelemetryPacket bmsData */
            bmsData?: (yorkfs.dashboard.IBMSData|null);

            /** TelemetryPacket inverterData */
            inverterData?: (yorkfs.dashboard.IInverterData|null);
        }

        /** Represents a TelemetryPacket. */
        class TelemetryPacket implements ITelemetryPacket {

            /**
             * Constructs a new TelemetryPacket.
             * @param [properties] Properties to set
             */
            constructor(properties?: yorkfs.dashboard.ITelemetryPacket);

            /** TelemetryPacket type. */
            public type: yorkfs.dashboard.TelemetryPacket.DataType;

            /** TelemetryPacket timestampMs. */
            public timestampMs: (number|Long);

            /** TelemetryPacket appsData. */
            public appsData?: (yorkfs.dashboard.IAPPSData|null);

            /** TelemetryPacket bmsData. */
            public bmsData?: (yorkfs.dashboard.IBMSData|null);

            /** TelemetryPacket inverterData. */
            public inverterData?: (yorkfs.dashboard.IInverterData|null);

            /** TelemetryPacket payload. */
            public payload?: ("appsData"|"bmsData"|"inverterData");

            /**
             * Creates a new TelemetryPacket instance using the specified properties.
             * @param [properties] Properties to set
             * @returns TelemetryPacket instance
             */
            public static create(properties?: yorkfs.dashboard.ITelemetryPacket): yorkfs.dashboard.TelemetryPacket;

            /**
             * Encodes the specified TelemetryPacket message. Does not implicitly {@link yorkfs.dashboard.TelemetryPacket.verify|verify} messages.
             * @param message TelemetryPacket message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: yorkfs.dashboard.ITelemetryPacket, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified TelemetryPacket message, length delimited. Does not implicitly {@link yorkfs.dashboard.TelemetryPacket.verify|verify} messages.
             * @param message TelemetryPacket message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: yorkfs.dashboard.ITelemetryPacket, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a TelemetryPacket message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns TelemetryPacket
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): yorkfs.dashboard.TelemetryPacket;

            /**
             * Decodes a TelemetryPacket message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns TelemetryPacket
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): yorkfs.dashboard.TelemetryPacket;

            /**
             * Verifies a TelemetryPacket message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a TelemetryPacket message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns TelemetryPacket
             */
            public static fromObject(object: { [k: string]: any }): yorkfs.dashboard.TelemetryPacket;

            /**
             * Creates a plain object from a TelemetryPacket message. Also converts values to other types if specified.
             * @param message TelemetryPacket
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: yorkfs.dashboard.TelemetryPacket, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this TelemetryPacket to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for TelemetryPacket
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace TelemetryPacket {

            /** DataType enum. */
            enum DataType {
                DATA_TYPE_UNSPECIFIED = 0,
                DATA_TYPE_APPS = 1,
                DATA_TYPE_BMS = 2,
                DATA_TYPE_INVERTER = 3
            }
        }

        /** Properties of a CANMessage. */
        interface ICANMessage {

            /** CANMessage id */
            id?: (number|null);

            /** CANMessage data */
            data?: (Uint8Array|null);

            /** CANMessage isExtendedId */
            isExtendedId?: (boolean|null);

            /** CANMessage isRtr */
            isRtr?: (boolean|null);
        }

        /** Represents a CANMessage. */
        class CANMessage implements ICANMessage {

            /**
             * Constructs a new CANMessage.
             * @param [properties] Properties to set
             */
            constructor(properties?: yorkfs.dashboard.ICANMessage);

            /** CANMessage id. */
            public id: number;

            /** CANMessage data. */
            public data: Uint8Array;

            /** CANMessage isExtendedId. */
            public isExtendedId: boolean;

            /** CANMessage isRtr. */
            public isRtr: boolean;

            /**
             * Creates a new CANMessage instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CANMessage instance
             */
            public static create(properties?: yorkfs.dashboard.ICANMessage): yorkfs.dashboard.CANMessage;

            /**
             * Encodes the specified CANMessage message. Does not implicitly {@link yorkfs.dashboard.CANMessage.verify|verify} messages.
             * @param message CANMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: yorkfs.dashboard.ICANMessage, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CANMessage message, length delimited. Does not implicitly {@link yorkfs.dashboard.CANMessage.verify|verify} messages.
             * @param message CANMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: yorkfs.dashboard.ICANMessage, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CANMessage message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CANMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): yorkfs.dashboard.CANMessage;

            /**
             * Decodes a CANMessage message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CANMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): yorkfs.dashboard.CANMessage;

            /**
             * Verifies a CANMessage message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CANMessage message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CANMessage
             */
            public static fromObject(object: { [k: string]: any }): yorkfs.dashboard.CANMessage;

            /**
             * Creates a plain object from a CANMessage message. Also converts values to other types if specified.
             * @param message CANMessage
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: yorkfs.dashboard.CANMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CANMessage to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for CANMessage
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        /** Properties of a DashboardCommand. */
        interface IDashboardCommand {

            /** DashboardCommand type */
            type?: (yorkfs.dashboard.DashboardCommand.CommandType|null);

            /** DashboardCommand commandTimestampMs */
            commandTimestampMs?: (number|Long|null);

            /** DashboardCommand canToSend */
            canToSend?: (yorkfs.dashboard.ICANMessage|null);
        }

        /** Represents a DashboardCommand. */
        class DashboardCommand implements IDashboardCommand {

            /**
             * Constructs a new DashboardCommand.
             * @param [properties] Properties to set
             */
            constructor(properties?: yorkfs.dashboard.IDashboardCommand);

            /** DashboardCommand type. */
            public type: yorkfs.dashboard.DashboardCommand.CommandType;

            /** DashboardCommand commandTimestampMs. */
            public commandTimestampMs: (number|Long);

            /** DashboardCommand canToSend. */
            public canToSend?: (yorkfs.dashboard.ICANMessage|null);

            /** DashboardCommand commandPayload. */
            public commandPayload?: "canToSend";

            /**
             * Creates a new DashboardCommand instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DashboardCommand instance
             */
            public static create(properties?: yorkfs.dashboard.IDashboardCommand): yorkfs.dashboard.DashboardCommand;

            /**
             * Encodes the specified DashboardCommand message. Does not implicitly {@link yorkfs.dashboard.DashboardCommand.verify|verify} messages.
             * @param message DashboardCommand message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: yorkfs.dashboard.IDashboardCommand, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DashboardCommand message, length delimited. Does not implicitly {@link yorkfs.dashboard.DashboardCommand.verify|verify} messages.
             * @param message DashboardCommand message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: yorkfs.dashboard.IDashboardCommand, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DashboardCommand message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DashboardCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): yorkfs.dashboard.DashboardCommand;

            /**
             * Decodes a DashboardCommand message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DashboardCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): yorkfs.dashboard.DashboardCommand;

            /**
             * Verifies a DashboardCommand message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DashboardCommand message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DashboardCommand
             */
            public static fromObject(object: { [k: string]: any }): yorkfs.dashboard.DashboardCommand;

            /**
             * Creates a plain object from a DashboardCommand message. Also converts values to other types if specified.
             * @param message DashboardCommand
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: yorkfs.dashboard.DashboardCommand, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DashboardCommand to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };

            /**
             * Gets the default type url for DashboardCommand
             * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns The default type url
             */
            public static getTypeUrl(typeUrlPrefix?: string): string;
        }

        namespace DashboardCommand {

            /** CommandType enum. */
            enum CommandType {
                COMMAND_TYPE_UNSPECIFIED = 0,
                COMMAND_TYPE_SEND_CAN_MESSAGE = 1
            }
        }
    }
}
