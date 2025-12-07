 import { useState } from "react";
 import Navbar from "../components/Navbar";
 import JobCard from "../components/JobCard";
 import JobForm from "../components/JobForm";
 import Stats from "../components/Stats";

interface Job {
    id:number;
    title:string;
    company:string;
    status:'Applied' | 'Interviewing' | 'Accepted' | 'Rejected';
    data:string;
}
export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold mb-4">Welcome to Job Tracker</h1>
      <p className="text-xl text-gray-600 mb-8">Track your job applications easily</p>
      <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
        Get Started
      </button>
    </div>
  )
}
