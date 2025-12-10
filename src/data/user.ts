export interface UserProfile {
  name: string
  title: string
  avatar: string
  location: string
  availability: string
  about: string
  skills: string[]
  links: { label: string; url: string }[]
  metrics: {
    applications: number
    interviews: number
    offers: number
    referrals: number
  }
  timeline: { id: string; label: string; time: string; description: string }[]
}

export const userProfile: UserProfile = {
  name: 'Maya Fernandes',
  title: 'Product Designer · JobTrackr member since 2022',
  avatar: 'https://i.pravatar.cc/160?img=47',
  location: 'Lisbon, Portugal',
  availability: 'Open to remote & hybrid roles',
  about:
    'I craft inclusive, high-impact product experiences for growth-stage SaaS teams. Recently led onboarding redesign that moved activation by +23%.',
  skills: ['Interaction Design', 'Prototyping', 'Design Systems', 'Motion', 'User Research'],
  links: [
    { label: 'Portfolio', url: 'https://mayafer.design' },
    { label: 'Dribbble', url: 'https://dribbble.com/mayaf' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/mayaf' },
  ],
  metrics: {
    applications: 42,
    interviews: 9,
    offers: 2,
    referrals: 5,
  },
  timeline: [
    {
      id: '1',
      label: 'Offer negotiation — Relaywave',
      time: 'Yesterday at 4:15 PM',
      description: 'Reviewed RSU refresh structure with mentor and drafted counteroffer template.',
    },
    {
      id: '2',
      label: 'Portfolio review — Nebula UI',
      time: 'Tuesday at 12:00 PM',
      description: 'Shipped micro-interaction prototypes in Framer to walk through storytelling approach.',
    },
    {
      id: '3',
      label: 'Referral intro — Muon Labs',
      time: 'Monday at 8:45 AM',
      description: 'Synced with alumni connection for referral insights and culture notes.',
    },
  ],
}
