
import React from 'react';
import { BaseComponentProps } from '../../types';
import { Navbar } from './Navbar';

export const MainLayout: React.FC<BaseComponentProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-background text-foreground selection:bg-white selection:text-black ${className}`}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
        {children}
      </main>
    </div>
  );
};
