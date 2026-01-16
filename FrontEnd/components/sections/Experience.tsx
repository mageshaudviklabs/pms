
import React from 'react';
import { motion } from 'framer-motion';
import { SectionProps } from '../../types';
import { Heading, Text } from '../ui/Typography';
import { Card } from '../ui/Card';
import { FADE_UP, STAGGER_CONTAINER } from '../../constants/animations';

export const Experience: React.FC<SectionProps> = ({ id }) => {
  return (
    <section id={id} className="py-32 border-t border-border-subtle/30">
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={STAGGER_CONTAINER}
        className="flex flex-col gap-12"
      >
        {/* Section Header */}
        <motion.div variants={FADE_UP}>
          <Text variant="muted" className="text-accent-rose font-bold mb-2">Professional Background</Text>
          <Heading level={2}>Experience & Certifications</Heading>
        </motion.div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Experience Column */}
          <motion.div variants={FADE_UP} className="flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <Heading level={3} className="!mb-0 text-xl text-accent-violet">Experience</Heading>
              <div className="h-px flex-grow bg-border-subtle/50" />
            </div>

            <Card className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Heading level={3} className="!mb-0 text-lg">RPA Intern</Heading>
                <Text variant="muted" className="text-xs font-bold tracking-widest text-accent-rose">ProAzure Technologies</Text>
              </div>
              
              <ul className="flex flex-col gap-3">
                <li className="flex gap-3">
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-border-subtle flex-shrink-0" />
                  <Text variant="secondary" className="text-sm">
                    Worked on automation workflows using Python and enterprise tools.
                  </Text>
                </li>
                <li className="flex gap-3">
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-border-subtle flex-shrink-0" />
                  <Text variant="secondary" className="text-sm">
                    Gained hands-on exposure to real-world business process automation.
                  </Text>
                </li>
              </ul>
            </Card>
          </motion.div>

          {/* Certifications Column */}
          <motion.div variants={FADE_UP} className="flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-2">
              <Heading level={3} className="!mb-0 text-xl text-accent-violet">Certifications</Heading>
              <div className="h-px flex-grow bg-border-subtle/50" />
            </div>

            <div className="flex flex-col gap-4">
              {[
                "NPTEL – Python for Data Science",
                "Software Testing Certification"
              ].map((cert, index) => (
                <Card key={index} className="p-5 flex items-center justify-between group">
                  <Text variant="body" className="font-medium group-hover:text-accent-rose transition-colors">
                    {cert}
                  </Text>
                  <svg className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Card>
              ))}
            </div>
          </motion.div>

        </div>

        <motion.div variants={FADE_UP} className="flex justify-center mt-8">
           <div className="h-px w-24 bg-gradient-to-r from-transparent via-border-subtle to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};
