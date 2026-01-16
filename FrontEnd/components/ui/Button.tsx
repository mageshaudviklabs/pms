
import React from 'react';
import { motion } from 'framer-motion';
import { BaseComponentProps } from '../../types';
import { BUTTON_HOVER, BUTTON_TAP } from '../../constants/animations';

interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  type?: 'button' | 'submit';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick,
  type = 'button'
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-accent-violet focus:ring-offset-2 focus:ring-offset-background";
  
  const variants = {
    primary: "bg-gradient-to-r from-accent-rose to-accent-violet text-white shadow-lg shadow-accent-rose/20 hover:opacity-90",
    secondary: "border-2 border-border-subtle bg-transparent text-text-secondary hover:border-accent-rose hover:text-text-primary",
  };

  return (
    <motion.button
      type={type}
      whileHover={BUTTON_HOVER}
      whileTap={BUTTON_TAP}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};
