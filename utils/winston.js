const Winston = require('winston');

let logger = new Winston.createLogger({
    format: Winston.format.combine(
        Winston.format.colorize(),
        Winston.format.simple()
    ),
    color: Winston.addColors({
        error: 'bold red',
        warn: 'bold yellow',
        info: 'bold cyan',
        debug: 'bold green'
    }),
    level: 'debug',
    transports: [
        new Winston.transports.Console({
            prettyPrint: true,
            handleExceptions: true
        })
    ],
    exitOnError: false
});

module.exports = logger;