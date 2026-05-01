import axios from 'axios';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = 'http://localhost:5000';

/**
 * Test health endpoint
 */
async function testHealth() {
    console.log('\n--- Testing Health Endpoint ---');
    try {
        const response = await axios.get(`${API_BASE_URL}/health`);
        console.log('✓ Health check passed:', response.data);
        return true;
    } catch (error) {
        console.error('✗ Health check failed:', error.message);
        return false;
    }
}

/**
 * Test get all jobs
 */
async function testGetAllJobs() {
    console.log('\n--- Testing Get All Jobs ---');
    try {
        const response = await axios.get(`${API_BASE_URL}/api/jobs`);
        console.log(`✓ Retrieved ${response.data.length} jobs`);
        if (response.data.length > 0) {
            console.log('Sample job:', JSON.stringify(response.data[0], null, 2).substring(0, 200) + '...');
        }
        return true;
    } catch (error) {
        console.error('✗ Get all jobs failed:', error.message);
        return false;
    }
}

/**
 * Test get jobs by category
 */
async function testGetJobsByCategory() {
    console.log('\n--- Testing Get Jobs by Category ---');
    const category = 'software';
    try {
        const response = await axios.get(`${API_BASE_URL}/api/jobs/${category}`);
        console.log(`✓ Retrieved jobs for category '${category}':`, response.data?.length || Object.keys(response.data).length);
        return true;
    } catch (error) {
        console.error(`✗ Get jobs by category failed: ${error.response?.status === 404 ? 'Category not found' : error.message}`);
        return false;
    }
}

/**
 * Test similarity search
 */
async function testSimilaritySearch() {
    console.log('\n--- Testing Similarity Search ---');
    try {
        const response = await axios.post(`${API_BASE_URL}/api/similarity-search`, {
            query: 'machine learning engineer',
            k: 5
        });
        console.log(`✓ Found ${response.data.results.length} similar results`);
        if (response.data.results.length > 0) {
            console.log('Top result similarity:', response.data.results[0].similarity);
        }
        return true;
    } catch (error) {
        console.error('✗ Similarity search failed:', error.message);
        return false;
    }
}

/**
 * Test RAG search (requires OPENROUTER_API_KEY)
 */
async function testRagSearch() {
    console.log('\n--- Testing RAG Search ---');
    try {
        const response = await axios.post(`${API_BASE_URL}/api/search`, {
            query: 'what are the best machine learning jobs available'
        });
        console.log('✓ RAG search successful');
        console.log('Response length:', response.data.answer.length);
        console.log('Answer preview:', response.data.answer.substring(0, 300) + '...');
        return true;
    } catch (error) {
        if (error.response?.status === 500 && error.response?.data?.error?.includes('OPENROUTER_API_KEY')) {
            console.warn('⚠ RAG search skipped: OPENROUTER_API_KEY not configured');
            return true;
        }
        console.error('✗ RAG search failed:', error.message);
        return false;
    }
}

/**
 * Run all tests
 */
async function runAllTests() {
    console.log('========================================');
    console.log('Job Tracker Backend - Test Suite');
    console.log('========================================');
    console.log(`API Base URL: ${API_BASE_URL}`);
    console.log(`Start time: ${new Date().toISOString()}`);
    
    const results = {
        health: await testHealth(),
        getAllJobs: await testGetAllJobs(),
        getJobsByCategory: await testGetJobsByCategory(),
        similaritySearch: await testSimilaritySearch(),
        ragSearch: await testRagSearch()
    };
    
    console.log('\n========================================');
    console.log('Test Results Summary');
    console.log('========================================');
    Object.entries(results).forEach(([test, passed]) => {
        console.log(`${passed ? '✓' : '✗'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
    });
    
    const passedCount = Object.values(results).filter(r => r).length;
    const totalCount = Object.values(results).length;
    console.log(`\nTotal: ${passedCount}/${totalCount} tests passed`);
    console.log(`End time: ${new Date().toISOString()}`);
    
    process.exit(passedCount === totalCount ? 0 : 1);
}

// Run tests if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllTests().catch(error => {
        console.error('Test suite error:', error);
        process.exit(1);
    });
}

export { testHealth, testGetAllJobs, testGetJobsByCategory, testSimilaritySearch, testRagSearch };
