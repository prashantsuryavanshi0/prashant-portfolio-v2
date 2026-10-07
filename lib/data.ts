export const PROFILE = {
  name: 'Prashant Aryan',
  firstName: 'PRASHANT',
  role: 'Full Stack Developer',
  email: 'prashantsuryavanahi51781@gmail.com',
  phone: '+91-8709454391',
  phoneHref: 'tel:+918709454391',
  location: 'India (Remote)',
  github: 'https://github.com/prashantsuryavanshi0',
  linkedin: 'https://www.linkedin.com/in/prashant-aryan1/',
  resume: '/resume.pdf',
  summary:
    'Full Stack Developer with hands-on experience in React.js, Node.js, REST APIs, MongoDB, and PostgreSQL. Experienced in building real-world web applications and working in professional development environments. Strong problem-solving, communication, and teamwork skills.',
}

export const NAV = ['About', 'Skills', 'Work', 'Experience', 'Achievements', 'Contact']

export const SKILL_GROUPS = [
  {
    family: 'Languages',
    skills: [
      { symbol: 'Py', name: 'Python', n: 1 },
      { symbol: 'JS', name: 'JavaScript', n: 2 },
      { symbol: 'Ht', name: 'HTML', n: 3 },
      { symbol: 'Cs', name: 'CSS', n: 4 },
    ],
  },
  {
    family: 'Frontend',
    skills: [{ symbol: 'Re', name: 'React.js', n: 5 }],
  },
  {
    family: 'Backend',
    skills: [
      { symbol: 'No', name: 'Node.js', n: 6 },
      { symbol: 'Ex', name: 'Express.js', n: 7 },
      { symbol: 'RA', name: 'REST APIs', n: 8 },
    ],
  },
  {
    family: 'Databases',
    skills: [
      { symbol: 'Mg', name: 'MongoDB', n: 9 },
      { symbol: 'Pg', name: 'PostgreSQL', n: 10 },
      { symbol: 'Nx', name: 'Neon', n: 11 },
    ],
  },
  {
    family: 'Tools',
    skills: [
      { symbol: 'Gt', name: 'Git', n: 12 },
      { symbol: 'Gh', name: 'GitHub', n: 13 },
      { symbol: 'Vs', name: 'VS Code', n: 14 },
      { symbol: 'Vi', name: 'Vite', n: 15 },
      { symbol: 'Tw', name: 'Tailwind', n: 16 },
    ],
  },
  {
    family: 'Concepts',
    skills: [
      { symbol: 'OO', name: 'OOPs', n: 17 },
      { symbol: 'AI', name: 'API Integration', n: 18 },
      { symbol: 'Au', name: 'Automation', n: 19 },
    ],
  },
  {
    family: 'Soft Skills',
    skills: [
      { symbol: 'Tw', name: 'Teamwork', n: 20 },
      { symbol: 'Cm', name: 'Communication', n: 21 },
      { symbol: 'Ps', name: 'Problem-Solving', n: 22 },
      { symbol: 'Tm', name: 'Time Mgmt', n: 23 },
    ],
  },
]

export const EXPERIENCE = [
  {
    id: 'zytexa',
    type: 'Full-time',
    role: 'Full Stack Developer',
    company: 'Zytexa Technology LLP',
    period: 'Aug 2026 – Present',
    bullets: [
      'Developing full-stack web applications using React.js, Node.js, REST APIs, and modern frontend technologies.',
      'Working with databases, backend services, API integration, and responsive user interfaces.',
    ],
  },
  {
    id: 'amdox',
    type: 'Internship',
    role: 'Web Developer Intern',
    company: 'Amdox Technologies',
    period: 'Jan 2026 – Apr 2026',
    bullets: [
      'Completed a 3-month internship focused on web development and full-stack application development.',
      'Worked on frontend interfaces, backend functionality, APIs, database integration, debugging, and real-world projects.',
    ],
  },
]

export const EDUCATION = [
  {
    id: 'nims',
    degree: 'B.Tech in Computer Science and Engineering',
    institution: 'NIMS University, Jaipur',
    period: '2022 – 2026',
    grade: 'SGPA: 7.2',
  },
]

export const PROJECTS = [
  {
    id: 'job-portal',
    index: '01',
    title: 'Job Portal Website',
    kicker: 'Full Stack · MERN',
    description:
      'Full-stack job portal with separate Student and Recruiter authentication, dashboards, job listings, and application management.',
    features: ['Student & Recruiter auth', 'Job listings dashboard', 'Application management', 'Redux state management'],
    tech: ['React.js', 'Vite', 'Tailwind CSS', 'Redux Toolkit', 'Axios', 'Node.js', 'Express.js', 'MongoDB'],
    github: null,
    live: 'https://job-portal-1-pjiu.onrender.com/',
    image: '/projects/job-portal.webp',
  },
  {
    id: 'aureate',
    index: '02',
    title: 'Aureate India Website',
    kicker: 'Frontend · Business',
    description:
      'Responsive business website with modern UI, structured sections, interactive components, and mobile-friendly layouts.',
    features: ['Responsive design', 'Interactive UI', 'Mobile-first', 'Modern sections'],
    tech: ['HTML', 'CSS', 'JavaScript'],
    github: null,
    live: 'https://prashantsuryavanshi0.github.io/aureate-india/',
    image: '/projects/aureate.webp',
  },
  {
    id: 'memory-game',
    index: '03',
    title: 'Memory Card Matching Game',
    kicker: 'Frontend · Game',
    description:
      'Interactive memory matching game with card matching logic, game state management, and responsive UI.',
    features: ['Card flip logic', 'Game state management', 'Score tracking', 'Responsive UI'],
    tech: ['JavaScript', 'HTML', 'CSS'],
    github: null,
    live: 'https://memory-card-matching-game-assignmen.vercel.app/',
    image: '/projects/memory-match.webp',
  },
  {
    id: 'cloud-kitchen',
    index: '04',
    title: 'Cloud Kitchen Website',
    kicker: 'Frontend · React',
    description:
      'Responsive cloud kitchen website with reusable UI sections, modern design, and mobile-friendly layouts.',
    features: ['Reusable components', 'Modern design', 'Mobile-friendly', 'React architecture'],
    tech: ['React.js', 'JavaScript', 'HTML', 'CSS'],
    github: null,
    live: 'https://cloud-kitchen-pro.vercel.app/',
    image: '/projects/cloud-kitchen.webp',
  },
  {
    id: 'restaurant',
    index: '05',
    title: 'Restaurant Management System',
    kicker: 'Full Stack · MERN',
    description:
      'Full-stack restaurant management system with frontend interfaces, backend services, REST APIs, and database integration.',
    features: ['REST API backend', 'Database integration', 'Frontend interfaces', 'MERN stack'],
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
    github: null,
    live: 'https://restaurant-management-system-lp01.onrender.com/',
    image: '/projects/restaurant-dashboard.png',
  },
]

export const CERTIFICATIONS = [
  { id: 'aws', title: 'AWS Virtual Internship', issuer: 'Internship Studio', year: '2024' },
]

export const ACHIEVEMENTS = [
  { id: 'hackerrank', title: '5-Star Python', platform: 'HackerRank', detail: 'Python', number: '5', unit: '★' },
  { id: 'cit', title: 'Common Internship Test', platform: 'Internship Studio', detail: 'All India Rank', number: '101', unit: 'st' },
  { id: 'adobe', title: 'Adobe India Hackathon', platform: 'Adobe', detail: 'Round 1 Qualified · Team "The Debuggers"', number: '1', unit: 'st Rd' },
]
