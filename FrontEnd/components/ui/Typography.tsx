
import React from 'react';
import { BaseComponentProps } from '../../types';

export const Heading: React.FC<BaseComponentProps & { level?: 1 | 2 | 3 }> = ({ 
  children, 
  level = 1, 
  className = '' 
}) => {
  const baseStyles = "font-bold tracking-tight text-text-primary";
  const levels = {
    1: "text-4xl md:text-6xl mb-6",
    2: "text-3xl md:text-4xl mb-4",
    3: "text-xl md:text-2xl mb-3",
  };

  // Fix: Explicitly type the dynamic Tag to avoid JSX namespace and call signature errors.
  // Using a union of valid heading strings ensures TypeScript treats it as an intrinsic element.
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
  return <Tag className={`${baseStyles} ${levels[level]} ${className}`}>{children}</Tag>;
};

export const Text: React.FC<BaseComponentProps & { variant?: 'body' | 'secondary' | 'muted' }> = ({ 
  children, 
  variant = 'body', 
  className = '' 
}) => {
  const variants = {
    body: "text-base text-text-primary leading-relaxed",
    secondary: "text-base text-text-secondary leading-relaxed",
    muted: "text-sm text-text-muted font-medium uppercase tracking-wider",
  };

  return <p className={`${variants[variant]} ${className}`}>{children}</p>;
};
