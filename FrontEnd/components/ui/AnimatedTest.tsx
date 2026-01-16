
import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedTest: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 1.2, 
        ease: [0.16, 1, 0.3, 1], // Custom cubic bezier for a premium feel
        delay: 0.2 
      }}
      className="p-12 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm text-center shadow-2xl"
    >
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
        Framework Initialized
      </h1>
      <div className="flex items-center justify-center gap-4 text-zinc-400 font-medium">
        <span className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          Vite + React
        </span>
        <span className="w-px h-4 bg-zinc-800" />
        <span className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          TypeScript
        </span>
        <span className="w-px h-4 bg-zinc-800" />
        <span className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          Framer Motion
        </span>
      </div>
    </motion.div>
  );
};
