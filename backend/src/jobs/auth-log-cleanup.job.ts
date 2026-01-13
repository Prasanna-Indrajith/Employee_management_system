import cron from 'node-cron';
import fs from 'fs';
import path from 'path';

// Cleanup old auth logs every day at midnight
cron.schedule('0 0 * * *', () => {
  const logsDir = path.join(process.cwd(), 'logs');
  const now = Date.now();
  const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
  
  try {
    const files = fs.readdirSync(logsDir);
    
    files.forEach(file => {
      if (file.includes('auth-') && file.endsWith('.log')) {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);
        
        // Delete files older than 7 days
        if (stats.mtime.getTime() < sevenDaysAgo) {
          fs.unlinkSync(filePath);
          console.log(`Cleaned old auth log file: ${file}`);
        }
      }
    });
    
    console.log('Auth log cleanup completed');
  } catch (error) {
    console.error('Error during auth log cleanup:', error);
  }
});

console.log('Auth log cleanup job scheduled to run daily at midnight');