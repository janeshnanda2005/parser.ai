export interface JobEntry {
  id: string
  title: string
  company: string
  companyLogo: string
  location: string
  type: 'Full-time' | 'Contract' | 'Freelance' | 'Internship'
  salary: string
  postedAt: string
  status: 'Applied' | 'Interviewing' | 'Offer' | 'Saved'
  description: string
  tags: string[]
}

export const jobEntries: JobEntry[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    company: 'Nebula UI',
    companyLogo: 'https://img.logoipsum.com/291.svg',
    location: 'Remote — North America',
    type: 'Full-time',
    salary: '$155K – $185K • 0.2% – 0.4% equity',
    postedAt: '2 days ago',
    status: 'Interviewing',
    description:
      'Lead the revamp of our design system, collaborate with motion designers, and ship highly polished experiences used by 1M+ creators.',
    tags: ['React 19', 'TypeScript', 'Tailwind', 'Design Systems'],
  },
  {
    id: 'job-2',
    title: 'Founding Fullstack Engineer',
    company: 'Vector Atlas',
    companyLogo: 'https://img.logoipsum.com/221.svg',
    location: 'Hybrid — New York, NY',
    type: 'Full-time',
    salary: '$180K – $210K • 0.4% – 0.6% equity',
    postedAt: '4 days ago',
    status: 'Applied',
    description:
      'Partner with the CTO to build the data ingestion platform powering real-time spatial analytics for climate and logistics customers.',
    tags: ['Next.js', 'Edge Functions', 'PostgreSQL', 'AWS'],
  },
  {
    id: 'job-3',
    title: 'Product Designer — Growth',
    company: 'Relaywave',
    companyLogo: 'https://img.logoipsum.com/198.svg',
    location: 'Remote — EMEA',
    type: 'Contract',
    salary: '$95 — $120 / hr',
    postedAt: '1 week ago',
    status: 'Offer',
    description:
      'Design onboarding experiments, prototype acquisition flows, and collaborate with PMM to evolve our visual identity.',
    tags: ['Figma', 'CJM', 'Motion', 'Storytelling'],
  },
  {
    id: 'job-4',
    title: 'AI Platform Engineer',
    company: 'Muon Labs',
    companyLogo: 'https://img.logoipsum.com/264.svg',
    location: 'Remote — Global',
    type: 'Full-time',
    salary: '$170K – $190K • 0.3% equity',
    postedAt: '3 days ago',
    status: 'Saved',
    description:
      'Own the inference platform for multi-modal copilots, ship internal tooling, and improve latency by 10x for enterprise customers.',
    tags: ['Python', 'Rust', 'Kubernetes', 'LLM Ops'],
  },
]
