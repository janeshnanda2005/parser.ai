const API_BASE_URL = 'http://localhost:5000/api';

export interface Job {
  id?: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  salary_min?: number;
  salary_max?: number;
  created?: string;
  redirect_url?: string;
  category?: string;
  [key: string]: unknown;
}

export interface SearchResponse {
  query: string;
  answer: string;
}

export const api = {
  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    if (!response.ok) throw new Error('Health check failed');
    return response.json();
  },

  // Get all jobs
  async getJobs(): Promise<Job[]> {
    const response = await fetch(`${API_BASE_URL}/jobs`);
    if (!response.ok) throw new Error('Failed to fetch jobs');
    return response.json();
  },

  // Get jobs by category
  async getJobsByCategory(category: string): Promise<Job[]> {
    const response = await fetch(`${API_BASE_URL}/jobs/${encodeURIComponent(category)}`);
    if (!response.ok) throw new Error(`Failed to fetch ${category} jobs`);
    return response.json();
  },

  // Search jobs using RAG
  async searchJobs(query: string): Promise<SearchResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        const text = await response.text();
        let error;
        try {
          error = JSON.parse(text);
        } catch {
          throw new Error(`Server error: ${response.status} - ${text || 'Unknown error'}`);
        }
        throw new Error(error.error || 'Failed to search jobs');
      }
      
      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }
      return JSON.parse(text);
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Make sure the backend is running on port 5000.');
      }
      throw err;
    }
  },
};

export default api;
