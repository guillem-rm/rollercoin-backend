import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

// Custom log format: displays timestamp, log level, and message
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

/**
 * Centralized logger configuration using Winston.
 * Logs messages to both console and a file with timestamps and colorization.
 */
const logger = createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
    ),
    transports: [
        new transports.Console({
        format: combine(
            colorize(),
            timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            logFormat
        )
        }),
        new transports.File({ filename: "logs/app.log", level: "info" })
    ]
});

export default logger;