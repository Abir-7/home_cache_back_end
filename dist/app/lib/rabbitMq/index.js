"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannel = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const amqplib_1 = __importDefault(require("amqplib"));
const appConfig_1 = require("../../config/appConfig");
const logger_1 = require("../../utils/serverTools/logger");
const uri = appConfig_1.appConfig.rabbitMq.url;
let connection = null;
const channelMap = new Map();
const getChannel = (queueName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!connection) {
            connection = yield amqplib_1.default.connect(uri);
            connection.on("error", (err) => {
                logger_1.logger.error("RabbitMQ connection error:", err);
                connection = null;
            });
            connection.on("close", () => {
                logger_1.logger.warn("RabbitMQ connection closed");
                connection = null;
            });
        }
        if (queueName && channelMap.has(queueName)) {
            return channelMap.get(queueName);
        }
        const channel = yield connection.createChannel();
        if (queueName) {
            yield channel.assertQueue(queueName, { durable: true });
            channelMap.set(queueName, channel);
        }
        return channel;
    }
    catch (error) {
        logger_1.logger.error(`Error connecting to RabbitMQ: ${error.message}`);
        throw error;
    }
});
exports.getChannel = getChannel;
