const winston = require("winston");
const {createLogger, format, transports} = winston

const logger = createLogger({
    levels: {
        error: 2,
        debug: 1,
        info: 0,
    },
    level: "error",
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.colorize({all: true}),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.Console()
    ]
});

module.exports = logger