/**
 * SYNAPSE — single source of truth for all portfolio content.
 * Copy is ported verbatim from prototype.html.
 * Every section consumes this typed module; do not hardcode copy elsewhere.
 */

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export interface Socials {
  github: string;
  linkedin: string;
  hackerrank: string;
  linktree: string;
}

export interface Personal {
  name: string;
  role: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  available: boolean;
  resumeUrl: string;
  socials: Socials;
}

export interface Stat {
  value: string;
  label: string;
  /** numeric target used by the animated counter (parsed from `value`) */
  target: number;
  /** decimal places the counter should render */
  decimals: number;
  /** suffix appended after the count finishes (e.g. "+") */
  suffix: string;
}

/** lucide-react icon name — see https://lucide.dev/icons */
export type LucideIconName =
  | "Command"
  | "Brain"
  | "Sparkles"
  | "LayoutGrid"
  | "Zap"
  | "Database"
  | "Cloud"
  | "Settings2"
  | "Layers"
  | "Smartphone"
  | "Rocket";

export interface SkillGroup {
  title: string;
  /** original prototype glyph (kept for exact visual parity if desired) */
  glyph: string;
  /** mapped lucide-react icon name for the component build */
  icon: LucideIconName;
  items: string[];
}

export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  period: string;
  /** optional sub-brands the role spans (rendered as chips) */
  group?: string[];
  bullets: string[];
}

export interface Project {
  number: string;
  title: string;
  description: string;
  tech: string[];
  /** public repo link; omit for private/NDA work */
  github?: string;
  caseStudy?: string;
  /** short label rendered as a pill, e.g. "Enterprise · Private", "Web + Mobile" */
  tag?: string;
}

export interface ServiceEntry {
  title: string;
  glyph: string;
  icon: LucideIconName;
  description: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company?: string;
}

export interface EducationEntry {
  years: string;
  title: string;
  institution: string;
  meta: string;
  /** optional honours specialization, rendered as a highlighted badge */
  honors?: string;
}

