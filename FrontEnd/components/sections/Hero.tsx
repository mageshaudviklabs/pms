
import React from 'react';
import { motion } from 'framer-motion';
import { SectionProps } from '../../types';
import { Heading, Text } from '../ui/Typography';
import { Button } from '../ui/Button';
import { FADE_UP, STAGGER_CONTAINER } from '../../constants/animations';

export const Hero: React.FC<SectionProps> = ({ id }) => {
  return (
    <section 
      id={id} 
      className="min-h-screen flex items-center pt-20 overflow-hidden relative"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left Column: Content */}
        <motion.div 
          variants={STAGGER_CONTAINER}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-6 z-10"
        >
          <motion.div variants={FADE_UP}>
            <Text variant="muted" className="text-accent-rose font-bold mb-2">
              Software Engineer Portfolio
            </Text>
            <Heading level={1} className="!mb-0 leading-[1.1]">
              Ketaki
            </Heading>
          </motion.div>

          <motion.div variants={FADE_UP}>
            <Heading level={2} className="text-accent-violet !mb-4 text-2xl md:text-3xl font-medium">
              Full Stack & Python Developer | AI & Data Science (2026)
            </Heading>
            <Text variant="secondary" className="max-w-lg text-lg">
              A final-year AI & Data Science student passionate about building clean, 
              scalable web applications using Python and modern web technologies.
            </Text>
          </motion.div>

          <motion.div 
            variants={FADE_UP}
            className="flex flex-wrap gap-4 mt-4"
          >
            <Button variant="primary">
              Download Resume
            </Button>
            <Button variant="secondary">
              GitHub
            </Button>
            <Button variant="secondary">
              LinkedIn
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Column: Abstract Visual Element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative hidden lg:flex items-center justify-center"
        >
          {/* Main glowing orb */}
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-accent-rose/20 to-accent-violet/20 blur-[80px]"
          />
          
          {/* Secondary smaller orbs for depth */}
          <motion.div 
            animate={{ 
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute w-64 h-64 top-0 right-0 rounded-full bg-accent-rose/10 blur-[60px]"
          />
          
          <motion.div 
            animate={{ 
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute w-64 h-64 bottom-0 left-0 rounded-full bg-accent-violet/10 blur-[60px]"
          />

          {/* Abstract geometric frame */}
          <div className="relative z-10 p-8 glass rounded-[2.5rem] border-white/5 shadow-2xl overflow-hidden aspect-square flex items-center justify-center w-[400px]">
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
             <div className="w-full h-full border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="w-[150%] h-[150%] opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle, #CBD5E1 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                  }}
                />
                <div className="absolute flex flex-col items-center gap-2">
                   <div className="w-16 h-1 bg-accent-rose rounded-full opacity-50" />
                   <div className="w-24 h-1 bg-accent-violet rounded-full opacity-50" />
                   <div className="w-12 h-1 bg-accent-rose rounded-full opacity-50" />
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Subtle bottom indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-text-muted font-bold">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-accent-rose/50 to-transparent" />
      </motion.div>
    </section>
  );
};
