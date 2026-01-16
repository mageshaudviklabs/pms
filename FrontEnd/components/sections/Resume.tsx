
import React from 'react';
import { SectionProps } from '../../types';
import { Heading } from '../ui/Typography';

export const Resume: React.FC<SectionProps> = ({ id }) => {
  return (
    <section id={id} className="py-32 flex items-center justify-center border-t border-border-subtle/50">
      <Heading level={2} className="text-center opacity-20 uppercase tracking-[0.1em]">Resume Section</Heading>
    </section>
  );
};
