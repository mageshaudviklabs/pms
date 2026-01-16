
import React from 'react';
import { motion } from 'framer-motion';
import { SectionProps } from '../../types';
import { Heading, Text } from '../ui/Typography';
import { Card } from '../ui/Card';
import { FADE_UP, STAGGER_CONTAINER } from '../../constants/animations';

interface SkillGroup {
  category: string;
  skills: string[];
}

const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    skills: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"]
  },
  {
    category: "Backend",
    skills: ["Python", "Django", "Django REST Framework"]
  },
  {
    category: "Mobile Development",
    skills: ["Kotlin", "Jetpack Compose", "MVVM Architecture"]
  },
  {
    category: "Databases",
    skills: ["MySQL", "PostgreSQL", "SQLite"]
  },
  {
    category: "Other Tools & Concepts",
    skills: ["Git", "GitHub", "Linux", "REST APIs", "Authentication & Role-Based Access"]
  }
];

export const Skills: React.FC<SectionProps> = ({ id }) => {
  return (
    <section id={id} className="py-32 border-t border-border-subtle/30">
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={STAGGER_CONTAINER}
        className="flex flex-col gap-12"
      >
        {/* Header */}
        <motion.div variants={FADE_UP} className="flex flex-col gap-2">
          <Text variant="muted" className="text-accent-rose font-bold">Technical Proficiency</Text>
          <Heading level={2}>Skills</Heading>
        </motion.div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillGroups.map((group) => (
            <motion.div key={group.category} variants={FADE_UP}>
              <Card className="h-full flex flex-col gap-5 group">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-accent-violet rounded-full group-hover:bg-accent-rose transition-colors duration-300" />
                  <Heading level={3} className="!mb-0 text-lg font-semibold">
                    {group.category}
                  </Heading>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-background border border-border-subtle text-text-secondary text-sm font-medium hover:border-accent-rose/30 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div 
          variants={FADE_UP} 
          className="mt-4 flex flex-col items-center gap-4"
        >
          <div className="px-5 py-2 rounded-xl bg-background-card/50 border border-border-subtle/50">
            <Text variant="muted" className="text-center text-xs italic tracking-wider lowercase">
              AI / ML – academic & project-based exposure
            </Text>
          </div>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-border-subtle to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};
