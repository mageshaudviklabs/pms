
import React from 'react';
import { motion } from 'framer-motion';
import { Heading, Text } from './Typography';
import { Button } from './Button';
import { Card } from './Card';
import { FADE_UP, STAGGER_CONTAINER } from '../../constants/animations';

export const DesignSystemPreview: React.FC = () => {
  return (
    <motion.div 
      variants={STAGGER_CONTAINER}
      initial="initial"
      animate="animate"
      className="py-20 space-y-24"
    >
      {/* Typography Section */}
      <motion.section variants={FADE_UP} className="space-y-6">
        <div className="flex flex-col gap-2">
           <Text variant="muted">Typography System</Text>
           <Heading level={1}>Modern & Professional</Heading>
        </div>
        <div className="max-w-2xl space-y-4">
          <Heading level={2}>Sub-heading Style</Heading>
          <Text variant="secondary">
            Our design system leverages the Inter typeface to ensure high readability and a clean, 
            sophisticated aesthetic. It balances professional structure with subtle feminine accents.
          </Text>
          <Heading level={3}>Minor Heading / Label</Heading>
          <Text variant="muted">This is an example of helper or metadata text.</Text>
        </div>
      </motion.section>

      {/* Interactive Elements Section */}
      <motion.section variants={FADE_UP} className="space-y-8">
        <Text variant="muted">Interactive Components</Text>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Action</Button>
          <Button variant="secondary">Secondary Action</Button>
        </div>
      </motion.section>

      {/* Card Layout Section */}
      <motion.section variants={FADE_UP} className="space-y-8">
        <Text variant="muted">Cards & Layout</Text>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-rose to-accent-violet flex items-center justify-center text-white font-bold">
                0{i}
              </div>
              <Heading level={3}>Project Title 0{i}</Heading>
              <Text variant="secondary">
                A brief description showing how text sits within our card component with balanced padding and spacing.
              </Text>
              <div className="mt-auto pt-4 flex gap-2">
                <span className="px-2 py-1 rounded bg-accent-rose/10 text-accent-rose text-xs font-bold uppercase tracking-tighter">React</span>
                <span className="px-2 py-1 rounded bg-accent-violet/10 text-accent-violet text-xs font-bold uppercase tracking-tighter">Vite</span>
              </div>
            </Card>
          ))}
        </div>
      </motion.section>

      {/* Animation Validation */}
      <motion.section 
        variants={FADE_UP}
        className="p-12 glass rounded-3xl text-center border-accent-rose/20"
      >
        <Heading level={2} className="bg-gradient-to-r from-accent-rose via-accent-violet to-accent-rose bg-clip-text text-transparent">
          Feminine. Modern. Technical.
        </Heading>
        <Text variant="secondary" className="max-w-xl mx-auto">
          The system is now fully initialized with a unified palette, standardized typography, 
          and professional animation presets.
        </Text>
      </motion.section>
    </motion.div>
  );
};
