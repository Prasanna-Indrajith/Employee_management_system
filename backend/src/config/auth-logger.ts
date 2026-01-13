import winston from 'winston';

// Authentication-specific logger with 7-day retention
export const authLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'user-authentication' },
  transports: [
    new winston.transports.File({
      filename: 'logs/auth-activity.log',
      level: 'info',
      maxsize: 10485760, // 10MB
      maxFiles: 7, // 7 days retention
      tailable: true
    }),
    new winston.transports.File({
      filename: 'logs/auth-errors.log',
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 7, // 7 days retention
      tailable: true
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Helper function to clean old logs (7-day retention)
export const cleanupOldAuthLogs = () => {
  const fs = require('fs');
  const path = require('path');
  const logsDir = path.join(process.cwd(), 'logs');
  
  try {
    const files = fs.readdirSync(logsDir);
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    files.forEach((file: string) => {
      if (file.includes('auth-') && file.endsWith('.log')) {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);
        
        // Delete files older than 7 days
        if (stats.mtime.getTime() < sevenDaysAgo) {
          fs.unlinkSync(filePath);
          console.log(`Cleaned old log file: ${file}`);
        }
      }
    });
  } catch (error) {
    console.error('Error cleaning auth logs:', error);
  }
};