import {
  SiReact,
  SiVite,
  SiJavascript,
  SiTailwindcss,
  SiRedux,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMongoose,
  SiNginx,
  SiPm2,
  SiLinux,
  SiGit,
  SiGithub,
} from 'react-icons/si'
import {
  HiOutlineShieldCheck,
  HiOutlineServerStack,
  HiOutlineCircleStack,
  HiOutlineCloud,
} from 'react-icons/hi2'
import { FaAws } from 'react-icons/fa6'

/* ------------------------------------------------------------------ */
/*  Personal / links                                                  */
/* ------------------------------------------------------------------ */
export const profile = {
  name: 'Vivek Kumar Pandey',
  role: 'Full Stack Developer',
  tagline:
    'Building scalable web applications, CRM platforms, and business solutions.',
  intro:
    'I specialize in building modern web applications and business software using React, Vite, Tailwind CSS, Node.js, Express.js, MongoDB, and AWS. My focus is creating scalable, high-performance digital products that solve real business challenges.',
  email: 'vivekpandey.services@gmail.com',
  github: 'https://github.com/Vivek-pandey101',
  linkedin: 'https://www.linkedin.com/in/vivek-kumar-pandey-52924b302/',
  location: 'India',
}

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

/* ------------------------------------------------------------------ */
/*  About                                                             */
/* ------------------------------------------------------------------ */
export const aboutIntro =
  'I am a Full Stack Developer with professional experience since 2025, specializing in building scalable web applications, CRM platforms, educational technology solutions, and business software. I work across frontend development, backend architecture, database design, cloud deployment, and payment gateway integrations. My focus is delivering reliable, user-friendly, and high-performance digital products that solve real-world business challenges.'

export const aboutCards = [
  {
    icon: HiOutlineServerStack,
    title: 'End-to-End Development',
    body: 'Building full stack products from pixel-accurate frontends to resilient backend architecture, database design, and cloud deployment.',
  },
  {
    icon: HiOutlineCircleStack,
    title: 'CRM & EdTech Platforms',
    body: 'Hands-on experience shipping CRM systems and production-grade educational technology platforms used by real students and teams.',
  },
  {
    icon: HiOutlineCloud,
    title: 'Cloud & Scalability',
    body: 'Comfortable owning deployment, production environments, and system scalability on AWS infrastructure.',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Payments & Security',
    body: 'Integrated Razorpay for secure payments and enrollments, with authentication and role-based access built in from the start.',
  },
]