export interface Achievement {
  glyph: string;
  title: string;
  description: string;
  /** optional external proof link (e.g. HackerRank badge, certificate) */
  href?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

/* ------------------------------------------------------------------ */
/* Data                                                               */
/* ------------------------------------------------------------------ */

export const personal: Personal = {
  name: "Sushant Choudhary",
  role: "AI · Full-Stack · Generative AI Engineer",
  tagline:
    "I build LLM systems, RAG pipelines and AI automation that ship to production — from firewall log intelligence to enterprise knowledge assistants.",
  email: "sushantchoudhary912@gmail.com",
  phone: "+91-8278550628",
  location: "New Delhi, India",
  available: true,
  resumeUrl: "/Sushant_Choudhary_Resume.pdf",
  socials: {
    github: "https://github.com/sushantzd",
    linkedin: "https://www.linkedin.com/in/sushantzd",
    hackerrank: "https://www.hackerrank.com/sushantzd",
    linktree: "https://linktr.ee/sushantzd",
  },
};

export const stats: Stat[] = [
  { value: "1+", label: "Years shipping production AI", target: 1, decimals: 0, suffix: "+" },
  { value: "7", label: "Production systems shipped", target: 7, decimals: 0, suffix: "" },
  { value: "4", label: "Professional roles across AI & data", target: 4, decimals: 0, suffix: "" },
  { value: "8.84", label: "Academic CGPA (Diploma)", target: 8.84, decimals: 2, suffix: "" },
];

export const skills: SkillGroup[] = [
  {
    title: "Languages",
    glyph: "⌘",
    icon: "Command",
    items: ["Python", "SQL", "JavaScript", "TypeScript"],
  },
  {
    title: "AI / ML",
    glyph: "◈",
    icon: "Brain",
    items: [
      "Machine Learning",
      "Deep Learning",
      "NLP",
      "Computer Vision",
      "Transformers",
      "OpenCV",
      "Statistics",
      "Feature Engineering",
      "EDA",
    ],
  },
  {
    title: "LLM & GenAI",
    glyph: "✦",
    icon: "Sparkles",
    items: [
      "LLMs",
      "Generative AI",
      "RAG",
      "Prompt Engineering",
      "LLM Automation",
      "Azure OpenAI",
      "Google Gemini",
      "Multi-Model Orchestration",
    ],
  },
  {
    title: "Frontend",
    glyph: "▥",
    icon: "Layers",
    items: ["React", "Next.js", "Vue.js", "Tailwind CSS", "shadcn/ui", "Radix UI"],
  },
  {
    title: "Backend & APIs",
    glyph: "⚡",
    icon: "Zap",
    items: ["FastAPI", "Node.js", "Express", "Flask", "REST APIs", "NextAuth", "Streamlit"],
  },
  {
    title: "ML Frameworks",
    glyph: "▤",
    icon: "LayoutGrid",
    items: [
      "PyTorch",
      "TensorFlow",
      "scikit-learn",
      "Hugging Face",
      "XGBoost",
      "LangChain",
      "NumPy",
      "Pandas",
      "Matplotlib",
    ],
  },
  {
    title: "Databases",
    glyph: "▦",
    icon: "Database",
    items: ["PostgreSQL", "MySQL", "SQL Server", "SQLite", "Vector Databases", "ChromaDB"],
  },
  {
    title: "Cloud / DevOps",
    glyph: "☁",
    icon: "Cloud",
    items: ["Docker", "Git", "AWS S3", "Vite"],
  },
  {
    title: "Tools & LLM Ops",
    glyph: "⚙",
    icon: "Settings2",
    items: ["n8n", "Jupyter", "Claude CLI", "Claude Opus 4.5", "Ollama"],
  },
];

export const experience: ExperienceEntry[] = [
  {
    role: "AI Automation Engineer",
    company: "Modi Enterprise",
    location: "New Delhi · Group operations",
    period: "Sep 2025 — Present",
    group: ["Colorbar", "Godfrey Phillips", "Modicare", "Indofil Industries"],
    bullets: [
      "Designed and deployed AI automation pipelines for firewall log analysis and customer feedback processing using Python and LangChain-based LLM workflows.",
      "Built automated classification, sentiment analysis and real-time alerting systems integrating LLM APIs, REST services and Telegram bot notifications.",
      "Implemented workflow orchestration with n8n to process and route operational data in near real time.",
    ],
  },
  {
    role: "Data Scientist",
    company: "Pinnacle Corporation",
    location: "Remote",
    period: "Mar 2025 — Sep 2025",
    bullets: [
      "Developed ML models for clustering and forecasting on sales and healthcare datasets using Python and scikit-learn.",
      "Built end-to-end data pipelines including preprocessing, feature engineering, model training and reporting automation.",
    ],
  },
  {
    role: "Machine Learning Engineer",
    company: "Cognifyz Technologies",
    location: "Remote",
    period: "Jul 2024 — Aug 2024",
    bullets: [
      "Built a content-based restaurant recommendation system over a 9,500+ restaurant dataset using TF-IDF vectorization and cosine similarity to surface similar venues from user preferences.",
      "Engineered the feature pipeline and evaluation in Python with Pandas and scikit-learn, from data cleaning through similarity scoring.",
    ],
  },
  {
    role: "Internship Trainee",
    company: "Amar Ujala",
    location: "Meerut",
    period: "Jul 2023",
    bullets: [
      "Developed optimized SQL queries and automated reporting pipelines for internal dashboards, improving data accuracy and reducing manual reporting.",
    ],
  },
];

export const projects: Project[] = [
  {
    number: "01",
    title: "Firewall Network Usage Monitoring & AI Log Intelligence",
    description:
      "An AI pipeline that ingests Fortinet firewall logs via REST APIs, applies LLM-based analysis to classify events, detect anomalies and flag high-risk security incidents — then generates structured summaries and real-time alerts.",
    tech: ["Python", "REST APIs", "JSON", "OpenAI API", "n8n", "Telegram API"],
    github: "https://github.com/sushantzd",
    caseStudy: "#",
  },
  {
    number: "02",
    title: "Enterprise Knowledge Assistant using RAG",
    description:
      "A RAG-based chatbot for querying enterprise documents and PDFs. Implements document ingestion, semantic chunking, embedding generation and vector retrieval — with MMR search and metadata filtering for high-quality multi-document answers.",
    tech: ["Python", "LangChain", "ChromaDB", "OpenAI API", "Vector Embeddings"],
    github: "https://github.com/sushantzd",
    caseStudy: "#",
  },
  {
    number: "03",
    title: "Enterprise Payment Reconciliation Platform",
    description:
      "A Next.js platform that ingests monthly payment-gateway data (80K+ row Excel files), runs multi-module SQL reconciliation across wallets, invoices and settlements, and streams live run status with exportable reports and dashboards.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind", "MSSQL", "NextAuth", "Recharts", "ExcelJS"],
    tag: "Enterprise · Private",
  },
  {
    number: "04",
    title: "Multi-Model Creative AI Studio",
    description:
      "A content-generation studio that orchestrates multiple LLMs (Azure OpenAI + Gemini) with load balancing to produce platform-specific marketing copy and AI imagery through an automated critique-and-refine loop.",
    tech: ["React", "FastAPI", "SQLAlchemy", "Azure OpenAI", "Gemini", "Zustand", "TanStack Query"],
    tag: "Client work",
  },
  {
    number: "05",
    title: "Role-Based Media Asset Platform",
    description:
      "A full-stack media library with granular role-based access control, JWT auth, server-side thumbnail and video processing (ffmpeg, sharp) and S3-backed delivery for large creative teams.",
    tech: ["Vue 3", "Quasar", "Express", "MSSQL", "AWS S3", "JWT", "ffmpeg"],
    tag: "Full-stack",
  },
  {
    number: "06",
    title: "Digital Signage Platform — Web CMS + Android Player",
    description:
      "An end-to-end signage system: a Flask CMS with 2FA, playlist scheduling and device-fleet monitoring, paired with a native Android (Jetpack Compose + ExoPlayer) kiosk player featuring offline caching and crash recovery.",
    tech: ["Flask", "SQLite", "boto3", "Kotlin", "Jetpack Compose", "ExoPlayer", "WorkManager"],
    tag: "Web + Mobile",
  },
  {
    number: "07",
    title: "Store Feedback Sentiment Intelligence",
    description:
      "An internal tool that analyzes customer comments per retail store and date, classifying sentiment and generating concise 3-line positive / negative summaries with NLP and LLM summarization.",
    tech: ["Python", "NLP", "Sentiment Analysis", "LLM Summarization", "Pandas"],
    tag: "Internal · Private",
  },
];

