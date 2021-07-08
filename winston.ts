/** @format */

const { createLogger, format, transports } = require('winston');
const { colorize, combine, timestamp, label, printf, json, prettyPrint } = format;

const myFormat = printf(({ timestamp, label, level, message }: any) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

// define the custom settings for each transport (file, console)
const options = {
    fileJson: {
        level: 'debug',
        filename: (process.env.LOGPATH || './log') + '/log.json',
        handleExceptions: true,
        maxsize: 10485760, // 10MB
        maxFiles: 10,
        colorize: false,
        format: combine(timestamp(), label({ label: process.env.LOGLABEL || 'GENERIC' }), json()),
    },
    fileLog: {
        level: 'debug',
        filename: (process.env.LOGPATH || './log') + '/log.txt',
        handleExceptions: true,
        maxsize: 10485760, // 10MB
        maxFiles: 10,
        colorize: false,
        format: combine(timestamp(), label({ label: process.env.LOGLABEL || 'GENERIC' }), myFormat),
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        format: combine(colorize(), label({ label: process.env.LOGLABEL || 'GENERIC' }), timestamp(), myFormat),
    },
};

// instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
    transports: [
        new transports.File(options.fileJson),
        new transports.File(options.fileLog),
        new transports.Console(options.console),
    ],
    exitOnError: false, // do not exit on handled exceptions
});

export default {
    debug: (...params: Object[]) => logger.debug(params),
    info: (...params: Object[]) => logger.info(params),
    warning: (...params: Object[]) => logger.warning(params),
    error: (...params: Object[]) => logger.error(params),
};
