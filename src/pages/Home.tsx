import { useState } from "react";
import Navbar from "../components/Navbar";
import JobForm from "../components/JobCard";
import JobCard from '../components/JobCard';
import Stats from "../components/Stats";

interface Job {
  id:Number;
  title:String;
  company:String;
  status:'applied' | 'interview' | 'offer' | 'rejected';
  date:String;
}

export default function Home() {
  const [jobs,setJobs] = useState<Job[]>([
    {id:1, title:"Frontend Developer", company:"Tech Corp", status:"applied", date:"2024-06-01"},
    {id:2, title:"Backend Developer", company:"Innovate Ltd", status:"interview", date:"2024-06-03"},
    {id:3, title:"Fullstack Developer", company:"Web Solutions", status:"offer", date:"2024-06-05"},
  ]);


  const [showForm, setShowForm] = useState(false);



  const handleaddjob = (newJob:Omit<Job,'id'|'date'>) => {
    const job:Job = {
      ...newJob,
      id: jobs.length + 1,
      date: new Date().toISOString().split('T')[0],
    };
    setJobs([...jobs, job]);
    setShowForm(false);
  }

  const handledeletejob = (id:Number) => {
    setJobs(jobs.filter(job => job.id !== id));
  }

  const handleUpdateStatus = (id: number, newStatus: Job['status']) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, status: newStatus } : job
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Job Application Tracker</h1>
          <p className="text-xl mb-8">Keep track of all your job applications in one place</p>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            + Add New Job
          </button>
        </div>
      </section>

      {/* Conditional Rendering - Show Form */}
      {showForm && (
        <JobForm 
          onAddJob={handleaddjob}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Stats Component */}
      <Stats jobs={jobs} />

      {/* Jobs List - CONCEPT 5: map() to render lists */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Your Applications ({jobs.length})</h2>
          {jobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 text-lg">No jobs added yet. Start by adding your first application!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {jobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onDelete={handledeletejob}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
