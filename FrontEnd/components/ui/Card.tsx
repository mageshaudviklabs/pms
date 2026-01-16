
import React from 'react';
import { motion } from 'framer-motion';
import { BaseComponentProps } from '../../types';
import { CARD_HOVER } from '../../constants/animations';

export const Card: React.FC<BaseComponentProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      whileHover={CARD_HOVER}
      className={`p-6 rounded-2xl bg-background-card border border-border-subtle hover:border-accent-rose/30 transition-colors shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
};
