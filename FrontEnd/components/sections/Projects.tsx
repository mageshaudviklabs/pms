
import React from 'react';
import { motion } from 'framer-motion';
import { SectionProps } from '../../types';
import { Heading, Text } from '../ui/Typography';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FADE_UP, STAGGER_CONTAINER } from '../../constants/animations';

interface Project {
  title: string;
  label?: string;
  description: string;
  tech: string[];
  github?: string;
  category: 'Full Stack' | 'AI & Python' | 'Android' | 'Security';
  isFeatured?: boolean;
}

const projects: Project[] = [
  {
    title: "AI Threat Detection System",
    label: "Final-Year Project (In Progress)",
    description: "A full-stack AI-driven security monitoring platform designed to detect, classify, and alert on potential cyber threats.",
    tech: ["React.js", "TypeScript", "Tailwind CSS", "Django REST Framework", "PostgreSQL"],
    github: "unveilthreatai",
    category: "Security",
    isFeatured: true
  },
  {
    title: "E-Book Store Website",
    description: "Full-stack e-commerce web application with secure payment integration and user account management.",
    tech: ["Django", "HTML", "CSS", "Razorpay", "MySQL"],
    github: "#",
    category: "Full Stack"
  },
  {
    title: "Attendance Management System (RFID)",
    description: "Automated tracking system with admin dashboard and RFID hardware integration for academic environments.",
    tech: ["Django", "Python", "HTML", "CSS", "SQLite"],
    github: "#",
    category: "Full Stack"
  },
  {
    title: "HealthBot",
    description: "Conversational AI chatbot for medical and wellness queries with secure session handling and chat history.",
    tech: ["Python", "Streamlit", "LLM APIs"],
    github: "healthbot",
    category: "AI & Python"
  },
  {
    title: "Credit Card Fraud Detection",
    description: "Machine learning model trained on real-world transaction data to classify and visualize fraudulent activities.",
    tech: ["Python", "Pandas", "NumPy", "Scikit-Learn"],
    github: "#",
    category: "AI & Python"
  },
  {
    title: "Cricbuzz Live Android App",
    description: "Android application for real-time cricket scores and match statistics with a modern, smooth UI.",
    tech: ["Kotlin", "Jetpack Compose", "MVVM", "REST APIs"],
    github: "cricbuzz-live-android",
    category: "Android"
  },
  {
    title: "Online Course Management",
    description: "Java-based web application featuring role-based dashboards for students and instructors.",
    tech: ["Java", "JSP", "MySQL"],
    github: "#",
    category: "Full Stack"
  }
];

const ProjectCard: React.FC<{ project: Project; featured?: boolean }> = ({ project, featured }) => {
  return (
    <motion.div variants={FADE_UP} className={featured ? "lg:col-span-2 xl:col-span-3" : ""}>
      <Card className={`h-full flex flex-col gap-6 relative overflow-hidden group ${featured ? 'border-accent-rose/40 ring-1 ring-accent-rose/10' : ''}`}>
        {/* Glow effect for featured project */}
        {featured && (
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-rose/10 blur-[60px] pointer-events-none" />
        )}
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              {project.label && (
                <span className="text-[10px] uppercase tracking-widest text-accent-rose font-bold">
                  {project.label}
                </span>
              )}
              <Heading level={featured ? 2 : 3} className="!mb-0">
                {project.title}
              </Heading>
            </div>
            <span className="px-3 py-1 rounded-full bg-accent-violet/10 border border-accent-violet/20 text-accent-violet text-[10px] font-bold uppercase tracking-wider">
              {project.category}
            </span>
          </div>

          <Text variant="secondary" className={featured ? "text-lg max-w-3xl" : "text-sm"}>
            {project.description}
          </Text>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span key={t} className="px-2 py-1 rounded bg-background border border-border-subtle text-text-muted text-[11px] font-mono">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <Button 
            variant="secondary" 
            className="!py-2 !px-4 text-xs" 
            onClick={() => window.open(project.github === '#' ? '#' : `https://github.com/${project.github}`, '_blank')}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            GitHub
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export const Projects: React.FC<SectionProps> = ({ id }) => {
  const featuredProject = projects.find(p => p.isFeatured);
  const otherProjects = projects.filter(p => !p.isFeatured);

  return (
    <section id={id} className="py-32 border-t border-border-subtle/30">
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={STAGGER_CONTAINER}
        className="flex flex-col gap-12"
      >
        <motion.div variants={FADE_UP}>
          <Text variant="muted" className="text-accent-rose font-bold mb-2">Portfolio</Text>
          <Heading level={2}>Projects</Heading>
        </motion.div>

        {/* Featured Project */}
        {featuredProject && (
          <div className="mb-8">
            <ProjectCard project={featuredProject} featured />
          </div>
        )}

        {/* Supporting Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherProjects.map((project, idx) => (
            <ProjectCard key={idx} project={project} />
          ))}
        </div>

        {/* Optional Data Project Note */}
        <motion.div variants={FADE_UP} className="flex flex-col items-center gap-6 mt-8">
          <div className="px-6 py-3 rounded-2xl bg-background-card/40 border border-border-subtle/50">
            <Text variant="muted" className="text-center text-xs italic tracking-wider">
              Additional Data Project: Attendance Data Analysis System (SQL, Django, Python)
            </Text>
          </div>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-border-subtle to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};
