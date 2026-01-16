
import React from 'react';
import { motion } from 'framer-motion';
import { SectionProps } from '../../types';
import { Heading, Text } from '../ui/Typography';
import { Card } from '../ui/Card';
import { FADE_UP, STAGGER_CONTAINER } from '../../constants/animations';

const aboutHighlights = [
  "Final-year AI & Data Science student",
  "Strong foundation in Python and full-stack web development",
  "Hands-on experience with Django, React, and REST APIs",
  "Developer of multiple real-world academic and personal projects",
  "Actively seeking internships or entry-level software roles"
];

export const About: React.FC<SectionProps> = ({ id }) => {
  return (
    <section id={id} className="py-32 border-t border-border-subtle/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={STAGGER_CONTAINER}
          className="flex flex-col gap-12"
        >
          <motion.div variants={FADE_UP}>
            <Text variant="muted" className="text-accent-rose font-bold mb-2">Introduction</Text>
            <Heading level={2}>About Me</Heading>
          </motion.div>

          <motion.div variants={FADE_UP}>
            <Card className="p-8 md:p-12">
              <div className="flex flex-col gap-6">
                {aboutHighlights.map((highlight, index) => (
                  <motion.div 
                    key={index}
                    variants={FADE_UP}
                    className="flex items-start gap-4 group"
                  >
                    <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-accent-rose flex-shrink-0 group-hover:scale-150 transition-transform duration-300" />
                    <Text variant="secondary" className="text-lg md:text-xl leading-relaxed text-text-primary">
                      {highlight}
                    </Text>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={FADE_UP} className="flex justify-center">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-border-subtle to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
