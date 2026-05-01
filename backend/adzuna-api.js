import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_ID = 'd58ac19b';
const APP_KEY = '33535e58fb121140a96ace986018732b';

const CATEGORIES = [
    'cloud',
    'devops',
    'artificial intelligence',
    'machine learning',
    'data science',
    'big data',
    'blockchain',
    'cyber security',
    'internet of things',
    'network',
    'mobile',
    'web',
    'software',
    'full stack',
    'front end',
    'back end',
    'qa',
    'testing',
    'automation',
    'database',
    'systems',
    'infrastructure',
    'site reliability',
    'security',
    'technical support'
];

/**
 * Fetch jobs from Adzuna API for a specific category
 */
async function fetchJobsForCategory(category) {
    try {
        const query = `${category} Engineer`;
        const url = `https://api.adzuna.com/v1/api/jobs/in/search/1`;
        
        const params = {
            app_id: APP_ID,
            app_key: APP_KEY,
            what: query,
            where: 'india',
            max_days_old: 14,
            sort_by: 'date',
            results_per_page: 50,
            content_type: 'application/json'
        };
        
        logger.info(`Fetching jobs for: ${category}...`);
        const response = await axios.get(url, { params });
        
        return response.data;
    } catch (error) {
        logger.error(`Error fetching jobs for ${category}`, error);
        return null;
    }
}

/**
 * Save job data to file
 */
function saveJobData(category, data) {
    try {
        const dataFilesDir = path.join(__dirname, 'data_files');
        
        // Ensure directory exists
        if (!fs.existsSync(dataFilesDir)) {
            fs.mkdirSync(dataFilesDir, { recursive: true });
        }
        
        const filename = `${category}+ind.json`;
        const filePath = path.join(dataFilesDir, filename);
        
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf-8');
        logger.info(`Saved: data_files/${filename}`);
        
        return true;
    } catch (error) {
        logger.error(`Error saving data for ${category}`, error);
        return false;
    }
}

/**
 * Fetch and save jobs for all categories
 */
export async function fetchAllJobs() {
    logger.info('Starting to fetch jobs from Adzuna API...');
    
    let successCount = 0;
    let failureCount = 0;
    
    for (const category of CATEGORIES) {
        try {
            const data = await fetchJobsForCategory(category);
            
            if (data) {
                saveJobData(category, data);
                successCount++;
            } else {
                failureCount++;
            }
            
            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            logger.error(`Error processing ${category}`, error);
            failureCount++;
        }
    }
    
    logger.info(`Fetch complete! Success: ${successCount}, Failed: ${failureCount}`);
    return { successCount, failureCount };
}

/**
 * Fetch jobs for specific categories
 */
export async function fetchJobsByCategories(categories = CATEGORIES) {
    logger.info(`Fetching jobs for ${categories.length} categories...`);
    
    const results = {};
    
    for (const category of categories) {
        try {
            const data = await fetchJobsForCategory(category);
            if (data) {
                results[category] = data;
                saveJobData(category, data);
            }
        } catch (error) {
            logger.error(`Error for category ${category}`, error);
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return results;
}

/**
 * Get available categories
 */
export function getAvailableCategories() {
    return CATEGORIES;
}

/**
 * Verify Adzuna API credentials
 */
export async function verifyApiCredentials() {
    try {
        const response = await axios.get('https://api.adzuna.com/v1/api/jobs/in/search/1', {
            params: {
                app_id: APP_ID,
                app_key: APP_KEY,
                what: 'software',
                results_per_page: 1
            }
        });
        
        logger.info('API credentials verified successfully!');
        return true;
    } catch (error) {
        logger.error('Failed to verify API credentials', error);
        return false;
    }
}

export { CATEGORIES, APP_ID };
