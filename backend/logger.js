import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_DIR = path.join(__dirname, 'logs');

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

const LOG_FILE = path.join(LOG_DIR, `app_${new Date().toISOString().split('T')[0]}.log`);

const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
};

const CURRENT_LOG_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL || 'INFO'];

/**
 * Format log message with timestamp
 */
function formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level}] ${message}${dataStr}`;
}

/**
 * Write to log file
 */
function writeToFile(message) {
    try {
        fs.appendFileSync(LOG_FILE, message + '\n', 'utf-8');
    } catch (error) {
        console.error('Failed to write to log file:', error);
    }
}

/**
 * Logger class
 */
export const logger = {
    debug: (message, data) => {
        if (CURRENT_LOG_LEVEL <= LOG_LEVELS.DEBUG) {
            const msg = formatMessage('DEBUG', message, data);
            console.log(msg);
            writeToFile(msg);
        }
    },
    
    info: (message, data) => {
        if (CURRENT_LOG_LEVEL <= LOG_LEVELS.INFO) {
            const msg = formatMessage('INFO', message, data);
            console.log(msg);
            writeToFile(msg);
        }
    },
    
    warn: (message, data) => {
        if (CURRENT_LOG_LEVEL <= LOG_LEVELS.WARN) {
            const msg = formatMessage('WARN', message, data);
            console.warn(msg);
            writeToFile(msg);
        }
    },
    
    error: (message, error) => {
        if (CURRENT_LOG_LEVEL <= LOG_LEVELS.ERROR) {
            const errorData = error instanceof Error 
                ? { message: error.message, stack: error.stack }
                : error;
            const msg = formatMessage('ERROR', message, errorData);
            console.error(msg);
            writeToFile(msg);
        }
    }
};

export default logger;
