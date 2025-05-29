/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const yorkfs = $root.yorkfs = (() => {

    /**
     * Namespace yorkfs.
     * @exports yorkfs
     * @namespace
     */
    const yorkfs = {};

    yorkfs.dashboard = (function() {

        /**
         * Namespace dashboard.
         * @memberof yorkfs
         * @namespace
         */
        const dashboard = {};

        dashboard.APPSData = (function() {

            /**
             * Properties of a APPSData.
             * @memberof yorkfs.dashboard
             * @interface IAPPSData
             * @property {yorkfs.dashboard.APPSData.APPSState|null} [state] APPSData state
             * @property {number|null} [currentThrottlePercentage] APPSData currentThrottlePercentage
             * @property {number|null} [currentMotorCurrent] APPSData currentMotorCurrent
             * @property {number|null} [currentMotorRpm] APPSData currentMotorRpm
             */

            /**
             * Constructs a new APPSData.
             * @memberof yorkfs.dashboard
             * @classdesc Represents a APPSData.
             * @implements IAPPSData
             * @constructor
             * @param {yorkfs.dashboard.IAPPSData=} [properties] Properties to set
             */
            function APPSData(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * APPSData state.
             * @member {yorkfs.dashboard.APPSData.APPSState} state
             * @memberof yorkfs.dashboard.APPSData
             * @instance
             */
            APPSData.prototype.state = 0;

            /**
             * APPSData currentThrottlePercentage.
             * @member {number} currentThrottlePercentage
             * @memberof yorkfs.dashboard.APPSData
             * @instance
             */
            APPSData.prototype.currentThrottlePercentage = 0;

            /**
             * APPSData currentMotorCurrent.
             * @member {number} currentMotorCurrent
             * @memberof yorkfs.dashboard.APPSData
             * @instance
             */
            APPSData.prototype.currentMotorCurrent = 0;

            /**
             * APPSData currentMotorRpm.
             * @member {number} currentMotorRpm
             * @memberof yorkfs.dashboard.APPSData
             * @instance
             */
            APPSData.prototype.currentMotorRpm = 0;

            /**
             * Creates a new APPSData instance using the specified properties.
             * @function create
             * @memberof yorkfs.dashboard.APPSData
             * @static
             * @param {yorkfs.dashboard.IAPPSData=} [properties] Properties to set
             * @returns {yorkfs.dashboard.APPSData} APPSData instance
             */
            APPSData.create = function create(properties) {
                return new APPSData(properties);
            };

            /**
             * Encodes the specified APPSData message. Does not implicitly {@link yorkfs.dashboard.APPSData.verify|verify} messages.
             * @function encode
             * @memberof yorkfs.dashboard.APPSData
             * @static
             * @param {yorkfs.dashboard.IAPPSData} message APPSData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            APPSData.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.state != null && Object.hasOwnProperty.call(message, "state"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.state);
                if (message.currentThrottlePercentage != null && Object.hasOwnProperty.call(message, "currentThrottlePercentage"))
                    writer.uint32(/* id 2, wireType 5 =*/21).float(message.currentThrottlePercentage);
                if (message.currentMotorCurrent != null && Object.hasOwnProperty.call(message, "currentMotorCurrent"))
                    writer.uint32(/* id 3, wireType 5 =*/29).float(message.currentMotorCurrent);
                if (message.currentMotorRpm != null && Object.hasOwnProperty.call(message, "currentMotorRpm"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.currentMotorRpm);
                return writer;
            };

            /**
             * Encodes the specified APPSData message, length delimited. Does not implicitly {@link yorkfs.dashboard.APPSData.verify|verify} messages.
             * @function encodeDelimited
             * @memberof yorkfs.dashboard.APPSData
             * @static
             * @param {yorkfs.dashboard.IAPPSData} message APPSData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            APPSData.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a APPSData message from the specified reader or buffer.
             * @function decode
             * @memberof yorkfs.dashboard.APPSData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {yorkfs.dashboard.APPSData} APPSData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            APPSData.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.yorkfs.dashboard.APPSData();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.state = reader.int32();
                            break;
                        }
                    case 2: {
                            message.currentThrottlePercentage = reader.float();
                            break;
                        }
                    case 3: {
                            message.currentMotorCurrent = reader.float();
                            break;
                        }
                    case 4: {
                            message.currentMotorRpm = reader.uint32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a APPSData message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof yorkfs.dashboard.APPSData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {yorkfs.dashboard.APPSData} APPSData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            APPSData.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a APPSData message.
             * @function verify
             * @memberof yorkfs.dashboard.APPSData
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            APPSData.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.state != null && message.hasOwnProperty("state"))
                    switch (message.state) {
                    default:
                        return "state: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                        break;
                    }
                if (message.currentThrottlePercentage != null && message.hasOwnProperty("currentThrottlePercentage"))
                    if (typeof message.currentThrottlePercentage !== "number")
                        return "currentThrottlePercentage: number expected";
                if (message.currentMotorCurrent != null && message.hasOwnProperty("currentMotorCurrent"))
                    if (typeof message.currentMotorCurrent !== "number")
                        return "currentMotorCurrent: number expected";
                if (message.currentMotorRpm != null && message.hasOwnProperty("currentMotorRpm"))
                    if (!$util.isInteger(message.currentMotorRpm))
                        return "currentMotorRpm: integer expected";
                return null;
            };

            /**
             * Creates a APPSData message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof yorkfs.dashboard.APPSData
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {yorkfs.dashboard.APPSData} APPSData
             */
            APPSData.fromObject = function fromObject(object) {
                if (object instanceof $root.yorkfs.dashboard.APPSData)
                    return object;
                let message = new $root.yorkfs.dashboard.APPSData();
                switch (object.state) {
                default:
                    if (typeof object.state === "number") {
                        message.state = object.state;
                        break;
                    }
                    break;
                case "APPS_STATE_UNSPECIFIED":
                case 0:
                    message.state = 0;
                    break;
                case "APPS_STATE_INVERTER_MISMATCH":
                case 1:
                    message.state = 1;
                    break;
                case "APPS_STATE_SENSOR_ERROR":
                case 2:
                    message.state = 2;
                    break;
                case "APPS_STATE_UNCALIBRATED":
                case 3:
                    message.state = 3;
                    break;
                case "APPS_STATE_CALIBRATING":
                case 4:
                    message.state = 4;
                    break;
                case "APPS_STATE_CALIBRATION_HOLD":
                case 5:
                    message.state = 5;
                    break;
                case "APPS_STATE_RUNNING":
                case 6:
                    message.state = 6;
                    break;
                }
                if (object.currentThrottlePercentage != null)
                    message.currentThrottlePercentage = Number(object.currentThrottlePercentage);
                if (object.currentMotorCurrent != null)
                    message.currentMotorCurrent = Number(object.currentMotorCurrent);
                if (object.currentMotorRpm != null)
                    message.currentMotorRpm = object.currentMotorRpm >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a APPSData message. Also converts values to other types if specified.
             * @function toObject
             * @memberof yorkfs.dashboard.APPSData
             * @static
             * @param {yorkfs.dashboard.APPSData} message APPSData
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            APPSData.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.state = options.enums === String ? "APPS_STATE_UNSPECIFIED" : 0;
                    object.currentThrottlePercentage = 0;
                    object.currentMotorCurrent = 0;
                    object.currentMotorRpm = 0;
                }
                if (message.state != null && message.hasOwnProperty("state"))
                    object.state = options.enums === String ? $root.yorkfs.dashboard.APPSData.APPSState[message.state] === undefined ? message.state : $root.yorkfs.dashboard.APPSData.APPSState[message.state] : message.state;
                if (message.currentThrottlePercentage != null && message.hasOwnProperty("currentThrottlePercentage"))
                    object.currentThrottlePercentage = options.json && !isFinite(message.currentThrottlePercentage) ? String(message.currentThrottlePercentage) : message.currentThrottlePercentage;
                if (message.currentMotorCurrent != null && message.hasOwnProperty("currentMotorCurrent"))
                    object.currentMotorCurrent = options.json && !isFinite(message.currentMotorCurrent) ? String(message.currentMotorCurrent) : message.currentMotorCurrent;
                if (message.currentMotorRpm != null && message.hasOwnProperty("currentMotorRpm"))
                    object.currentMotorRpm = message.currentMotorRpm;
                return object;
            };

            /**
             * Converts this APPSData to JSON.
             * @function toJSON
             * @memberof yorkfs.dashboard.APPSData
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            APPSData.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for APPSData
             * @function getTypeUrl
             * @memberof yorkfs.dashboard.APPSData
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            APPSData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/yorkfs.dashboard.APPSData";
            };

            /**
             * APPSState enum.
             * @name yorkfs.dashboard.APPSData.APPSState
             * @enum {number}
             * @property {number} APPS_STATE_UNSPECIFIED=0 APPS_STATE_UNSPECIFIED value
             * @property {number} APPS_STATE_INVERTER_MISMATCH=1 APPS_STATE_INVERTER_MISMATCH value
             * @property {number} APPS_STATE_SENSOR_ERROR=2 APPS_STATE_SENSOR_ERROR value
             * @property {number} APPS_STATE_UNCALIBRATED=3 APPS_STATE_UNCALIBRATED value
             * @property {number} APPS_STATE_CALIBRATING=4 APPS_STATE_CALIBRATING value
             * @property {number} APPS_STATE_CALIBRATION_HOLD=5 APPS_STATE_CALIBRATION_HOLD value
             * @property {number} APPS_STATE_RUNNING=6 APPS_STATE_RUNNING value
             */
            APPSData.APPSState = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "APPS_STATE_UNSPECIFIED"] = 0;
                values[valuesById[1] = "APPS_STATE_INVERTER_MISMATCH"] = 1;
                values[valuesById[2] = "APPS_STATE_SENSOR_ERROR"] = 2;
                values[valuesById[3] = "APPS_STATE_UNCALIBRATED"] = 3;
                values[valuesById[4] = "APPS_STATE_CALIBRATING"] = 4;
                values[valuesById[5] = "APPS_STATE_CALIBRATION_HOLD"] = 5;
                values[valuesById[6] = "APPS_STATE_RUNNING"] = 6;
                return values;
            })();

            return APPSData;
        })();

        dashboard.BMSSegmentData = (function() {

            /**
             * Properties of a BMSSegmentData.
             * @memberof yorkfs.dashboard
             * @interface IBMSSegmentData
             * @property {number|null} [buckConverterRailVoltage] BMSSegmentData buckConverterRailVoltage
             * @property {number|null} [connectedCellTapBitset] BMSSegmentData connectedCellTapBitset
             * @property {number|null} [degradedCellTapBitset] BMSSegmentData degradedCellTapBitset
             * @property {number|null} [connectedThermistorBitset] BMSSegmentData connectedThermistorBitset
             * @property {Array.<number>|null} [cellVoltages] BMSSegmentData cellVoltages
             * @property {Array.<number>|null} [temperatures] BMSSegmentData temperatures
             */

            /**
             * Constructs a new BMSSegmentData.
             * @memberof yorkfs.dashboard
             * @classdesc Represents a BMSSegmentData.
             * @implements IBMSSegmentData
             * @constructor
             * @param {yorkfs.dashboard.IBMSSegmentData=} [properties] Properties to set
             */
            function BMSSegmentData(properties) {
                this.cellVoltages = [];
                this.temperatures = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * BMSSegmentData buckConverterRailVoltage.
             * @member {number} buckConverterRailVoltage
             * @memberof yorkfs.dashboard.BMSSegmentData
             * @instance
             */
            BMSSegmentData.prototype.buckConverterRailVoltage = 0;

            /**
             * BMSSegmentData connectedCellTapBitset.
             * @member {number} connectedCellTapBitset
             * @memberof yorkfs.dashboard.BMSSegmentData
             * @instance
             */
            BMSSegmentData.prototype.connectedCellTapBitset = 0;

            /**
             * BMSSegmentData degradedCellTapBitset.
             * @member {number} degradedCellTapBitset
             * @memberof yorkfs.dashboard.BMSSegmentData
             * @instance
             */
            BMSSegmentData.prototype.degradedCellTapBitset = 0;

            /**
             * BMSSegmentData connectedThermistorBitset.
             * @member {number} connectedThermistorBitset
             * @memberof yorkfs.dashboard.BMSSegmentData
             * @instance
             */
            BMSSegmentData.prototype.connectedThermistorBitset = 0;

            /**
             * BMSSegmentData cellVoltages.
             * @member {Array.<number>} cellVoltages
             * @memberof yorkfs.dashboard.BMSSegmentData
             * @instance
             */
            BMSSegmentData.prototype.cellVoltages = $util.emptyArray;

            /**
             * BMSSegmentData temperatures.
             * @member {Array.<number>} temperatures
             * @memberof yorkfs.dashboard.BMSSegmentData
             * @instance
             */
            BMSSegmentData.prototype.temperatures = $util.emptyArray;

            /**
             * Creates a new BMSSegmentData instance using the specified properties.
             * @function create
             * @memberof yorkfs.dashboard.BMSSegmentData
             * @static
             * @param {yorkfs.dashboard.IBMSSegmentData=} [properties] Properties to set
             * @returns {yorkfs.dashboard.BMSSegmentData} BMSSegmentData instance
             */
            BMSSegmentData.create = function create(properties) {
                return new BMSSegmentData(properties);
            };

            /**
             * Encodes the specified BMSSegmentData message. Does not implicitly {@link yorkfs.dashboard.BMSSegmentData.verify|verify} messages.
             * @function encode
             * @memberof yorkfs.dashboard.BMSSegmentData
             * @static
             * @param {yorkfs.dashboard.IBMSSegmentData} message BMSSegmentData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BMSSegmentData.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.buckConverterRailVoltage != null && Object.hasOwnProperty.call(message, "buckConverterRailVoltage"))
                    writer.uint32(/* id 1, wireType 5 =*/13).float(message.buckConverterRailVoltage);
                if (message.connectedCellTapBitset != null && Object.hasOwnProperty.call(message, "connectedCellTapBitset"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.connectedCellTapBitset);
                if (message.degradedCellTapBitset != null && Object.hasOwnProperty.call(message, "degradedCellTapBitset"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.degradedCellTapBitset);
                if (message.connectedThermistorBitset != null && Object.hasOwnProperty.call(message, "connectedThermistorBitset"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.connectedThermistorBitset);
                if (message.cellVoltages != null && message.cellVoltages.length) {
                    writer.uint32(/* id 5, wireType 2 =*/42).fork();
                    for (let i = 0; i < message.cellVoltages.length; ++i)
                        writer.float(message.cellVoltages[i]);
                    writer.ldelim();
                }
                if (message.temperatures != null && message.temperatures.length) {
                    writer.uint32(/* id 6, wireType 2 =*/50).fork();
                    for (let i = 0; i < message.temperatures.length; ++i)
                        writer.float(message.temperatures[i]);
                    writer.ldelim();
                }
                return writer;
            };

            /**
             * Encodes the specified BMSSegmentData message, length delimited. Does not implicitly {@link yorkfs.dashboard.BMSSegmentData.verify|verify} messages.
             * @function encodeDelimited
             * @memberof yorkfs.dashboard.BMSSegmentData
             * @static
             * @param {yorkfs.dashboard.IBMSSegmentData} message BMSSegmentData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BMSSegmentData.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a BMSSegmentData message from the specified reader or buffer.
             * @function decode
             * @memberof yorkfs.dashboard.BMSSegmentData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {yorkfs.dashboard.BMSSegmentData} BMSSegmentData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BMSSegmentData.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.yorkfs.dashboard.BMSSegmentData();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.buckConverterRailVoltage = reader.float();
                            break;
                        }
                    case 2: {
                            message.connectedCellTapBitset = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.degradedCellTapBitset = reader.uint32();
                            break;
                        }
                    case 4: {
                            message.connectedThermistorBitset = reader.uint32();
                            break;
                        }
                    case 5: {
                            if (!(message.cellVoltages && message.cellVoltages.length))
                                message.cellVoltages = [];
                            if ((tag & 7) === 2) {
                                let end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.cellVoltages.push(reader.float());
                            } else
                                message.cellVoltages.push(reader.float());
                            break;
                        }
                    case 6: {
                            if (!(message.temperatures && message.temperatures.length))
                                message.temperatures = [];
                            if ((tag & 7) === 2) {
                                let end2 = reader.uint32() + reader.pos;
                                while (reader.pos < end2)
                                    message.temperatures.push(reader.float());
                            } else
                                message.temperatures.push(reader.float());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a BMSSegmentData message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof yorkfs.dashboard.BMSSegmentData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {yorkfs.dashboard.BMSSegmentData} BMSSegmentData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BMSSegmentData.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a BMSSegmentData message.
             * @function verify
             * @memberof yorkfs.dashboard.BMSSegmentData
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BMSSegmentData.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.buckConverterRailVoltage != null && message.hasOwnProperty("buckConverterRailVoltage"))
                    if (typeof message.buckConverterRailVoltage !== "number")
                        return "buckConverterRailVoltage: number expected";
                if (message.connectedCellTapBitset != null && message.hasOwnProperty("connectedCellTapBitset"))
                    if (!$util.isInteger(message.connectedCellTapBitset))
                        return "connectedCellTapBitset: integer expected";
                if (message.degradedCellTapBitset != null && message.hasOwnProperty("degradedCellTapBitset"))
                    if (!$util.isInteger(message.degradedCellTapBitset))
                        return "degradedCellTapBitset: integer expected";
                if (message.connectedThermistorBitset != null && message.hasOwnProperty("connectedThermistorBitset"))
                    if (!$util.isInteger(message.connectedThermistorBitset))
                        return "connectedThermistorBitset: integer expected";
                if (message.cellVoltages != null && message.hasOwnProperty("cellVoltages")) {
                    if (!Array.isArray(message.cellVoltages))
                        return "cellVoltages: array expected";
                    for (let i = 0; i < message.cellVoltages.length; ++i)
                        if (typeof message.cellVoltages[i] !== "number")
                            return "cellVoltages: number[] expected";
                }
                if (message.temperatures != null && message.hasOwnProperty("temperatures")) {
                    if (!Array.isArray(message.temperatures))
                        return "temperatures: array expected";
                    for (let i = 0; i < message.temperatures.length; ++i)
                        if (typeof message.temperatures[i] !== "number")
                            return "temperatures: number[] expected";
                }
                return null;
            };

            /**
             * Creates a BMSSegmentData message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof yorkfs.dashboard.BMSSegmentData
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {yorkfs.dashboard.BMSSegmentData} BMSSegmentData
             */
            BMSSegmentData.fromObject = function fromObject(object) {
                if (object instanceof $root.yorkfs.dashboard.BMSSegmentData)
                    return object;
                let message = new $root.yorkfs.dashboard.BMSSegmentData();
                if (object.buckConverterRailVoltage != null)
                    message.buckConverterRailVoltage = Number(object.buckConverterRailVoltage);
                if (object.connectedCellTapBitset != null)
                    message.connectedCellTapBitset = object.connectedCellTapBitset >>> 0;
                if (object.degradedCellTapBitset != null)
                    message.degradedCellTapBitset = object.degradedCellTapBitset >>> 0;
                if (object.connectedThermistorBitset != null)
                    message.connectedThermistorBitset = object.connectedThermistorBitset >>> 0;
                if (object.cellVoltages) {
                    if (!Array.isArray(object.cellVoltages))
                        throw TypeError(".yorkfs.dashboard.BMSSegmentData.cellVoltages: array expected");
                    message.cellVoltages = [];
                    for (let i = 0; i < object.cellVoltages.length; ++i)
                        message.cellVoltages[i] = Number(object.cellVoltages[i]);
                }
                if (object.temperatures) {
                    if (!Array.isArray(object.temperatures))
                        throw TypeError(".yorkfs.dashboard.BMSSegmentData.temperatures: array expected");
                    message.temperatures = [];
                    for (let i = 0; i < object.temperatures.length; ++i)
                        message.temperatures[i] = Number(object.temperatures[i]);
                }
                return message;
            };

            /**
             * Creates a plain object from a BMSSegmentData message. Also converts values to other types if specified.
             * @function toObject
             * @memberof yorkfs.dashboard.BMSSegmentData
             * @static
             * @param {yorkfs.dashboard.BMSSegmentData} message BMSSegmentData
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BMSSegmentData.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults) {
                    object.cellVoltages = [];
                    object.temperatures = [];
                }
                if (options.defaults) {
                    object.buckConverterRailVoltage = 0;
                    object.connectedCellTapBitset = 0;
                    object.degradedCellTapBitset = 0;
                    object.connectedThermistorBitset = 0;
                }
                if (message.buckConverterRailVoltage != null && message.hasOwnProperty("buckConverterRailVoltage"))
                    object.buckConverterRailVoltage = options.json && !isFinite(message.buckConverterRailVoltage) ? String(message.buckConverterRailVoltage) : message.buckConverterRailVoltage;
                if (message.connectedCellTapBitset != null && message.hasOwnProperty("connectedCellTapBitset"))
                    object.connectedCellTapBitset = message.connectedCellTapBitset;
                if (message.degradedCellTapBitset != null && message.hasOwnProperty("degradedCellTapBitset"))
                    object.degradedCellTapBitset = message.degradedCellTapBitset;
                if (message.connectedThermistorBitset != null && message.hasOwnProperty("connectedThermistorBitset"))
                    object.connectedThermistorBitset = message.connectedThermistorBitset;
                if (message.cellVoltages && message.cellVoltages.length) {
                    object.cellVoltages = [];
                    for (let j = 0; j < message.cellVoltages.length; ++j)
                        object.cellVoltages[j] = options.json && !isFinite(message.cellVoltages[j]) ? String(message.cellVoltages[j]) : message.cellVoltages[j];
                }
                if (message.temperatures && message.temperatures.length) {
                    object.temperatures = [];
                    for (let j = 0; j < message.temperatures.length; ++j)
                        object.temperatures[j] = options.json && !isFinite(message.temperatures[j]) ? String(message.temperatures[j]) : message.temperatures[j];
                }
                return object;
            };

            /**
             * Converts this BMSSegmentData to JSON.
             * @function toJSON
             * @memberof yorkfs.dashboard.BMSSegmentData
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BMSSegmentData.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for BMSSegmentData
             * @function getTypeUrl
             * @memberof yorkfs.dashboard.BMSSegmentData
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            BMSSegmentData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/yorkfs.dashboard.BMSSegmentData";
            };

            return BMSSegmentData;
        })();

        dashboard.BMSData = (function() {

            /**
             * Properties of a BMSData.
             * @memberof yorkfs.dashboard
             * @interface IBMSData
             * @property {boolean|null} [shutdownActivated] BMSData shutdownActivated
             * @property {yorkfs.dashboard.BMSData.ShutdownReason|null} [shutdownReason] BMSData shutdownReason
             * @property {number|null} [measuredLvs_12vRail] BMSData measuredLvs_12vRail
             * @property {number|null} [positiveCurrent] BMSData positiveCurrent
             * @property {number|null} [negativeCurrent] BMSData negativeCurrent
             * @property {Array.<yorkfs.dashboard.IBMSSegmentData>|null} [segments] BMSData segments
             */

            /**
             * Constructs a new BMSData.
             * @memberof yorkfs.dashboard
             * @classdesc Represents a BMSData.
             * @implements IBMSData
             * @constructor
             * @param {yorkfs.dashboard.IBMSData=} [properties] Properties to set
             */
            function BMSData(properties) {
                this.segments = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * BMSData shutdownActivated.
             * @member {boolean} shutdownActivated
             * @memberof yorkfs.dashboard.BMSData
             * @instance
             */
            BMSData.prototype.shutdownActivated = false;

            /**
             * BMSData shutdownReason.
             * @member {yorkfs.dashboard.BMSData.ShutdownReason} shutdownReason
             * @memberof yorkfs.dashboard.BMSData
             * @instance
             */
            BMSData.prototype.shutdownReason = 0;

            /**
             * BMSData measuredLvs_12vRail.
             * @member {number} measuredLvs_12vRail
             * @memberof yorkfs.dashboard.BMSData
             * @instance
             */
            BMSData.prototype.measuredLvs_12vRail = 0;

            /**
             * BMSData positiveCurrent.
             * @member {number} positiveCurrent
             * @memberof yorkfs.dashboard.BMSData
             * @instance
             */
            BMSData.prototype.positiveCurrent = 0;

            /**
             * BMSData negativeCurrent.
             * @member {number} negativeCurrent
             * @memberof yorkfs.dashboard.BMSData
             * @instance
             */
            BMSData.prototype.negativeCurrent = 0;

            /**
             * BMSData segments.
             * @member {Array.<yorkfs.dashboard.IBMSSegmentData>} segments
             * @memberof yorkfs.dashboard.BMSData
             * @instance
             */
            BMSData.prototype.segments = $util.emptyArray;

            /**
             * Creates a new BMSData instance using the specified properties.
             * @function create
             * @memberof yorkfs.dashboard.BMSData
             * @static
             * @param {yorkfs.dashboard.IBMSData=} [properties] Properties to set
             * @returns {yorkfs.dashboard.BMSData} BMSData instance
             */
            BMSData.create = function create(properties) {
                return new BMSData(properties);
            };

            /**
             * Encodes the specified BMSData message. Does not implicitly {@link yorkfs.dashboard.BMSData.verify|verify} messages.
             * @function encode
             * @memberof yorkfs.dashboard.BMSData
             * @static
             * @param {yorkfs.dashboard.IBMSData} message BMSData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BMSData.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.shutdownActivated != null && Object.hasOwnProperty.call(message, "shutdownActivated"))
                    writer.uint32(/* id 1, wireType 0 =*/8).bool(message.shutdownActivated);
                if (message.shutdownReason != null && Object.hasOwnProperty.call(message, "shutdownReason"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int32(message.shutdownReason);
                if (message.measuredLvs_12vRail != null && Object.hasOwnProperty.call(message, "measuredLvs_12vRail"))
                    writer.uint32(/* id 3, wireType 5 =*/29).float(message.measuredLvs_12vRail);
                if (message.positiveCurrent != null && Object.hasOwnProperty.call(message, "positiveCurrent"))
                    writer.uint32(/* id 4, wireType 5 =*/37).float(message.positiveCurrent);
                if (message.negativeCurrent != null && Object.hasOwnProperty.call(message, "negativeCurrent"))
                    writer.uint32(/* id 5, wireType 5 =*/45).float(message.negativeCurrent);
                if (message.segments != null && message.segments.length)
                    for (let i = 0; i < message.segments.length; ++i)
                        $root.yorkfs.dashboard.BMSSegmentData.encode(message.segments[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified BMSData message, length delimited. Does not implicitly {@link yorkfs.dashboard.BMSData.verify|verify} messages.
             * @function encodeDelimited
             * @memberof yorkfs.dashboard.BMSData
             * @static
             * @param {yorkfs.dashboard.IBMSData} message BMSData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            BMSData.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a BMSData message from the specified reader or buffer.
             * @function decode
             * @memberof yorkfs.dashboard.BMSData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {yorkfs.dashboard.BMSData} BMSData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BMSData.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.yorkfs.dashboard.BMSData();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.shutdownActivated = reader.bool();
                            break;
                        }
                    case 2: {
                            message.shutdownReason = reader.int32();
                            break;
                        }
                    case 3: {
                            message.measuredLvs_12vRail = reader.float();
                            break;
                        }
                    case 4: {
                            message.positiveCurrent = reader.float();
                            break;
                        }
                    case 5: {
                            message.negativeCurrent = reader.float();
                            break;
                        }
                    case 6: {
                            if (!(message.segments && message.segments.length))
                                message.segments = [];
                            message.segments.push($root.yorkfs.dashboard.BMSSegmentData.decode(reader, reader.uint32()));
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a BMSData message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof yorkfs.dashboard.BMSData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {yorkfs.dashboard.BMSData} BMSData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            BMSData.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a BMSData message.
             * @function verify
             * @memberof yorkfs.dashboard.BMSData
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            BMSData.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.shutdownActivated != null && message.hasOwnProperty("shutdownActivated"))
                    if (typeof message.shutdownActivated !== "boolean")
                        return "shutdownActivated: boolean expected";
                if (message.shutdownReason != null && message.hasOwnProperty("shutdownReason"))
                    switch (message.shutdownReason) {
                    default:
                        return "shutdownReason: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                        break;
                    }
                if (message.measuredLvs_12vRail != null && message.hasOwnProperty("measuredLvs_12vRail"))
                    if (typeof message.measuredLvs_12vRail !== "number")
                        return "measuredLvs_12vRail: number expected";
                if (message.positiveCurrent != null && message.hasOwnProperty("positiveCurrent"))
                    if (typeof message.positiveCurrent !== "number")
                        return "positiveCurrent: number expected";
                if (message.negativeCurrent != null && message.hasOwnProperty("negativeCurrent"))
                    if (typeof message.negativeCurrent !== "number")
                        return "negativeCurrent: number expected";
                if (message.segments != null && message.hasOwnProperty("segments")) {
                    if (!Array.isArray(message.segments))
                        return "segments: array expected";
                    for (let i = 0; i < message.segments.length; ++i) {
                        let error = $root.yorkfs.dashboard.BMSSegmentData.verify(message.segments[i]);
                        if (error)
                            return "segments." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a BMSData message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof yorkfs.dashboard.BMSData
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {yorkfs.dashboard.BMSData} BMSData
             */
            BMSData.fromObject = function fromObject(object) {
                if (object instanceof $root.yorkfs.dashboard.BMSData)
                    return object;
                let message = new $root.yorkfs.dashboard.BMSData();
                if (object.shutdownActivated != null)
                    message.shutdownActivated = Boolean(object.shutdownActivated);
                switch (object.shutdownReason) {
                default:
                    if (typeof object.shutdownReason === "number") {
                        message.shutdownReason = object.shutdownReason;
                        break;
                    }
                    break;
                case "SHUTDOWN_REASON_UNSPECIFIED":
                case 0:
                    message.shutdownReason = 0;
                    break;
                case "SHUTDOWN_REASON_OVERCURRENT":
                case 1:
                    message.shutdownReason = 1;
                    break;
                case "SHUTDOWN_REASON_OVERTEMPERATURE":
                case 2:
                    message.shutdownReason = 2;
                    break;
                case "SHUTDOWN_REASON_UNDERVOLTAGE":
                case 3:
                    message.shutdownReason = 3;
                    break;
                case "SHUTDOWN_REASON_OVERVOLTAGE":
                case 4:
                    message.shutdownReason = 4;
                    break;
                }
                if (object.measuredLvs_12vRail != null)
                    message.measuredLvs_12vRail = Number(object.measuredLvs_12vRail);
                if (object.positiveCurrent != null)
                    message.positiveCurrent = Number(object.positiveCurrent);
                if (object.negativeCurrent != null)
                    message.negativeCurrent = Number(object.negativeCurrent);
                if (object.segments) {
                    if (!Array.isArray(object.segments))
                        throw TypeError(".yorkfs.dashboard.BMSData.segments: array expected");
                    message.segments = [];
                    for (let i = 0; i < object.segments.length; ++i) {
                        if (typeof object.segments[i] !== "object")
                            throw TypeError(".yorkfs.dashboard.BMSData.segments: object expected");
                        message.segments[i] = $root.yorkfs.dashboard.BMSSegmentData.fromObject(object.segments[i]);
                    }
                }
                return message;
            };

            /**
             * Creates a plain object from a BMSData message. Also converts values to other types if specified.
             * @function toObject
             * @memberof yorkfs.dashboard.BMSData
             * @static
             * @param {yorkfs.dashboard.BMSData} message BMSData
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            BMSData.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.segments = [];
                if (options.defaults) {
                    object.shutdownActivated = false;
                    object.shutdownReason = options.enums === String ? "SHUTDOWN_REASON_UNSPECIFIED" : 0;
                    object.measuredLvs_12vRail = 0;
                    object.positiveCurrent = 0;
                    object.negativeCurrent = 0;
                }
                if (message.shutdownActivated != null && message.hasOwnProperty("shutdownActivated"))
                    object.shutdownActivated = message.shutdownActivated;
                if (message.shutdownReason != null && message.hasOwnProperty("shutdownReason"))
                    object.shutdownReason = options.enums === String ? $root.yorkfs.dashboard.BMSData.ShutdownReason[message.shutdownReason] === undefined ? message.shutdownReason : $root.yorkfs.dashboard.BMSData.ShutdownReason[message.shutdownReason] : message.shutdownReason;
                if (message.measuredLvs_12vRail != null && message.hasOwnProperty("measuredLvs_12vRail"))
                    object.measuredLvs_12vRail = options.json && !isFinite(message.measuredLvs_12vRail) ? String(message.measuredLvs_12vRail) : message.measuredLvs_12vRail;
                if (message.positiveCurrent != null && message.hasOwnProperty("positiveCurrent"))
                    object.positiveCurrent = options.json && !isFinite(message.positiveCurrent) ? String(message.positiveCurrent) : message.positiveCurrent;
                if (message.negativeCurrent != null && message.hasOwnProperty("negativeCurrent"))
                    object.negativeCurrent = options.json && !isFinite(message.negativeCurrent) ? String(message.negativeCurrent) : message.negativeCurrent;
                if (message.segments && message.segments.length) {
                    object.segments = [];
                    for (let j = 0; j < message.segments.length; ++j)
                        object.segments[j] = $root.yorkfs.dashboard.BMSSegmentData.toObject(message.segments[j], options);
                }
                return object;
            };

            /**
             * Converts this BMSData to JSON.
             * @function toJSON
             * @memberof yorkfs.dashboard.BMSData
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            BMSData.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for BMSData
             * @function getTypeUrl
             * @memberof yorkfs.dashboard.BMSData
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            BMSData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/yorkfs.dashboard.BMSData";
            };

            /**
             * ShutdownReason enum.
             * @name yorkfs.dashboard.BMSData.ShutdownReason
             * @enum {number}
             * @property {number} SHUTDOWN_REASON_UNSPECIFIED=0 SHUTDOWN_REASON_UNSPECIFIED value
             * @property {number} SHUTDOWN_REASON_OVERCURRENT=1 SHUTDOWN_REASON_OVERCURRENT value
             * @property {number} SHUTDOWN_REASON_OVERTEMPERATURE=2 SHUTDOWN_REASON_OVERTEMPERATURE value
             * @property {number} SHUTDOWN_REASON_UNDERVOLTAGE=3 SHUTDOWN_REASON_UNDERVOLTAGE value
             * @property {number} SHUTDOWN_REASON_OVERVOLTAGE=4 SHUTDOWN_REASON_OVERVOLTAGE value
             */
            BMSData.ShutdownReason = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "SHUTDOWN_REASON_UNSPECIFIED"] = 0;
                values[valuesById[1] = "SHUTDOWN_REASON_OVERCURRENT"] = 1;
                values[valuesById[2] = "SHUTDOWN_REASON_OVERTEMPERATURE"] = 2;
                values[valuesById[3] = "SHUTDOWN_REASON_UNDERVOLTAGE"] = 3;
                values[valuesById[4] = "SHUTDOWN_REASON_OVERVOLTAGE"] = 4;
                return values;
            })();

            return BMSData;
        })();

        dashboard.InverterData = (function() {

            /**
             * Properties of an InverterData.
             * @memberof yorkfs.dashboard
             * @interface IInverterData
             * @property {yorkfs.dashboard.InverterData.FaultCode|null} [faultCode] InverterData faultCode
             * @property {number|null} [erpm] InverterData erpm
             * @property {number|null} [dutyCycle] InverterData dutyCycle
             * @property {number|null} [inputDcVoltage] InverterData inputDcVoltage
             * @property {number|null} [acMotorCurrent] InverterData acMotorCurrent
             * @property {number|null} [dcBatteryCurrent] InverterData dcBatteryCurrent
             * @property {number|null} [controllerTemperature] InverterData controllerTemperature
             * @property {number|null} [motorTemperature] InverterData motorTemperature
             * @property {boolean|null} [driveEnabled] InverterData driveEnabled
             * @property {yorkfs.dashboard.InverterData.IInverterLimitStates|null} [limitStates] InverterData limitStates
             */

            /**
             * Constructs a new InverterData.
             * @memberof yorkfs.dashboard
             * @classdesc Represents an InverterData.
             * @implements IInverterData
             * @constructor
             * @param {yorkfs.dashboard.IInverterData=} [properties] Properties to set
             */
            function InverterData(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * InverterData faultCode.
             * @member {yorkfs.dashboard.InverterData.FaultCode} faultCode
             * @memberof yorkfs.dashboard.InverterData
             * @instance
             */
            InverterData.prototype.faultCode = 0;

            /**
             * InverterData erpm.
             * @member {number} erpm
             * @memberof yorkfs.dashboard.InverterData
             * @instance
             */
            InverterData.prototype.erpm = 0;

            /**
             * InverterData dutyCycle.
             * @member {number} dutyCycle
             * @memberof yorkfs.dashboard.InverterData
             * @instance
             */
            InverterData.prototype.dutyCycle = 0;

            /**
             * InverterData inputDcVoltage.
             * @member {number} inputDcVoltage
             * @memberof yorkfs.dashboard.InverterData
             * @instance
             */
            InverterData.prototype.inputDcVoltage = 0;

            /**
             * InverterData acMotorCurrent.
             * @member {number} acMotorCurrent
             * @memberof yorkfs.dashboard.InverterData
             * @instance
             */
            InverterData.prototype.acMotorCurrent = 0;

            /**
             * InverterData dcBatteryCurrent.
             * @member {number} dcBatteryCurrent
             * @memberof yorkfs.dashboard.InverterData
             * @instance
             */
            InverterData.prototype.dcBatteryCurrent = 0;

            /**
             * InverterData controllerTemperature.
             * @member {number} controllerTemperature
             * @memberof yorkfs.dashboard.InverterData
             * @instance
             */
            InverterData.prototype.controllerTemperature = 0;

            /**
             * InverterData motorTemperature.
             * @member {number} motorTemperature
             * @memberof yorkfs.dashboard.InverterData
             * @instance
             */
            InverterData.prototype.motorTemperature = 0;

            /**
             * InverterData driveEnabled.
             * @member {boolean} driveEnabled
             * @memberof yorkfs.dashboard.InverterData
             * @instance
             */
            InverterData.prototype.driveEnabled = false;

            /**
             * InverterData limitStates.
             * @member {yorkfs.dashboard.InverterData.IInverterLimitStates|null|undefined} limitStates
             * @memberof yorkfs.dashboard.InverterData
             * @instance
             */
            InverterData.prototype.limitStates = null;

            /**
             * Creates a new InverterData instance using the specified properties.
             * @function create
             * @memberof yorkfs.dashboard.InverterData
             * @static
             * @param {yorkfs.dashboard.IInverterData=} [properties] Properties to set
             * @returns {yorkfs.dashboard.InverterData} InverterData instance
             */
            InverterData.create = function create(properties) {
                return new InverterData(properties);
            };

            /**
             * Encodes the specified InverterData message. Does not implicitly {@link yorkfs.dashboard.InverterData.verify|verify} messages.
             * @function encode
             * @memberof yorkfs.dashboard.InverterData
             * @static
             * @param {yorkfs.dashboard.IInverterData} message InverterData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            InverterData.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.faultCode != null && Object.hasOwnProperty.call(message, "faultCode"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.faultCode);
                if (message.erpm != null && Object.hasOwnProperty.call(message, "erpm"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.erpm);
                if (message.dutyCycle != null && Object.hasOwnProperty.call(message, "dutyCycle"))
                    writer.uint32(/* id 3, wireType 5 =*/29).float(message.dutyCycle);
                if (message.inputDcVoltage != null && Object.hasOwnProperty.call(message, "inputDcVoltage"))
                    writer.uint32(/* id 4, wireType 5 =*/37).float(message.inputDcVoltage);
                if (message.acMotorCurrent != null && Object.hasOwnProperty.call(message, "acMotorCurrent"))
                    writer.uint32(/* id 5, wireType 5 =*/45).float(message.acMotorCurrent);
                if (message.dcBatteryCurrent != null && Object.hasOwnProperty.call(message, "dcBatteryCurrent"))
                    writer.uint32(/* id 6, wireType 5 =*/53).float(message.dcBatteryCurrent);
                if (message.controllerTemperature != null && Object.hasOwnProperty.call(message, "controllerTemperature"))
                    writer.uint32(/* id 7, wireType 5 =*/61).float(message.controllerTemperature);
                if (message.motorTemperature != null && Object.hasOwnProperty.call(message, "motorTemperature"))
                    writer.uint32(/* id 8, wireType 5 =*/69).float(message.motorTemperature);
                if (message.driveEnabled != null && Object.hasOwnProperty.call(message, "driveEnabled"))
                    writer.uint32(/* id 9, wireType 0 =*/72).bool(message.driveEnabled);
                if (message.limitStates != null && Object.hasOwnProperty.call(message, "limitStates"))
                    $root.yorkfs.dashboard.InverterData.InverterLimitStates.encode(message.limitStates, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified InverterData message, length delimited. Does not implicitly {@link yorkfs.dashboard.InverterData.verify|verify} messages.
             * @function encodeDelimited
             * @memberof yorkfs.dashboard.InverterData
             * @static
             * @param {yorkfs.dashboard.IInverterData} message InverterData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            InverterData.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an InverterData message from the specified reader or buffer.
             * @function decode
             * @memberof yorkfs.dashboard.InverterData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {yorkfs.dashboard.InverterData} InverterData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            InverterData.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.yorkfs.dashboard.InverterData();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.faultCode = reader.int32();
                            break;
                        }
                    case 2: {
                            message.erpm = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.dutyCycle = reader.float();
                            break;
                        }
                    case 4: {
                            message.inputDcVoltage = reader.float();
                            break;
                        }
                    case 5: {
                            message.acMotorCurrent = reader.float();
                            break;
                        }
                    case 6: {
                            message.dcBatteryCurrent = reader.float();
                            break;
                        }
                    case 7: {
                            message.controllerTemperature = reader.float();
                            break;
                        }
                    case 8: {
                            message.motorTemperature = reader.float();
                            break;
                        }
                    case 9: {
                            message.driveEnabled = reader.bool();
                            break;
                        }
                    case 10: {
                            message.limitStates = $root.yorkfs.dashboard.InverterData.InverterLimitStates.decode(reader, reader.uint32());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an InverterData message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof yorkfs.dashboard.InverterData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {yorkfs.dashboard.InverterData} InverterData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            InverterData.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an InverterData message.
             * @function verify
             * @memberof yorkfs.dashboard.InverterData
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            InverterData.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.faultCode != null && message.hasOwnProperty("faultCode"))
                    switch (message.faultCode) {
                    default:
                        return "faultCode: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                    case 11:
                        break;
                    }
                if (message.erpm != null && message.hasOwnProperty("erpm"))
                    if (!$util.isInteger(message.erpm))
                        return "erpm: integer expected";
                if (message.dutyCycle != null && message.hasOwnProperty("dutyCycle"))
                    if (typeof message.dutyCycle !== "number")
                        return "dutyCycle: number expected";
                if (message.inputDcVoltage != null && message.hasOwnProperty("inputDcVoltage"))
                    if (typeof message.inputDcVoltage !== "number")
                        return "inputDcVoltage: number expected";
                if (message.acMotorCurrent != null && message.hasOwnProperty("acMotorCurrent"))
                    if (typeof message.acMotorCurrent !== "number")
                        return "acMotorCurrent: number expected";
                if (message.dcBatteryCurrent != null && message.hasOwnProperty("dcBatteryCurrent"))
                    if (typeof message.dcBatteryCurrent !== "number")
                        return "dcBatteryCurrent: number expected";
                if (message.controllerTemperature != null && message.hasOwnProperty("controllerTemperature"))
                    if (typeof message.controllerTemperature !== "number")
                        return "controllerTemperature: number expected";
                if (message.motorTemperature != null && message.hasOwnProperty("motorTemperature"))
                    if (typeof message.motorTemperature !== "number")
                        return "motorTemperature: number expected";
                if (message.driveEnabled != null && message.hasOwnProperty("driveEnabled"))
                    if (typeof message.driveEnabled !== "boolean")
                        return "driveEnabled: boolean expected";
                if (message.limitStates != null && message.hasOwnProperty("limitStates")) {
                    let error = $root.yorkfs.dashboard.InverterData.InverterLimitStates.verify(message.limitStates);
                    if (error)
                        return "limitStates." + error;
                }
                return null;
            };

            /**
             * Creates an InverterData message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof yorkfs.dashboard.InverterData
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {yorkfs.dashboard.InverterData} InverterData
             */
            InverterData.fromObject = function fromObject(object) {
                if (object instanceof $root.yorkfs.dashboard.InverterData)
                    return object;
                let message = new $root.yorkfs.dashboard.InverterData();
                switch (object.faultCode) {
                default:
                    if (typeof object.faultCode === "number") {
                        message.faultCode = object.faultCode;
                        break;
                    }
                    break;
                case "FAULT_CODE_UNSPECIFIED":
                case 0:
                    message.faultCode = 0;
                    break;
                case "FAULT_CODE_NO_FAULTS":
                case 1:
                    message.faultCode = 1;
                    break;
                case "FAULT_CODE_OVERVOLTAGE":
                case 2:
                    message.faultCode = 2;
                    break;
                case "FAULT_CODE_UNDERVOLTAGE":
                case 3:
                    message.faultCode = 3;
                    break;
                case "FAULT_CODE_DRIVE_ERROR":
                case 4:
                    message.faultCode = 4;
                    break;
                case "FAULT_CODE_OVERCURRENT":
                case 5:
                    message.faultCode = 5;
                    break;
                case "FAULT_CODE_CONTROLLER_OVERTEMPERATURE":
                case 6:
                    message.faultCode = 6;
                    break;
                case "FAULT_CODE_MOTOR_OVERTEMPERATURE":
                case 7:
                    message.faultCode = 7;
                    break;
                case "FAULT_CODE_SENSOR_WIRE_FAULT":
                case 8:
                    message.faultCode = 8;
                    break;
                case "FAULT_CODE_SENSOR_GENERAL_FAULT":
                case 9:
                    message.faultCode = 9;
                    break;
                case "FAULT_CODE_CAN_ERROR":
                case 10:
                    message.faultCode = 10;
                    break;
                case "FAULT_CODE_ANALOG_INPUT_ERROR":
                case 11:
                    message.faultCode = 11;
                    break;
                }
                if (object.erpm != null)
                    message.erpm = object.erpm >>> 0;
                if (object.dutyCycle != null)
                    message.dutyCycle = Number(object.dutyCycle);
                if (object.inputDcVoltage != null)
                    message.inputDcVoltage = Number(object.inputDcVoltage);
                if (object.acMotorCurrent != null)
                    message.acMotorCurrent = Number(object.acMotorCurrent);
                if (object.dcBatteryCurrent != null)
                    message.dcBatteryCurrent = Number(object.dcBatteryCurrent);
                if (object.controllerTemperature != null)
                    message.controllerTemperature = Number(object.controllerTemperature);
                if (object.motorTemperature != null)
                    message.motorTemperature = Number(object.motorTemperature);
                if (object.driveEnabled != null)
                    message.driveEnabled = Boolean(object.driveEnabled);
                if (object.limitStates != null) {
                    if (typeof object.limitStates !== "object")
                        throw TypeError(".yorkfs.dashboard.InverterData.limitStates: object expected");
                    message.limitStates = $root.yorkfs.dashboard.InverterData.InverterLimitStates.fromObject(object.limitStates);
                }
                return message;
            };

            /**
             * Creates a plain object from an InverterData message. Also converts values to other types if specified.
             * @function toObject
             * @memberof yorkfs.dashboard.InverterData
             * @static
             * @param {yorkfs.dashboard.InverterData} message InverterData
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            InverterData.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.faultCode = options.enums === String ? "FAULT_CODE_UNSPECIFIED" : 0;
                    object.erpm = 0;
                    object.dutyCycle = 0;
                    object.inputDcVoltage = 0;
                    object.acMotorCurrent = 0;
                    object.dcBatteryCurrent = 0;
                    object.controllerTemperature = 0;
                    object.motorTemperature = 0;
                    object.driveEnabled = false;
                    object.limitStates = null;
                }
                if (message.faultCode != null && message.hasOwnProperty("faultCode"))
                    object.faultCode = options.enums === String ? $root.yorkfs.dashboard.InverterData.FaultCode[message.faultCode] === undefined ? message.faultCode : $root.yorkfs.dashboard.InverterData.FaultCode[message.faultCode] : message.faultCode;
                if (message.erpm != null && message.hasOwnProperty("erpm"))
                    object.erpm = message.erpm;
                if (message.dutyCycle != null && message.hasOwnProperty("dutyCycle"))
                    object.dutyCycle = options.json && !isFinite(message.dutyCycle) ? String(message.dutyCycle) : message.dutyCycle;
                if (message.inputDcVoltage != null && message.hasOwnProperty("inputDcVoltage"))
                    object.inputDcVoltage = options.json && !isFinite(message.inputDcVoltage) ? String(message.inputDcVoltage) : message.inputDcVoltage;
                if (message.acMotorCurrent != null && message.hasOwnProperty("acMotorCurrent"))
                    object.acMotorCurrent = options.json && !isFinite(message.acMotorCurrent) ? String(message.acMotorCurrent) : message.acMotorCurrent;
                if (message.dcBatteryCurrent != null && message.hasOwnProperty("dcBatteryCurrent"))
                    object.dcBatteryCurrent = options.json && !isFinite(message.dcBatteryCurrent) ? String(message.dcBatteryCurrent) : message.dcBatteryCurrent;
                if (message.controllerTemperature != null && message.hasOwnProperty("controllerTemperature"))
                    object.controllerTemperature = options.json && !isFinite(message.controllerTemperature) ? String(message.controllerTemperature) : message.controllerTemperature;
                if (message.motorTemperature != null && message.hasOwnProperty("motorTemperature"))
                    object.motorTemperature = options.json && !isFinite(message.motorTemperature) ? String(message.motorTemperature) : message.motorTemperature;
                if (message.driveEnabled != null && message.hasOwnProperty("driveEnabled"))
                    object.driveEnabled = message.driveEnabled;
                if (message.limitStates != null && message.hasOwnProperty("limitStates"))
                    object.limitStates = $root.yorkfs.dashboard.InverterData.InverterLimitStates.toObject(message.limitStates, options);
                return object;
            };

            /**
             * Converts this InverterData to JSON.
             * @function toJSON
             * @memberof yorkfs.dashboard.InverterData
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            InverterData.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for InverterData
             * @function getTypeUrl
             * @memberof yorkfs.dashboard.InverterData
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            InverterData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/yorkfs.dashboard.InverterData";
            };

            /**
             * FaultCode enum.
             * @name yorkfs.dashboard.InverterData.FaultCode
             * @enum {number}
             * @property {number} FAULT_CODE_UNSPECIFIED=0 FAULT_CODE_UNSPECIFIED value
             * @property {number} FAULT_CODE_NO_FAULTS=1 FAULT_CODE_NO_FAULTS value
             * @property {number} FAULT_CODE_OVERVOLTAGE=2 FAULT_CODE_OVERVOLTAGE value
             * @property {number} FAULT_CODE_UNDERVOLTAGE=3 FAULT_CODE_UNDERVOLTAGE value
             * @property {number} FAULT_CODE_DRIVE_ERROR=4 FAULT_CODE_DRIVE_ERROR value
             * @property {number} FAULT_CODE_OVERCURRENT=5 FAULT_CODE_OVERCURRENT value
             * @property {number} FAULT_CODE_CONTROLLER_OVERTEMPERATURE=6 FAULT_CODE_CONTROLLER_OVERTEMPERATURE value
             * @property {number} FAULT_CODE_MOTOR_OVERTEMPERATURE=7 FAULT_CODE_MOTOR_OVERTEMPERATURE value
             * @property {number} FAULT_CODE_SENSOR_WIRE_FAULT=8 FAULT_CODE_SENSOR_WIRE_FAULT value
             * @property {number} FAULT_CODE_SENSOR_GENERAL_FAULT=9 FAULT_CODE_SENSOR_GENERAL_FAULT value
             * @property {number} FAULT_CODE_CAN_ERROR=10 FAULT_CODE_CAN_ERROR value
             * @property {number} FAULT_CODE_ANALOG_INPUT_ERROR=11 FAULT_CODE_ANALOG_INPUT_ERROR value
             */
            InverterData.FaultCode = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "FAULT_CODE_UNSPECIFIED"] = 0;
                values[valuesById[1] = "FAULT_CODE_NO_FAULTS"] = 1;
                values[valuesById[2] = "FAULT_CODE_OVERVOLTAGE"] = 2;
                values[valuesById[3] = "FAULT_CODE_UNDERVOLTAGE"] = 3;
                values[valuesById[4] = "FAULT_CODE_DRIVE_ERROR"] = 4;
                values[valuesById[5] = "FAULT_CODE_OVERCURRENT"] = 5;
                values[valuesById[6] = "FAULT_CODE_CONTROLLER_OVERTEMPERATURE"] = 6;
                values[valuesById[7] = "FAULT_CODE_MOTOR_OVERTEMPERATURE"] = 7;
                values[valuesById[8] = "FAULT_CODE_SENSOR_WIRE_FAULT"] = 8;
                values[valuesById[9] = "FAULT_CODE_SENSOR_GENERAL_FAULT"] = 9;
                values[valuesById[10] = "FAULT_CODE_CAN_ERROR"] = 10;
                values[valuesById[11] = "FAULT_CODE_ANALOG_INPUT_ERROR"] = 11;
                return values;
            })();

            InverterData.InverterLimitStates = (function() {

                /**
                 * Properties of an InverterLimitStates.
                 * @memberof yorkfs.dashboard.InverterData
                 * @interface IInverterLimitStates
                 * @property {boolean|null} [capacitorTemperature] InverterLimitStates capacitorTemperature
                 * @property {boolean|null} [dcCurrentLimit] InverterLimitStates dcCurrentLimit
                 * @property {boolean|null} [driveEnableLimit] InverterLimitStates driveEnableLimit
                 * @property {boolean|null} [igbtAccelerationLimit] InverterLimitStates igbtAccelerationLimit
                 * @property {boolean|null} [igbtTemperatureLimit] InverterLimitStates igbtTemperatureLimit
                 * @property {boolean|null} [inputVoltageLimit] InverterLimitStates inputVoltageLimit
                 * @property {boolean|null} [motorAccelerationTemperatureLimit] InverterLimitStates motorAccelerationTemperatureLimit
                 * @property {boolean|null} [motorTemperatureLimit] InverterLimitStates motorTemperatureLimit
                 * @property {boolean|null} [rpmMinimumLimit] InverterLimitStates rpmMinimumLimit
                 * @property {boolean|null} [rpmMaximumLimit] InverterLimitStates rpmMaximumLimit
                 * @property {boolean|null} [powerLimit] InverterLimitStates powerLimit
                 */

                /**
                 * Constructs a new InverterLimitStates.
                 * @memberof yorkfs.dashboard.InverterData
                 * @classdesc Represents an InverterLimitStates.
                 * @implements IInverterLimitStates
                 * @constructor
                 * @param {yorkfs.dashboard.InverterData.IInverterLimitStates=} [properties] Properties to set
                 */
                function InverterLimitStates(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * InverterLimitStates capacitorTemperature.
                 * @member {boolean} capacitorTemperature
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @instance
                 */
                InverterLimitStates.prototype.capacitorTemperature = false;

                /**
                 * InverterLimitStates dcCurrentLimit.
                 * @member {boolean} dcCurrentLimit
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @instance
                 */
                InverterLimitStates.prototype.dcCurrentLimit = false;

                /**
                 * InverterLimitStates driveEnableLimit.
                 * @member {boolean} driveEnableLimit
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @instance
                 */
                InverterLimitStates.prototype.driveEnableLimit = false;

                /**
                 * InverterLimitStates igbtAccelerationLimit.
                 * @member {boolean} igbtAccelerationLimit
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @instance
                 */
                InverterLimitStates.prototype.igbtAccelerationLimit = false;

                /**
                 * InverterLimitStates igbtTemperatureLimit.
                 * @member {boolean} igbtTemperatureLimit
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @instance
                 */
                InverterLimitStates.prototype.igbtTemperatureLimit = false;

                /**
                 * InverterLimitStates inputVoltageLimit.
                 * @member {boolean} inputVoltageLimit
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @instance
                 */
                InverterLimitStates.prototype.inputVoltageLimit = false;

                /**
                 * InverterLimitStates motorAccelerationTemperatureLimit.
                 * @member {boolean} motorAccelerationTemperatureLimit
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @instance
                 */
                InverterLimitStates.prototype.motorAccelerationTemperatureLimit = false;

                /**
                 * InverterLimitStates motorTemperatureLimit.
                 * @member {boolean} motorTemperatureLimit
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @instance
                 */
                InverterLimitStates.prototype.motorTemperatureLimit = false;

                /**
                 * InverterLimitStates rpmMinimumLimit.
                 * @member {boolean} rpmMinimumLimit
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @instance
                 */
                InverterLimitStates.prototype.rpmMinimumLimit = false;

                /**
                 * InverterLimitStates rpmMaximumLimit.
                 * @member {boolean} rpmMaximumLimit
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @instance
                 */
                InverterLimitStates.prototype.rpmMaximumLimit = false;

                /**
                 * InverterLimitStates powerLimit.
                 * @member {boolean} powerLimit
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @instance
                 */
                InverterLimitStates.prototype.powerLimit = false;

                /**
                 * Creates a new InverterLimitStates instance using the specified properties.
                 * @function create
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @static
                 * @param {yorkfs.dashboard.InverterData.IInverterLimitStates=} [properties] Properties to set
                 * @returns {yorkfs.dashboard.InverterData.InverterLimitStates} InverterLimitStates instance
                 */
                InverterLimitStates.create = function create(properties) {
                    return new InverterLimitStates(properties);
                };

                /**
                 * Encodes the specified InverterLimitStates message. Does not implicitly {@link yorkfs.dashboard.InverterData.InverterLimitStates.verify|verify} messages.
                 * @function encode
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @static
                 * @param {yorkfs.dashboard.InverterData.IInverterLimitStates} message InverterLimitStates message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                InverterLimitStates.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.capacitorTemperature != null && Object.hasOwnProperty.call(message, "capacitorTemperature"))
                        writer.uint32(/* id 1, wireType 0 =*/8).bool(message.capacitorTemperature);
                    if (message.dcCurrentLimit != null && Object.hasOwnProperty.call(message, "dcCurrentLimit"))
                        writer.uint32(/* id 2, wireType 0 =*/16).bool(message.dcCurrentLimit);
                    if (message.driveEnableLimit != null && Object.hasOwnProperty.call(message, "driveEnableLimit"))
                        writer.uint32(/* id 3, wireType 0 =*/24).bool(message.driveEnableLimit);
                    if (message.igbtAccelerationLimit != null && Object.hasOwnProperty.call(message, "igbtAccelerationLimit"))
                        writer.uint32(/* id 4, wireType 0 =*/32).bool(message.igbtAccelerationLimit);
                    if (message.igbtTemperatureLimit != null && Object.hasOwnProperty.call(message, "igbtTemperatureLimit"))
                        writer.uint32(/* id 5, wireType 0 =*/40).bool(message.igbtTemperatureLimit);
                    if (message.inputVoltageLimit != null && Object.hasOwnProperty.call(message, "inputVoltageLimit"))
                        writer.uint32(/* id 6, wireType 0 =*/48).bool(message.inputVoltageLimit);
                    if (message.motorAccelerationTemperatureLimit != null && Object.hasOwnProperty.call(message, "motorAccelerationTemperatureLimit"))
                        writer.uint32(/* id 7, wireType 0 =*/56).bool(message.motorAccelerationTemperatureLimit);
                    if (message.motorTemperatureLimit != null && Object.hasOwnProperty.call(message, "motorTemperatureLimit"))
                        writer.uint32(/* id 8, wireType 0 =*/64).bool(message.motorTemperatureLimit);
                    if (message.rpmMinimumLimit != null && Object.hasOwnProperty.call(message, "rpmMinimumLimit"))
                        writer.uint32(/* id 9, wireType 0 =*/72).bool(message.rpmMinimumLimit);
                    if (message.rpmMaximumLimit != null && Object.hasOwnProperty.call(message, "rpmMaximumLimit"))
                        writer.uint32(/* id 10, wireType 0 =*/80).bool(message.rpmMaximumLimit);
                    if (message.powerLimit != null && Object.hasOwnProperty.call(message, "powerLimit"))
                        writer.uint32(/* id 11, wireType 0 =*/88).bool(message.powerLimit);
                    return writer;
                };

                /**
                 * Encodes the specified InverterLimitStates message, length delimited. Does not implicitly {@link yorkfs.dashboard.InverterData.InverterLimitStates.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @static
                 * @param {yorkfs.dashboard.InverterData.IInverterLimitStates} message InverterLimitStates message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                InverterLimitStates.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an InverterLimitStates message from the specified reader or buffer.
                 * @function decode
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {yorkfs.dashboard.InverterData.InverterLimitStates} InverterLimitStates
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                InverterLimitStates.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.yorkfs.dashboard.InverterData.InverterLimitStates();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.capacitorTemperature = reader.bool();
                                break;
                            }
                        case 2: {
                                message.dcCurrentLimit = reader.bool();
                                break;
                            }
                        case 3: {
                                message.driveEnableLimit = reader.bool();
                                break;
                            }
                        case 4: {
                                message.igbtAccelerationLimit = reader.bool();
                                break;
                            }
                        case 5: {
                                message.igbtTemperatureLimit = reader.bool();
                                break;
                            }
                        case 6: {
                                message.inputVoltageLimit = reader.bool();
                                break;
                            }
                        case 7: {
                                message.motorAccelerationTemperatureLimit = reader.bool();
                                break;
                            }
                        case 8: {
                                message.motorTemperatureLimit = reader.bool();
                                break;
                            }
                        case 9: {
                                message.rpmMinimumLimit = reader.bool();
                                break;
                            }
                        case 10: {
                                message.rpmMaximumLimit = reader.bool();
                                break;
                            }
                        case 11: {
                                message.powerLimit = reader.bool();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an InverterLimitStates message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {yorkfs.dashboard.InverterData.InverterLimitStates} InverterLimitStates
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                InverterLimitStates.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an InverterLimitStates message.
                 * @function verify
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                InverterLimitStates.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.capacitorTemperature != null && message.hasOwnProperty("capacitorTemperature"))
                        if (typeof message.capacitorTemperature !== "boolean")
                            return "capacitorTemperature: boolean expected";
                    if (message.dcCurrentLimit != null && message.hasOwnProperty("dcCurrentLimit"))
                        if (typeof message.dcCurrentLimit !== "boolean")
                            return "dcCurrentLimit: boolean expected";
                    if (message.driveEnableLimit != null && message.hasOwnProperty("driveEnableLimit"))
                        if (typeof message.driveEnableLimit !== "boolean")
                            return "driveEnableLimit: boolean expected";
                    if (message.igbtAccelerationLimit != null && message.hasOwnProperty("igbtAccelerationLimit"))
                        if (typeof message.igbtAccelerationLimit !== "boolean")
                            return "igbtAccelerationLimit: boolean expected";
                    if (message.igbtTemperatureLimit != null && message.hasOwnProperty("igbtTemperatureLimit"))
                        if (typeof message.igbtTemperatureLimit !== "boolean")
                            return "igbtTemperatureLimit: boolean expected";
                    if (message.inputVoltageLimit != null && message.hasOwnProperty("inputVoltageLimit"))
                        if (typeof message.inputVoltageLimit !== "boolean")
                            return "inputVoltageLimit: boolean expected";
                    if (message.motorAccelerationTemperatureLimit != null && message.hasOwnProperty("motorAccelerationTemperatureLimit"))
                        if (typeof message.motorAccelerationTemperatureLimit !== "boolean")
                            return "motorAccelerationTemperatureLimit: boolean expected";
                    if (message.motorTemperatureLimit != null && message.hasOwnProperty("motorTemperatureLimit"))
                        if (typeof message.motorTemperatureLimit !== "boolean")
                            return "motorTemperatureLimit: boolean expected";
                    if (message.rpmMinimumLimit != null && message.hasOwnProperty("rpmMinimumLimit"))
                        if (typeof message.rpmMinimumLimit !== "boolean")
                            return "rpmMinimumLimit: boolean expected";
                    if (message.rpmMaximumLimit != null && message.hasOwnProperty("rpmMaximumLimit"))
                        if (typeof message.rpmMaximumLimit !== "boolean")
                            return "rpmMaximumLimit: boolean expected";
                    if (message.powerLimit != null && message.hasOwnProperty("powerLimit"))
                        if (typeof message.powerLimit !== "boolean")
                            return "powerLimit: boolean expected";
                    return null;
                };

                /**
                 * Creates an InverterLimitStates message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {yorkfs.dashboard.InverterData.InverterLimitStates} InverterLimitStates
                 */
                InverterLimitStates.fromObject = function fromObject(object) {
                    if (object instanceof $root.yorkfs.dashboard.InverterData.InverterLimitStates)
                        return object;
                    let message = new $root.yorkfs.dashboard.InverterData.InverterLimitStates();
                    if (object.capacitorTemperature != null)
                        message.capacitorTemperature = Boolean(object.capacitorTemperature);
                    if (object.dcCurrentLimit != null)
                        message.dcCurrentLimit = Boolean(object.dcCurrentLimit);
                    if (object.driveEnableLimit != null)
                        message.driveEnableLimit = Boolean(object.driveEnableLimit);
                    if (object.igbtAccelerationLimit != null)
                        message.igbtAccelerationLimit = Boolean(object.igbtAccelerationLimit);
                    if (object.igbtTemperatureLimit != null)
                        message.igbtTemperatureLimit = Boolean(object.igbtTemperatureLimit);
                    if (object.inputVoltageLimit != null)
                        message.inputVoltageLimit = Boolean(object.inputVoltageLimit);
                    if (object.motorAccelerationTemperatureLimit != null)
                        message.motorAccelerationTemperatureLimit = Boolean(object.motorAccelerationTemperatureLimit);
                    if (object.motorTemperatureLimit != null)
                        message.motorTemperatureLimit = Boolean(object.motorTemperatureLimit);
                    if (object.rpmMinimumLimit != null)
                        message.rpmMinimumLimit = Boolean(object.rpmMinimumLimit);
                    if (object.rpmMaximumLimit != null)
                        message.rpmMaximumLimit = Boolean(object.rpmMaximumLimit);
                    if (object.powerLimit != null)
                        message.powerLimit = Boolean(object.powerLimit);
                    return message;
                };

                /**
                 * Creates a plain object from an InverterLimitStates message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @static
                 * @param {yorkfs.dashboard.InverterData.InverterLimitStates} message InverterLimitStates
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                InverterLimitStates.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults) {
                        object.capacitorTemperature = false;
                        object.dcCurrentLimit = false;
                        object.driveEnableLimit = false;
                        object.igbtAccelerationLimit = false;
                        object.igbtTemperatureLimit = false;
                        object.inputVoltageLimit = false;
                        object.motorAccelerationTemperatureLimit = false;
                        object.motorTemperatureLimit = false;
                        object.rpmMinimumLimit = false;
                        object.rpmMaximumLimit = false;
                        object.powerLimit = false;
                    }
                    if (message.capacitorTemperature != null && message.hasOwnProperty("capacitorTemperature"))
                        object.capacitorTemperature = message.capacitorTemperature;
                    if (message.dcCurrentLimit != null && message.hasOwnProperty("dcCurrentLimit"))
                        object.dcCurrentLimit = message.dcCurrentLimit;
                    if (message.driveEnableLimit != null && message.hasOwnProperty("driveEnableLimit"))
                        object.driveEnableLimit = message.driveEnableLimit;
                    if (message.igbtAccelerationLimit != null && message.hasOwnProperty("igbtAccelerationLimit"))
                        object.igbtAccelerationLimit = message.igbtAccelerationLimit;
                    if (message.igbtTemperatureLimit != null && message.hasOwnProperty("igbtTemperatureLimit"))
                        object.igbtTemperatureLimit = message.igbtTemperatureLimit;
                    if (message.inputVoltageLimit != null && message.hasOwnProperty("inputVoltageLimit"))
                        object.inputVoltageLimit = message.inputVoltageLimit;
                    if (message.motorAccelerationTemperatureLimit != null && message.hasOwnProperty("motorAccelerationTemperatureLimit"))
                        object.motorAccelerationTemperatureLimit = message.motorAccelerationTemperatureLimit;
                    if (message.motorTemperatureLimit != null && message.hasOwnProperty("motorTemperatureLimit"))
                        object.motorTemperatureLimit = message.motorTemperatureLimit;
                    if (message.rpmMinimumLimit != null && message.hasOwnProperty("rpmMinimumLimit"))
                        object.rpmMinimumLimit = message.rpmMinimumLimit;
                    if (message.rpmMaximumLimit != null && message.hasOwnProperty("rpmMaximumLimit"))
                        object.rpmMaximumLimit = message.rpmMaximumLimit;
                    if (message.powerLimit != null && message.hasOwnProperty("powerLimit"))
                        object.powerLimit = message.powerLimit;
                    return object;
                };

                /**
                 * Converts this InverterLimitStates to JSON.
                 * @function toJSON
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                InverterLimitStates.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for InverterLimitStates
                 * @function getTypeUrl
                 * @memberof yorkfs.dashboard.InverterData.InverterLimitStates
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                InverterLimitStates.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/yorkfs.dashboard.InverterData.InverterLimitStates";
                };

                return InverterLimitStates;
            })();

            return InverterData;
        })();

        dashboard.TelemetryPacket = (function() {

            /**
             * Properties of a TelemetryPacket.
             * @memberof yorkfs.dashboard
             * @interface ITelemetryPacket
             * @property {yorkfs.dashboard.TelemetryPacket.DataType|null} [type] TelemetryPacket type
             * @property {number|Long|null} [timestampMs] TelemetryPacket timestampMs
             * @property {yorkfs.dashboard.IAPPSData|null} [appsData] TelemetryPacket appsData
             * @property {yorkfs.dashboard.IBMSData|null} [bmsData] TelemetryPacket bmsData
             * @property {yorkfs.dashboard.IInverterData|null} [inverterData] TelemetryPacket inverterData
             */

            /**
             * Constructs a new TelemetryPacket.
             * @memberof yorkfs.dashboard
             * @classdesc Represents a TelemetryPacket.
             * @implements ITelemetryPacket
             * @constructor
             * @param {yorkfs.dashboard.ITelemetryPacket=} [properties] Properties to set
             */
            function TelemetryPacket(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * TelemetryPacket type.
             * @member {yorkfs.dashboard.TelemetryPacket.DataType} type
             * @memberof yorkfs.dashboard.TelemetryPacket
             * @instance
             */
            TelemetryPacket.prototype.type = 0;

            /**
             * TelemetryPacket timestampMs.
             * @member {number|Long} timestampMs
             * @memberof yorkfs.dashboard.TelemetryPacket
             * @instance
             */
            TelemetryPacket.prototype.timestampMs = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * TelemetryPacket appsData.
             * @member {yorkfs.dashboard.IAPPSData|null|undefined} appsData
             * @memberof yorkfs.dashboard.TelemetryPacket
             * @instance
             */
            TelemetryPacket.prototype.appsData = null;

            /**
             * TelemetryPacket bmsData.
             * @member {yorkfs.dashboard.IBMSData|null|undefined} bmsData
             * @memberof yorkfs.dashboard.TelemetryPacket
             * @instance
             */
            TelemetryPacket.prototype.bmsData = null;

            /**
             * TelemetryPacket inverterData.
             * @member {yorkfs.dashboard.IInverterData|null|undefined} inverterData
             * @memberof yorkfs.dashboard.TelemetryPacket
             * @instance
             */
            TelemetryPacket.prototype.inverterData = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * TelemetryPacket payload.
             * @member {"appsData"|"bmsData"|"inverterData"|undefined} payload
             * @memberof yorkfs.dashboard.TelemetryPacket
             * @instance
             */
            Object.defineProperty(TelemetryPacket.prototype, "payload", {
                get: $util.oneOfGetter($oneOfFields = ["appsData", "bmsData", "inverterData"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new TelemetryPacket instance using the specified properties.
             * @function create
             * @memberof yorkfs.dashboard.TelemetryPacket
             * @static
             * @param {yorkfs.dashboard.ITelemetryPacket=} [properties] Properties to set
             * @returns {yorkfs.dashboard.TelemetryPacket} TelemetryPacket instance
             */
            TelemetryPacket.create = function create(properties) {
                return new TelemetryPacket(properties);
            };

            /**
             * Encodes the specified TelemetryPacket message. Does not implicitly {@link yorkfs.dashboard.TelemetryPacket.verify|verify} messages.
             * @function encode
             * @memberof yorkfs.dashboard.TelemetryPacket
             * @static
             * @param {yorkfs.dashboard.ITelemetryPacket} message TelemetryPacket message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TelemetryPacket.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                if (message.timestampMs != null && Object.hasOwnProperty.call(message, "timestampMs"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.timestampMs);
                if (message.appsData != null && Object.hasOwnProperty.call(message, "appsData"))
                    $root.yorkfs.dashboard.APPSData.encode(message.appsData, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.bmsData != null && Object.hasOwnProperty.call(message, "bmsData"))
                    $root.yorkfs.dashboard.BMSData.encode(message.bmsData, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.inverterData != null && Object.hasOwnProperty.call(message, "inverterData"))
                    $root.yorkfs.dashboard.InverterData.encode(message.inverterData, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified TelemetryPacket message, length delimited. Does not implicitly {@link yorkfs.dashboard.TelemetryPacket.verify|verify} messages.
             * @function encodeDelimited
             * @memberof yorkfs.dashboard.TelemetryPacket
             * @static
             * @param {yorkfs.dashboard.ITelemetryPacket} message TelemetryPacket message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TelemetryPacket.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a TelemetryPacket message from the specified reader or buffer.
             * @function decode
             * @memberof yorkfs.dashboard.TelemetryPacket
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {yorkfs.dashboard.TelemetryPacket} TelemetryPacket
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TelemetryPacket.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.yorkfs.dashboard.TelemetryPacket();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.type = reader.int32();
                            break;
                        }
                    case 2: {
                            message.timestampMs = reader.uint64();
                            break;
                        }
                    case 3: {
                            message.appsData = $root.yorkfs.dashboard.APPSData.decode(reader, reader.uint32());
                            break;
                        }
                    case 4: {
                            message.bmsData = $root.yorkfs.dashboard.BMSData.decode(reader, reader.uint32());
                            break;
                        }
                    case 5: {
                            message.inverterData = $root.yorkfs.dashboard.InverterData.decode(reader, reader.uint32());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a TelemetryPacket message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof yorkfs.dashboard.TelemetryPacket
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {yorkfs.dashboard.TelemetryPacket} TelemetryPacket
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TelemetryPacket.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a TelemetryPacket message.
             * @function verify
             * @memberof yorkfs.dashboard.TelemetryPacket
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TelemetryPacket.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        break;
                    }
                if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                    if (!$util.isInteger(message.timestampMs) && !(message.timestampMs && $util.isInteger(message.timestampMs.low) && $util.isInteger(message.timestampMs.high)))
                        return "timestampMs: integer|Long expected";
                if (message.appsData != null && message.hasOwnProperty("appsData")) {
                    properties.payload = 1;
                    {
                        let error = $root.yorkfs.dashboard.APPSData.verify(message.appsData);
                        if (error)
                            return "appsData." + error;
                    }
                }
                if (message.bmsData != null && message.hasOwnProperty("bmsData")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.yorkfs.dashboard.BMSData.verify(message.bmsData);
                        if (error)
                            return "bmsData." + error;
                    }
                }
                if (message.inverterData != null && message.hasOwnProperty("inverterData")) {
                    if (properties.payload === 1)
                        return "payload: multiple values";
                    properties.payload = 1;
                    {
                        let error = $root.yorkfs.dashboard.InverterData.verify(message.inverterData);
                        if (error)
                            return "inverterData." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a TelemetryPacket message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof yorkfs.dashboard.TelemetryPacket
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {yorkfs.dashboard.TelemetryPacket} TelemetryPacket
             */
            TelemetryPacket.fromObject = function fromObject(object) {
                if (object instanceof $root.yorkfs.dashboard.TelemetryPacket)
                    return object;
                let message = new $root.yorkfs.dashboard.TelemetryPacket();
                switch (object.type) {
                default:
                    if (typeof object.type === "number") {
                        message.type = object.type;
                        break;
                    }
                    break;
                case "DATA_TYPE_UNSPECIFIED":
                case 0:
                    message.type = 0;
                    break;
                case "DATA_TYPE_APPS":
                case 1:
                    message.type = 1;
                    break;
                case "DATA_TYPE_BMS":
                case 2:
                    message.type = 2;
                    break;
                case "DATA_TYPE_INVERTER":
                case 3:
                    message.type = 3;
                    break;
                }
                if (object.timestampMs != null)
                    if ($util.Long)
                        (message.timestampMs = $util.Long.fromValue(object.timestampMs)).unsigned = true;
                    else if (typeof object.timestampMs === "string")
                        message.timestampMs = parseInt(object.timestampMs, 10);
                    else if (typeof object.timestampMs === "number")
                        message.timestampMs = object.timestampMs;
                    else if (typeof object.timestampMs === "object")
                        message.timestampMs = new $util.LongBits(object.timestampMs.low >>> 0, object.timestampMs.high >>> 0).toNumber(true);
                if (object.appsData != null) {
                    if (typeof object.appsData !== "object")
                        throw TypeError(".yorkfs.dashboard.TelemetryPacket.appsData: object expected");
                    message.appsData = $root.yorkfs.dashboard.APPSData.fromObject(object.appsData);
                }
                if (object.bmsData != null) {
                    if (typeof object.bmsData !== "object")
                        throw TypeError(".yorkfs.dashboard.TelemetryPacket.bmsData: object expected");
                    message.bmsData = $root.yorkfs.dashboard.BMSData.fromObject(object.bmsData);
                }
                if (object.inverterData != null) {
                    if (typeof object.inverterData !== "object")
                        throw TypeError(".yorkfs.dashboard.TelemetryPacket.inverterData: object expected");
                    message.inverterData = $root.yorkfs.dashboard.InverterData.fromObject(object.inverterData);
                }
                return message;
            };

            /**
             * Creates a plain object from a TelemetryPacket message. Also converts values to other types if specified.
             * @function toObject
             * @memberof yorkfs.dashboard.TelemetryPacket
             * @static
             * @param {yorkfs.dashboard.TelemetryPacket} message TelemetryPacket
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TelemetryPacket.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.type = options.enums === String ? "DATA_TYPE_UNSPECIFIED" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.timestampMs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.timestampMs = options.longs === String ? "0" : 0;
                }
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.yorkfs.dashboard.TelemetryPacket.DataType[message.type] === undefined ? message.type : $root.yorkfs.dashboard.TelemetryPacket.DataType[message.type] : message.type;
                if (message.timestampMs != null && message.hasOwnProperty("timestampMs"))
                    if (typeof message.timestampMs === "number")
                        object.timestampMs = options.longs === String ? String(message.timestampMs) : message.timestampMs;
                    else
                        object.timestampMs = options.longs === String ? $util.Long.prototype.toString.call(message.timestampMs) : options.longs === Number ? new $util.LongBits(message.timestampMs.low >>> 0, message.timestampMs.high >>> 0).toNumber(true) : message.timestampMs;
                if (message.appsData != null && message.hasOwnProperty("appsData")) {
                    object.appsData = $root.yorkfs.dashboard.APPSData.toObject(message.appsData, options);
                    if (options.oneofs)
                        object.payload = "appsData";
                }
                if (message.bmsData != null && message.hasOwnProperty("bmsData")) {
                    object.bmsData = $root.yorkfs.dashboard.BMSData.toObject(message.bmsData, options);
                    if (options.oneofs)
                        object.payload = "bmsData";
                }
                if (message.inverterData != null && message.hasOwnProperty("inverterData")) {
                    object.inverterData = $root.yorkfs.dashboard.InverterData.toObject(message.inverterData, options);
                    if (options.oneofs)
                        object.payload = "inverterData";
                }
                return object;
            };

            /**
             * Converts this TelemetryPacket to JSON.
             * @function toJSON
             * @memberof yorkfs.dashboard.TelemetryPacket
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TelemetryPacket.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for TelemetryPacket
             * @function getTypeUrl
             * @memberof yorkfs.dashboard.TelemetryPacket
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            TelemetryPacket.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/yorkfs.dashboard.TelemetryPacket";
            };

            /**
             * DataType enum.
             * @name yorkfs.dashboard.TelemetryPacket.DataType
             * @enum {number}
             * @property {number} DATA_TYPE_UNSPECIFIED=0 DATA_TYPE_UNSPECIFIED value
             * @property {number} DATA_TYPE_APPS=1 DATA_TYPE_APPS value
             * @property {number} DATA_TYPE_BMS=2 DATA_TYPE_BMS value
             * @property {number} DATA_TYPE_INVERTER=3 DATA_TYPE_INVERTER value
             */
            TelemetryPacket.DataType = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "DATA_TYPE_UNSPECIFIED"] = 0;
                values[valuesById[1] = "DATA_TYPE_APPS"] = 1;
                values[valuesById[2] = "DATA_TYPE_BMS"] = 2;
                values[valuesById[3] = "DATA_TYPE_INVERTER"] = 3;
                return values;
            })();

            return TelemetryPacket;
        })();

        dashboard.CANMessage = (function() {

            /**
             * Properties of a CANMessage.
             * @memberof yorkfs.dashboard
             * @interface ICANMessage
             * @property {number|null} [id] CANMessage id
             * @property {Uint8Array|null} [data] CANMessage data
             * @property {boolean|null} [isExtendedId] CANMessage isExtendedId
             * @property {boolean|null} [isRtr] CANMessage isRtr
             */

            /**
             * Constructs a new CANMessage.
             * @memberof yorkfs.dashboard
             * @classdesc Represents a CANMessage.
             * @implements ICANMessage
             * @constructor
             * @param {yorkfs.dashboard.ICANMessage=} [properties] Properties to set
             */
            function CANMessage(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CANMessage id.
             * @member {number} id
             * @memberof yorkfs.dashboard.CANMessage
             * @instance
             */
            CANMessage.prototype.id = 0;

            /**
             * CANMessage data.
             * @member {Uint8Array} data
             * @memberof yorkfs.dashboard.CANMessage
             * @instance
             */
            CANMessage.prototype.data = $util.newBuffer([]);

            /**
             * CANMessage isExtendedId.
             * @member {boolean} isExtendedId
             * @memberof yorkfs.dashboard.CANMessage
             * @instance
             */
            CANMessage.prototype.isExtendedId = false;

            /**
             * CANMessage isRtr.
             * @member {boolean} isRtr
             * @memberof yorkfs.dashboard.CANMessage
             * @instance
             */
            CANMessage.prototype.isRtr = false;

            /**
             * Creates a new CANMessage instance using the specified properties.
             * @function create
             * @memberof yorkfs.dashboard.CANMessage
             * @static
             * @param {yorkfs.dashboard.ICANMessage=} [properties] Properties to set
             * @returns {yorkfs.dashboard.CANMessage} CANMessage instance
             */
            CANMessage.create = function create(properties) {
                return new CANMessage(properties);
            };

            /**
             * Encodes the specified CANMessage message. Does not implicitly {@link yorkfs.dashboard.CANMessage.verify|verify} messages.
             * @function encode
             * @memberof yorkfs.dashboard.CANMessage
             * @static
             * @param {yorkfs.dashboard.ICANMessage} message CANMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CANMessage.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
                if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.data);
                if (message.isExtendedId != null && Object.hasOwnProperty.call(message, "isExtendedId"))
                    writer.uint32(/* id 3, wireType 0 =*/24).bool(message.isExtendedId);
                if (message.isRtr != null && Object.hasOwnProperty.call(message, "isRtr"))
                    writer.uint32(/* id 4, wireType 0 =*/32).bool(message.isRtr);
                return writer;
            };

            /**
             * Encodes the specified CANMessage message, length delimited. Does not implicitly {@link yorkfs.dashboard.CANMessage.verify|verify} messages.
             * @function encodeDelimited
             * @memberof yorkfs.dashboard.CANMessage
             * @static
             * @param {yorkfs.dashboard.ICANMessage} message CANMessage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CANMessage.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CANMessage message from the specified reader or buffer.
             * @function decode
             * @memberof yorkfs.dashboard.CANMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {yorkfs.dashboard.CANMessage} CANMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CANMessage.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.yorkfs.dashboard.CANMessage();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.uint32();
                            break;
                        }
                    case 2: {
                            message.data = reader.bytes();
                            break;
                        }
                    case 3: {
                            message.isExtendedId = reader.bool();
                            break;
                        }
                    case 4: {
                            message.isRtr = reader.bool();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a CANMessage message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof yorkfs.dashboard.CANMessage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {yorkfs.dashboard.CANMessage} CANMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CANMessage.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CANMessage message.
             * @function verify
             * @memberof yorkfs.dashboard.CANMessage
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CANMessage.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isInteger(message.id))
                        return "id: integer expected";
                if (message.data != null && message.hasOwnProperty("data"))
                    if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                        return "data: buffer expected";
                if (message.isExtendedId != null && message.hasOwnProperty("isExtendedId"))
                    if (typeof message.isExtendedId !== "boolean")
                        return "isExtendedId: boolean expected";
                if (message.isRtr != null && message.hasOwnProperty("isRtr"))
                    if (typeof message.isRtr !== "boolean")
                        return "isRtr: boolean expected";
                return null;
            };

            /**
             * Creates a CANMessage message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof yorkfs.dashboard.CANMessage
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {yorkfs.dashboard.CANMessage} CANMessage
             */
            CANMessage.fromObject = function fromObject(object) {
                if (object instanceof $root.yorkfs.dashboard.CANMessage)
                    return object;
                let message = new $root.yorkfs.dashboard.CANMessage();
                if (object.id != null)
                    message.id = object.id >>> 0;
                if (object.data != null)
                    if (typeof object.data === "string")
                        $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                    else if (object.data.length >= 0)
                        message.data = object.data;
                if (object.isExtendedId != null)
                    message.isExtendedId = Boolean(object.isExtendedId);
                if (object.isRtr != null)
                    message.isRtr = Boolean(object.isRtr);
                return message;
            };

            /**
             * Creates a plain object from a CANMessage message. Also converts values to other types if specified.
             * @function toObject
             * @memberof yorkfs.dashboard.CANMessage
             * @static
             * @param {yorkfs.dashboard.CANMessage} message CANMessage
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CANMessage.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.id = 0;
                    if (options.bytes === String)
                        object.data = "";
                    else {
                        object.data = [];
                        if (options.bytes !== Array)
                            object.data = $util.newBuffer(object.data);
                    }
                    object.isExtendedId = false;
                    object.isRtr = false;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.data != null && message.hasOwnProperty("data"))
                    object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
                if (message.isExtendedId != null && message.hasOwnProperty("isExtendedId"))
                    object.isExtendedId = message.isExtendedId;
                if (message.isRtr != null && message.hasOwnProperty("isRtr"))
                    object.isRtr = message.isRtr;
                return object;
            };

            /**
             * Converts this CANMessage to JSON.
             * @function toJSON
             * @memberof yorkfs.dashboard.CANMessage
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CANMessage.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CANMessage
             * @function getTypeUrl
             * @memberof yorkfs.dashboard.CANMessage
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CANMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/yorkfs.dashboard.CANMessage";
            };

            return CANMessage;
        })();

        dashboard.DashboardCommand = (function() {

            /**
             * Properties of a DashboardCommand.
             * @memberof yorkfs.dashboard
             * @interface IDashboardCommand
             * @property {yorkfs.dashboard.DashboardCommand.CommandType|null} [type] DashboardCommand type
             * @property {number|Long|null} [commandTimestampMs] DashboardCommand commandTimestampMs
             * @property {yorkfs.dashboard.ICANMessage|null} [canToSend] DashboardCommand canToSend
             */

            /**
             * Constructs a new DashboardCommand.
             * @memberof yorkfs.dashboard
             * @classdesc Represents a DashboardCommand.
             * @implements IDashboardCommand
             * @constructor
             * @param {yorkfs.dashboard.IDashboardCommand=} [properties] Properties to set
             */
            function DashboardCommand(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * DashboardCommand type.
             * @member {yorkfs.dashboard.DashboardCommand.CommandType} type
             * @memberof yorkfs.dashboard.DashboardCommand
             * @instance
             */
            DashboardCommand.prototype.type = 0;

            /**
             * DashboardCommand commandTimestampMs.
             * @member {number|Long} commandTimestampMs
             * @memberof yorkfs.dashboard.DashboardCommand
             * @instance
             */
            DashboardCommand.prototype.commandTimestampMs = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * DashboardCommand canToSend.
             * @member {yorkfs.dashboard.ICANMessage|null|undefined} canToSend
             * @memberof yorkfs.dashboard.DashboardCommand
             * @instance
             */
            DashboardCommand.prototype.canToSend = null;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            /**
             * DashboardCommand commandPayload.
             * @member {"canToSend"|undefined} commandPayload
             * @memberof yorkfs.dashboard.DashboardCommand
             * @instance
             */
            Object.defineProperty(DashboardCommand.prototype, "commandPayload", {
                get: $util.oneOfGetter($oneOfFields = ["canToSend"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new DashboardCommand instance using the specified properties.
             * @function create
             * @memberof yorkfs.dashboard.DashboardCommand
             * @static
             * @param {yorkfs.dashboard.IDashboardCommand=} [properties] Properties to set
             * @returns {yorkfs.dashboard.DashboardCommand} DashboardCommand instance
             */
            DashboardCommand.create = function create(properties) {
                return new DashboardCommand(properties);
            };

            /**
             * Encodes the specified DashboardCommand message. Does not implicitly {@link yorkfs.dashboard.DashboardCommand.verify|verify} messages.
             * @function encode
             * @memberof yorkfs.dashboard.DashboardCommand
             * @static
             * @param {yorkfs.dashboard.IDashboardCommand} message DashboardCommand message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DashboardCommand.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
                if (message.commandTimestampMs != null && Object.hasOwnProperty.call(message, "commandTimestampMs"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.commandTimestampMs);
                if (message.canToSend != null && Object.hasOwnProperty.call(message, "canToSend"))
                    $root.yorkfs.dashboard.CANMessage.encode(message.canToSend, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified DashboardCommand message, length delimited. Does not implicitly {@link yorkfs.dashboard.DashboardCommand.verify|verify} messages.
             * @function encodeDelimited
             * @memberof yorkfs.dashboard.DashboardCommand
             * @static
             * @param {yorkfs.dashboard.IDashboardCommand} message DashboardCommand message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            DashboardCommand.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a DashboardCommand message from the specified reader or buffer.
             * @function decode
             * @memberof yorkfs.dashboard.DashboardCommand
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {yorkfs.dashboard.DashboardCommand} DashboardCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DashboardCommand.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.yorkfs.dashboard.DashboardCommand();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.type = reader.int32();
                            break;
                        }
                    case 2: {
                            message.commandTimestampMs = reader.uint64();
                            break;
                        }
                    case 3: {
                            message.canToSend = $root.yorkfs.dashboard.CANMessage.decode(reader, reader.uint32());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a DashboardCommand message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof yorkfs.dashboard.DashboardCommand
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {yorkfs.dashboard.DashboardCommand} DashboardCommand
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            DashboardCommand.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a DashboardCommand message.
             * @function verify
             * @memberof yorkfs.dashboard.DashboardCommand
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            DashboardCommand.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.type != null && message.hasOwnProperty("type"))
                    switch (message.type) {
                    default:
                        return "type: enum value expected";
                    case 0:
                    case 1:
                        break;
                    }
                if (message.commandTimestampMs != null && message.hasOwnProperty("commandTimestampMs"))
                    if (!$util.isInteger(message.commandTimestampMs) && !(message.commandTimestampMs && $util.isInteger(message.commandTimestampMs.low) && $util.isInteger(message.commandTimestampMs.high)))
                        return "commandTimestampMs: integer|Long expected";
                if (message.canToSend != null && message.hasOwnProperty("canToSend")) {
                    properties.commandPayload = 1;
                    {
                        let error = $root.yorkfs.dashboard.CANMessage.verify(message.canToSend);
                        if (error)
                            return "canToSend." + error;
                    }
                }
                return null;
            };

            /**
             * Creates a DashboardCommand message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof yorkfs.dashboard.DashboardCommand
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {yorkfs.dashboard.DashboardCommand} DashboardCommand
             */
            DashboardCommand.fromObject = function fromObject(object) {
                if (object instanceof $root.yorkfs.dashboard.DashboardCommand)
                    return object;
                let message = new $root.yorkfs.dashboard.DashboardCommand();
                switch (object.type) {
                default:
                    if (typeof object.type === "number") {
                        message.type = object.type;
                        break;
                    }
                    break;
                case "COMMAND_TYPE_UNSPECIFIED":
                case 0:
                    message.type = 0;
                    break;
                case "COMMAND_TYPE_SEND_CAN_MESSAGE":
                case 1:
                    message.type = 1;
                    break;
                }
                if (object.commandTimestampMs != null)
                    if ($util.Long)
                        (message.commandTimestampMs = $util.Long.fromValue(object.commandTimestampMs)).unsigned = true;
                    else if (typeof object.commandTimestampMs === "string")
                        message.commandTimestampMs = parseInt(object.commandTimestampMs, 10);
                    else if (typeof object.commandTimestampMs === "number")
                        message.commandTimestampMs = object.commandTimestampMs;
                    else if (typeof object.commandTimestampMs === "object")
                        message.commandTimestampMs = new $util.LongBits(object.commandTimestampMs.low >>> 0, object.commandTimestampMs.high >>> 0).toNumber(true);
                if (object.canToSend != null) {
                    if (typeof object.canToSend !== "object")
                        throw TypeError(".yorkfs.dashboard.DashboardCommand.canToSend: object expected");
                    message.canToSend = $root.yorkfs.dashboard.CANMessage.fromObject(object.canToSend);
                }
                return message;
            };

            /**
             * Creates a plain object from a DashboardCommand message. Also converts values to other types if specified.
             * @function toObject
             * @memberof yorkfs.dashboard.DashboardCommand
             * @static
             * @param {yorkfs.dashboard.DashboardCommand} message DashboardCommand
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            DashboardCommand.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.type = options.enums === String ? "COMMAND_TYPE_UNSPECIFIED" : 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.commandTimestampMs = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.commandTimestampMs = options.longs === String ? "0" : 0;
                }
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = options.enums === String ? $root.yorkfs.dashboard.DashboardCommand.CommandType[message.type] === undefined ? message.type : $root.yorkfs.dashboard.DashboardCommand.CommandType[message.type] : message.type;
                if (message.commandTimestampMs != null && message.hasOwnProperty("commandTimestampMs"))
                    if (typeof message.commandTimestampMs === "number")
                        object.commandTimestampMs = options.longs === String ? String(message.commandTimestampMs) : message.commandTimestampMs;
                    else
                        object.commandTimestampMs = options.longs === String ? $util.Long.prototype.toString.call(message.commandTimestampMs) : options.longs === Number ? new $util.LongBits(message.commandTimestampMs.low >>> 0, message.commandTimestampMs.high >>> 0).toNumber(true) : message.commandTimestampMs;
                if (message.canToSend != null && message.hasOwnProperty("canToSend")) {
                    object.canToSend = $root.yorkfs.dashboard.CANMessage.toObject(message.canToSend, options);
                    if (options.oneofs)
                        object.commandPayload = "canToSend";
                }
                return object;
            };

            /**
             * Converts this DashboardCommand to JSON.
             * @function toJSON
             * @memberof yorkfs.dashboard.DashboardCommand
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            DashboardCommand.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for DashboardCommand
             * @function getTypeUrl
             * @memberof yorkfs.dashboard.DashboardCommand
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            DashboardCommand.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/yorkfs.dashboard.DashboardCommand";
            };

            /**
             * CommandType enum.
             * @name yorkfs.dashboard.DashboardCommand.CommandType
             * @enum {number}
             * @property {number} COMMAND_TYPE_UNSPECIFIED=0 COMMAND_TYPE_UNSPECIFIED value
             * @property {number} COMMAND_TYPE_SEND_CAN_MESSAGE=1 COMMAND_TYPE_SEND_CAN_MESSAGE value
             */
            DashboardCommand.CommandType = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "COMMAND_TYPE_UNSPECIFIED"] = 0;
                values[valuesById[1] = "COMMAND_TYPE_SEND_CAN_MESSAGE"] = 1;
                return values;
            })();

            return DashboardCommand;
        })();

        return dashboard;
    })();

    return yorkfs;
})();

export { $root as default };
