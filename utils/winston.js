const winston = require("winston");
const { createLogger, format, transports , addColors} = winston;

let logger = new createLogger({
    format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.simple()
    ),
    color: addColors({
        error: 'bold red',
        warn: 'bold yellow',
        info: 'bold cyan',
        debug: 'bold green'
    }),
    level: 'debug',
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple(),
        )}),
        new transports.File({
            filename: 'winston.json',
            tailable: true,
            exitOnError: false,
            json: true,
        })
    ],
    exitOnError: false
});

module.exports = logger;