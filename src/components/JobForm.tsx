// CONCEPT: Controlled Components - Form inputs tied to state

import { useState } from 'react';

interface JobFormProps {
  onAddJob: (job: { title: string; company: string; status: 'Applied' | 'Interviewing' | 'Accepted' | 'Rejected' }) => void;
  onCancel: () => void;
}

export default function JobForm({ onAddJob, onCancel }: JobFormProps) {
  // CONCEPT: Local Component State for Form
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    status: 'Applied' as const,
  });

  // CONCEPT: Form Validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.company.trim()) {
      alert('Please fill in all fields');
      return;
    }

    onAddJob(formData);
    setFormData({ title: '', company: '', status: 'Applied' });
  };

  // CONCEPT: Event Handlers - onChange for inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <section className="bg-white border-b border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Add New Job Application</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Job Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g., React Developer"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Input Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Company Name *</label>
              <input
                type="text"
                name="company"
                placeholder="e.g., Tech Corp"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Select Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Button Group */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Save Job
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}