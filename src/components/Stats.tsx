// CONCEPT: Props - Passing data from parent to child

interface Job {
  id: number;
  title: string;
  company: string;
  status: 'Applied' | 'Interviewing' | 'Accepted' | 'Rejected';
  date: string;
}

interface StatsProps {
  jobs: Job[];
}

export default function Stats({ jobs }: StatsProps) {
  // Calculate statistics
  const totalApplications = jobs.length;
  const accepted = jobs.filter(j => j.status === 'Accepted').length;
  const interviewing = jobs.filter(j => j.status === 'Interviewing').length;
  const rejected = jobs.filter(j => j.status === 'Rejected').length;

  return (
    <section className="bg-white py-8 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total Applications" value={totalApplications} bgColor="bg-blue-50" textColor="text-blue-600" />
          <StatCard label="Accepted" value={accepted} bgColor="bg-green-50" textColor="text-green-600" />
          <StatCard label="Interviewing" value={interviewing} bgColor="bg-yellow-50" textColor="text-yellow-600" />
          <StatCard label="Rejected" value={rejected} bgColor="bg-red-50" textColor="text-red-600" />
        </div>
      </div>
    </section>
  );
}

// CONCEPT: Sub-component - Breaking UI into smaller pieces
interface StatCardProps {
  label: string;
  value: number;
  bgColor: string;
  textColor: string;
}

function StatCard({ label, value, bgColor, textColor }: StatCardProps) {
  return (
    <div className={`${bgColor} p-6 rounded-lg text-center`}>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
      <p className="text-gray-600">{label}</p>
    </div>
  );
}