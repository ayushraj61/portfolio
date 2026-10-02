// ========================================
// CENTRALIZED PRODUCT DATA
// All products, experiments, and systems
// Easy to add future products without rewriting pages
// ========================================

export type ProductStatus = 'live' | 'building' | 'experiment' | 'ongoing' | 'concept';

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  expandedDescription?: string;
  whatItDoes?: string;
  technology?: string[];
  status: ProductStatus;
  url?: string;
  tags: string[];
  featured: boolean;
  order: number;
  themeColor?: string; // Hex for unique visual identity
}

export const products: Product[] = [
  {
    id: 'daknode',
    name: 'DakNode',
    category: 'AI Infrastructure',
    description: 'Email infrastructure for autonomous agents.',
    expandedDescription:
      'Building infrastructure that gives AI agents persistent email identities, inboxes, programmatic communication, events, and controlled access to email workflows. A developer-first API for agent communication.',
    whatItDoes: 'Designed to give autonomous agents a programmatic inbox and outbox with webhook events.',
    technology: ['Next.js', 'PostgreSQL', 'SMTP/IMAP integrations', 'Redis'],
    status: 'building',
    url: 'https://daknode.com',
    tags: ['AI Agents', 'Email Infrastructure', 'APIs', 'Webhooks', 'Developer Platform'],
    featured: true,
    order: 1,
    themeColor: '#d4a853', // Amber (Communication Station)
  },
  {
    id: 'hyperflow',
    name: 'HyperFlow Automation',
    category: 'AI Automation / B2B',
    description: 'A product company exploring AI-powered automation for business workflows.',
    expandedDescription:
      'Building automation systems that connect AI with the repetitive operational work businesses actually perform. Custom AI agents, automated pipelines, and intelligent software for sales, finance, and procurement.',
    whatItDoes: 'Automates manual back-office tasks using specialized AI agents.',
    technology: ['Python', 'LangChain', 'FastAPI', 'React'],
    status: 'ongoing',
    url: 'https://hyperflowautomation.in',
    tags: ['AI Automation', 'B2B', 'Enterprise', 'Workflows'],
    featured: true,
    order: 2,
    themeColor: '#6366f1', // Indigo (Business Hub)
  },
  {
    id: 'hyperflow-sales',
    name: 'HyperFlow Sales & Compliance AI',
    category: 'Enterprise AI',
    description:
      'Exploring a "Company Brain" that helps B2B teams automate RFPs, security questionnaires, vendor onboarding, and web-based forms.',
    expandedDescription:
      'Company knowledge → AI retrieval → grounded answers → document generation → web form automation. Designed for traceable, source-linked answers.',
    whatItDoes: 'Explores grounded answers and document workflows for enterprise questionnaires.',
    technology: ['Vector DBs', 'RAG', 'OpenAI API'],
    status: 'building',
    url: undefined,
    tags: ['RAG', 'Enterprise AI', 'Document Automation', 'Compliance'],
    featured: false,
    order: 3,
    themeColor: '#8b8fff', // Light Blue (Compliance)
  },
  {
    id: 'outlay',
    name: 'Outlay',
    category: 'Fintech / Business Software',
    description:
      'Software for automating business expenses, invoices, receipt processing, categorization, and finance workflows.',
    whatItDoes: 'Extracts data from receipts and invoices to automate bookkeeping.',
    technology: ['Next.js', 'OCR API', 'PostgreSQL'],
    status: 'live',
    url: 'https://outlay.site',
    tags: ['OCR', 'Finance Automation', 'SaaS', 'Business Software'],
    featured: false,
    order: 4,
    themeColor: '#10b981', // Emerald (Finance Environment)
  },
  {
    id: 'splitme',
    name: 'SplitMe',
    category: 'Consumer Product',
    description:
      'A simple way to split shared expenses and settle what people owe without unnecessary friction.',
    whatItDoes: 'Tracks group expenses and calculates the minimum number of transactions to settle up.',
    technology: ['React', 'Node.js', 'MongoDB'],
    status: 'live',
    url: 'https://splitme.site',
    tags: ['Payments', 'Consumer', 'WhatsApp', 'UPI'],
    featured: false,
    order: 5,
    themeColor: '#f43f5e', // Rose (Social/Consumer)
  },
  {
    id: 'outfund',
    name: 'OutFund',
    category: 'Fintech / Consumer',
    description:
      'A lightweight fundraising and payment-collection product focused on making online fundraisers simpler to create and share. AI-assisted payment verification.',
    whatItDoes: 'Creates fast, shareable fundraising pages with automated payment tracking.',
    technology: ['Next.js', 'Stripe/UPI integration'],
    status: 'live',
    url: 'https://outfund.site',
    tags: ['Fundraising', 'Payments', 'Consumer', 'AI Verification'],
    featured: false,
    order: 6,
    themeColor: '#a855f7', // Purple (Fundraising)
  },
  {
    id: 'statechat',
    name: 'StateChat',
    category: 'AI Product / Experiment',
    description:
      'An AI-powered conversational product exploring new interaction models for information retrieval and engagement.',
    whatItDoes: 'Tests conversational interfaces for exploring complex datasets.',
    technology: ['Next.js', 'LLMs', 'Vercel AI SDK'],
    status: 'experiment',
    url: 'https://statechat.onrender.com',
    tags: ['AI', 'Chat', 'Experiment'],
    featured: false,
    order: 7,
    themeColor: '#0ea5e9', // Sky Blue (AI/Product)
  },
];

