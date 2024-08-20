import { serializeError } from "serialize-error";
import winston from "winston";
import morgan from "morgan";

//@TODO does not seem to be working
const reorderLogProps = winston.format((logData) => {
  // set the exact order of the props here
  const propKeys = ["operationId", "level", "service", "message", "data", "timestamp"];
  const { level, message, data, timestamp, service, operationId } = logData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logCopy: { [key: string]: any }= { level, message, data, timestamp, service, operationId };

  for (const propKey of propKeys) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete logData[propKey];
    logData[propKey] = logCopy[propKey];
  }
  return logData;
});

const serializeDataObject = winston.format((logData) => {
  if (logData?.data) {
    logData.data = serializeError(logData.data)
  }
  return logData
})

const defaultFormat = winston.format.combine(
  winston.format.timestamp(),
  reorderLogProps(),
  serializeDataObject(),
  winston.format.json({deterministic: false})
);

export const generalLogger = winston.createLogger({
    //level: "info",
    format: defaultFormat,
    transports: [
      //new winston.transports.File({ filename: "./logs/all.log", maxsize: 10000000 , tailable: true, maxFiles: 999999 }),
      new winston.transports.Console({level: "debug"})
    ],
    //exceptionHandlers: [ new winston.transports.File({ filename: "./logs/exceptions.log"}) ],
    //rejectionHandlers: [ new winston.transports.File({ filename: "./logs/rejections.log"}) ],
});


const winstonHttpLogger = winston.createLogger({
    level: "http",
    defaultMeta: { service: "server.http" },
    format: defaultFormat,
    transports: [ 
      //new winston.transports.File({ filename: "./logs/http.log", level: "http", maxsize: 10000000 , tailable: true, maxFiles: 999999 }),
      new winston.transports.Console({level: "http"})
    ],
});

//@TODO: integrate operationId here as well
export const httpLogger = morgan(("combined"), { stream: { write: (message: string) => winstonHttpLogger.http(message)}});


export class LoggerMeta {
  service: string;
  operationId: string;

  constructor(service: string, operationId: string) {
    this.service = service;
    this.operationId = operationId;
  }

  withData<T>(data: T) {

    return {
      service: this.service,
      operationId: this.operationId,
      data: data
    }

  }

}