export const services: ServiceEntry[] = [
  {
    title: "AI & LLM Systems",
    glyph: "✦",
    icon: "Sparkles",
    description:
      "RAG assistants, LLM automation, multi-model pipelines and AI-powered internal tools — designed, built and shipped to production.",
  },
  {
    title: "Full-Stack Web Apps",
    glyph: "▥",
    icon: "Layers",
    description:
      "End-to-end platforms with React / Next.js front-ends, secure auth, dashboards and REST + SQL back-ends.",
  },
  {
    title: "Automation & Data",
    glyph: "⚡",
    icon: "Zap",
    description:
      "Workflow automation, data pipelines, reconciliation systems and reporting that remove hours of manual work.",
  },
  {
    title: "Dashboards & Internal Tools",
    glyph: "▦",
    icon: "LayoutGrid",
    description:
      "Reporting dashboards, admin panels, CMS and role-based internal tools — including content and digital-signage platforms — that teams rely on daily.",
  },
];

/**
 * Testimonials render ONLY when this array is non-empty — no placeholder
 * quotes ship to production. Add real quotes here to switch the section on,
 * e.g.:
 *   {
 *     quote: "Sushant shipped our reconciliation portal weeks ahead of schedule.",
 *     name: "Jane Doe",
 *     role: "Finance Lead",
 *     company: "Acme Retail",
 *   }
 * When you enable this, renumber section eyebrows: Testimonials 07, Education 08,
 * Achievements 09, Contact 10 (see the plan's numbering note).
 */
export const testimonials: Testimonial[] = [];

export const education: EducationEntry[] = [
  {
    years: "2022 — 2025",
    title: "B.Tech · Electronics & Communication",
    institution: "Deenbandhu Chhotu Ram University of Science & Technology (DCRUST)",
    meta: "Murthal, Sonipat",
    honors: "Honours in Artificial Intelligence & Machine Learning",
  },
  {
    years: "2019 — 2022",
    title: "Diploma · Electrical Engineering",
    institution: "Ch. Devi Lal Government Polytechnic College",
    meta: "Sirsa, Haryana · CGPA 8.84",
  },
];

export const achievements: Achievement[] = [
  {
    glyph: "🏅",
    title: "SQL Gold Badge",
    description: "HackerRank — advanced SQL problem-solving",
    href: "https://www.hackerrank.com/sushantzd",
  },
  {
    glyph: "🐍",
    title: "Python (Basic) Certificate",
    description: "HackerRank — verified Python proficiency",
    href: "https://www.hackerrank.com/certificates/485824bc5ef9",
  },
  {
    glyph: "🎓",
    title: "ML Training — IIT Roorkee",
    description: "1-week project-based Machine Learning program",
  },
  {
    glyph: "📜",
    title: "ML Certificate — Udemy",
    description: "ML algorithms & practical applications (Krish Naik)",
  },
];

export const navLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#projects" },
  { label: "Contact", href: "#contact" },
];
