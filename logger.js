import { existsSync, mkdirSync } from 'fs';
import { createLogger, format, transports } from 'winston';
 
const logDirectory = './log';
const logFilePath = `${logDirectory}/app.log`;
 
if (!existsSync(logDirectory)) {
  mkdirSync(logDirectory);
}
 
export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: logFilePath })
  ]
});