import { Variants, TargetAndTransition } from 'framer-motion';

// Explicitly typing these constants ensures that easing strings like "easeInOut" 
// are correctly identified as valid framer-motion Easing types instead of generic strings.

export const FADE_UP: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  // The transition is stored here for flexibility; cast to any to allow it within the Variants type structure
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as any
};

export const STAGGER_CONTAINER: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    }
  }
};

export const BUTTON_HOVER: TargetAndTransition = {
  scale: 1.02,
  transition: { duration: 0.2, ease: "easeInOut" }
};

export const BUTTON_TAP: TargetAndTransition = {
  scale: 0.98
};

export const CARD_HOVER: TargetAndTransition = {
  y: -4,
  transition: { duration: 0.3, ease: "easeOut" }
};