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
  | "Settings2";

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
  github: string;
  caseStudy?: string;
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
  role: "AI · ML · Generative AI Engineer",
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
  { value: "2", label: "Flagship LLM systems built", target: 2, decimals: 0, suffix: "" },
  { value: "4", label: "Professional roles across AI & data", target: 4, decimals: 0, suffix: "" },
  { value: "8.84", label: "Academic CGPA (Diploma)", target: 8.84, decimals: 2, suffix: "" },
];

export const skills: SkillGroup[] = [
  {
    title: "Languages",
    glyph: "⌘",
    icon: "Command",
    items: ["Python", "SQL"],
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
    items: ["LLMs", "Generative AI", "RAG", "Prompt Engineering", "LLM Automation"],
  },
  {
    title: "Frameworks",
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
    title: "Backend & APIs",
    glyph: "⚡",
    icon: "Zap",
    items: ["FastAPI", "REST APIs", "Streamlit", "React"],
  },
  {
    title: "Databases",
    glyph: "▦",
    icon: "Database",
    items: ["PostgreSQL", "MySQL", "SQL", "Vector Databases", "ChromaDB"],
  },
  {
    title: "Cloud / DevOps",
    glyph: "☁",
    icon: "Cloud",
    items: ["Docker", "Git"],
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
];

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
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#projects" },
  { label: "Contact", href: "#contact" },
];
