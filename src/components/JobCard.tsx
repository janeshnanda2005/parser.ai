// CONCEPT: Props and Event Handlers - Child components communicating with parent

interface Job {
  id: number;
  title: string;
  company: string;
  status: 'Applied' | 'Interviewing' | 'Accepted' | 'Rejected';
  date: string;
}

interface JobCardProps {
  job: Job;
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, status: Job['status']) => void;
}

export default function JobCard({ job, onDelete, onUpdateStatus }: JobCardProps) {
  // CONCEPT: Helper function to get status styling
  const getStatusColor = (status: Job['status']) => {
    const statusStyles = {
      Applied: 'bg-blue-100 text-blue-800',
      Interviewing: 'bg-yellow-100 text-yellow-800',
      Rejected: 'bg-red-100 text-red-800',
      Accepted: 'bg-green-100 text-green-800',
    };
    return statusStyles[status];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-l-4 border-blue-600">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800">{job.title}</h3>
          <p className="text-gray-600 text-lg">{job.company}</p>
          <p className="text-gray-400 text-sm mt-2">Applied on: {job.date}</p>
        </div>
        
        <div className="flex gap-4 items-center">
          {/* Status Select - CONCEPT: Dropdown to update status */}
          <select
            value={job.status}
            onChange={(e) => onUpdateStatus(job.id, e.target.value as Job['status'])}
            className={`px-4 py-2 rounded-full font-semibold border-0 cursor-pointer ${getStatusColor(job.status)}`}
          >
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Delete Button - CONCEPT: Event handler onClick */}
          <button
            onClick={() => onDelete(job.id)}
            className="text-red-600 hover:text-red-800 font-semibold hover:bg-red-50 px-3 py-1 rounded transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}