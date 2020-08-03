import { addColors, createLogger, format, transports } from 'winston';
import { Levels, LoggerLevels } from './types';

const customFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} - [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
  level: 'debug',
  levels: LoggerLevels.levels,
  // defaultMeta: { service: 'user-service' },
  format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), customFormat),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error', maxsize: Math.pow(1024, 3) }),
    new transports.File({ filename: 'app.log', maxsize: Math.pow(1024, 3), options: { flags: 'w' } }),
  ],
});

addColors(LoggerLevels.colors);

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(logger.format, format.colorize({ all: true })),
    }),
  );
}

export { Levels };
export default logger;