/* ------------------------------------------------------------------ */
/*  Skills                                                            */
/* ------------------------------------------------------------------ */
export const skillCategories = [
  {
    title: 'Frontend',
    accent: '#3b82f6',
    skills: [
      { name: 'React', icon: SiReact },
      { name: 'Vite', icon: SiVite },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
      { name: 'Redux Toolkit', icon: SiRedux },
    ],
  },
  {
    title: 'Backend',
    accent: '#14b8a6',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'Express.js', icon: SiExpress },
      { name: 'REST APIs', icon: HiOutlineServerStack },
      { name: 'Auth & Access Control', icon: HiOutlineShieldCheck },
    ],
  },
  {
    title: 'Database',
    accent: '#8b5cf6',
    skills: [
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'Mongoose', icon: SiMongoose },
    ],
  },
  {
    title: 'Cloud & Infrastructure',
    accent: '#f59e0b',
    skills: [
      { name: 'AWS EC2', icon: FaAws },
      { name: 'AWS SES', icon: FaAws },
      { name: 'Nginx', icon: SiNginx },
      { name: 'PM2', icon: SiPm2 },
      { name: 'Linux', icon: SiLinux },
      { name: 'Git', icon: SiGit },
      { name: 'GitHub', icon: SiGithub },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Experience                                                        */
/* ------------------------------------------------------------------ */
export const experience = [
  {
    role: 'Freelance Full Stack Developer',
    company: 'AcreLoop CRM',
    period: 'June 2026 — Present',
    summary:
      'Building and maintaining a multi-tenant CRM platform for a real estate client.',
    points: [
      'Working independently as a freelancer since leaving my previous role.',
      'Designing and developing AcreLoop, a multi-tenant CRM for real estate organizations.',
      'Implementing lead management, follow-up tracking, and sales workflow features.',
      'Building analytics dashboards, reporting, and role-based access control.',
      'Developing scalable backend APIs and business logic.',
      'Managing cloud deployment and production infrastructure on AWS.',
    ],
    tech: [
      'React',
      'Tailwind CSS',
      'Node.js',
      'Express.js',
      'MongoDB',
      'AWS',
    ],
  },
  {
    role: 'Full Stack Developer',
    company: 'EdTech Company',
    period: 'January 2025 — June 2026',
    summary:
      'Building and scaling educational technology platforms end to end.',
    points: [
      'Developed and maintained Gyankosha, an educational platform designed for school students.',
      'Developed and managed AEP Gyankosha, a learning platform focused on UPSC aspirants.',
      'Built a dedicated learning platform for MBA students and working professionals.',
      'Integrated Razorpay Payment Gateway for secure online payments, enrollments, and transactions.',
      'Designed and developed scalable backend APIs and business logic.',
      'Implemented authentication, authorization, and user management systems.',
      'Worked on frontend development, backend architecture, database design, and deployment processes.',
      'Improved application performance, scalability, and user experience.',
      'Collaborated with product and business teams to deliver new features and platform enhancements.',
    ],
    tech: [
      'React',
      'Vite',
      'Tailwind CSS',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Razorpay',
      'AWS',
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Projects                                                          */
/* ------------------------------------------------------------------ */
export const projects = [
  {
    name: 'AcreLoop CRM',
    category: 'Freelance',
    tagline: 'Multi-tenant CRM for real estate organizations',
    description:
      'A multi-tenant CRM platform designed for real estate organizations featuring lead management, analytics, reporting, follow-up tracking, role-based access control, and cloud deployment.',
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'AWS', 'Tailwind CSS'],
    features: [
      'Lead Management',
      'Team Management',
      'Analytics Dashboard',
      'Follow-up Tracking',
      'Role-Based Access Control',
      'Activity Tracking',
      'Sales Workflow Management',
      'Reporting Dashboard',
    ],
    contribution:
      'Designed and developed the CRM platform, implemented lead workflows, analytics systems, user roles and permissions, backend APIs, and cloud deployment infrastructure.',
    gradient: ['#2563eb', '#14b8a6'],
    // Public URLs — add when available. Omitted links render no button.
    live: null,
    website: null,
    note: 'Private client project',
  },
  {
    name: 'Gyankosha',
    category: 'EdTech Platform',
    tagline: 'Digital learning platform for school students',
    description:
      'An educational platform developed for school students, providing digital learning experiences, educational resources, and course access through a modern web application.',
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Razorpay'],
    features: [
      'Student Learning Portal',
      'User Authentication',
      'Content Management',
      'Course Access',
      'Responsive User Experience',
    ],
    contribution:
      'Worked on platform development, feature enhancements, backend services, frontend interfaces, and overall platform maintenance.',
    gradient: ['#8b5cf6', '#2563eb'],
    live: null,
    website: null,
    note: 'Live production platform',
  },
  {
    name: 'AEP Gyankosha',
    category: 'UPSC Learning Platform',
    tagline: 'Structured preparation platform for UPSC aspirants',
    description:
      'A specialized educational platform designed for UPSC aspirants, enabling students to access learning resources, educational content, and structured preparation materials.',
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Razorpay'],
    features: [
      'Learning Management System',
      'Student Authentication',
      'Content Delivery',
      'Enrollment Management',
      'Payment Integration',
    ],
    contribution:
      'Developed and maintained platform features, APIs, authentication systems, and payment-related workflows.',
    gradient: ['#14b8a6', '#2563eb'],
    live: null,
    website: null,
    note: 'Live production platform',
  },
  {
    name: 'Business Wisdom Gyankosha',
    category: 'EdTech Platform',
    tagline: 'Learning platform for MBA students & professionals',
    description:
      'A digital learning platform developed for MBA students and working professionals to access educational content, skill development resources, and professional learning programs.',
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Razorpay'],
    features: [
      'Course Management',
      'User Management',
      'Learning Content Access',
      'Enrollment System',
      'Payment Gateway Integration',
    ],
    contribution:
      'Built platform features, backend services, payment integration, and user-facing interfaces.',
    gradient: ['#f59e0b', '#ef4444'],
    live: null,
    website: null,
    note: 'Live production platform',
  },
]

/* ------------------------------------------------------------------ */
/*  Achievements                                                      */
/* ------------------------------------------------------------------ */
export const stats = [
  { value: 4, suffix: '+', label: 'Platforms Shipped' },
  { value: 2025, suffix: '', label: 'Professional Since', raw: true },
  { value: 100, suffix: '%', label: 'Cloud Deployed' },
  { value: 15, suffix: '+', label: 'Technologies' },
]

export const achievements = [
  'Professional Full Stack Developer since 2025.',
  'Developed and maintained multiple production-grade EdTech platforms.',
  'Built and deployed a multi-tenant CRM solution for real estate organizations.',
  'Integrated Razorpay payment systems for online transactions and enrollments.',
  'Developed scalable backend services and business applications.',
  'Managed cloud-hosted applications and production deployments.',
  'Delivered solutions used by students, professionals, and business teams.',
]