// ========================================
// BUILDER'S PATH — Journey stages
// ========================================

export interface PathStage {
  number: string;
  title: string;
  label: string;
  description: string;
  state: 'completed' | 'current' | 'future';
  futureStatus?: string;
}

export const builderPath: PathStage[] = [
  {
    number: '01',
    title: 'Software Engineering',
    label: 'Foundation',
    description: 'Learning to build reliable software systems. Backend, APIs, databases, deployment.',
    state: 'completed',
  },
  {
    number: '02',
    title: 'AI Backend Engineering',
    label: 'Focus',
    description:
      'Combining backend architecture with AI models, agents, retrieval, and automation.',
    state: 'current',
  },
  {
    number: '03',
    title: 'FDE / Customer Engineering',
    label: 'Future direction',
    description:
      'I want to work closer to users, understand ambiguous problems, and turn them into working technical solutions.',
    state: 'future',
    futureStatus: 'Working toward',
  },
  {
    number: '04',
    title: 'AI Founder',
    label: 'Long-term ambition',
    description:
      'My longer-term ambition is to build products and companies around useful AI systems.',
    state: 'future',
    futureStatus: 'Long-term goal',
  },
];

// ========================================
// TECH STACK — Grouped meaningfully
// ========================================

export interface TechGroup {
  title: string;
  items: string[];
}

export const techStack: TechGroup[] = [
  {
    title: 'Backend',
    items: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Celery', 'REST APIs'],
  },
  {
    title: 'AI',
    items: ['LLMs', 'RAG', 'AI Agents', 'Prompt Engineering', 'Evaluation', 'AI Integrations'],
  },
  {
    title: 'Infrastructure',
    items: ['Docker', 'Nginx', 'Cloud Deployment', 'Webhooks', 'Queues', 'MinIO'],
  },
  {
    title: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind'],
  },
];

// ========================================
// EXPERIENCE — Mission Log
// ========================================

export interface ExperienceBullet {
  text: string;
  highlight?: string;
}

export interface ExperienceRole {
  number: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  tags: string[];
  bullets: ExperienceBullet[];
}

export const experienceData: ExperienceRole[] = [
  {
    number: '01',
    company: 'b3 Solutions Pvt Ltd',
    role: 'AI Developer Intern',
    duration: 'Sep 2025 – Apr 2026',
    location: 'Chandigarh, India',
    tags: ['FastAPI', 'Celery', 'React', 'PostgreSQL', 'Redis', 'MinIO', 'Docker', 'GCP'],
    bullets: [
      {
        text: 'Built a document automation platform processing thousands of invoices/month — full backend with FastAPI, Celery, React, and PostgreSQL.',
      },
      {
        text: 'Designed a multi-stage OCR pipeline (PyMuPDF → pdfplumber → Tesseract) with per-supplier Strategy-pattern parsers.',
        highlight: '90% extraction accuracy',
      },
      {
        text: 'Built async processing with Celery + Redis for classification and duplicate detection.',
        highlight: 'Cut duplicates by 99%',
      },
      {
        text: 'Replaced third-party cloud storage with self-hosted MinIO (S3-compatible).',
        highlight: 'Saved $300/month',
      },
      {
        text: 'Deployed the containerized stack on a GCP Compute Engine VM using Docker Compose with Nginx reverse proxy for production.',
      },
    ],
  },
  {
    number: '02',
    company: 'RDSO, Indian Railway',
    role: 'Python Developer Intern',
    duration: 'Jun 2025 – Jul 2025',
    location: 'Lucknow, India',
    tags: ['Python', 'Django', 'PostgreSQL', 'Automation'],
    bullets: [
      {
        text: 'Developed a custom automated Word document generator for standardized railway reports.',
        highlight: '90%+ faster report generation',
      },
      {
        text: 'Implemented dynamic table formatting with styling, zebra-striping, and template rendering for customizable reports.',
      },
      {
        text: 'Gained hands-on experience in backend development with Django and web application design with PostgreSQL integration.',
      },
    ],
  },
];

// ========================================
// ENGINEERING CREDIBILITY
// ========================================

export const engineeringCapabilities: string[] = [
  'Reliability',
  'Database Design',
  'Async Processing',
  'Queue Systems',
  'API Design',
  'OCR Pipelines',
  'Caching',
  'Concurrency',
  'Deployment',
  'Security Boundaries',
  'Observability',
];

// ========================================
// CONTACT & SOCIAL
// ========================================

export const socialLinks = {
  email: 'ayushraj613718@gmail.com',
  linkedin: 'https://www.linkedin.com/in/ayush-raj-95849927b/',
  github: '#', // Add GitHub URL when available
  resume: 'https://drive.google.com/file/d/19vbVAkoaF8ye3-N6ep46o3XGMCLADBWN/view?usp=sharing&usp=embed_facebook',
};
