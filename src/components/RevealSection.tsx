import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  immediate?: boolean;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function RevealSection({
  children,
  className,
  delay = 0,
  yOffset = 20,
  immediate = false,
}: RevealSectionProps) {
  if (immediate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: yOffset }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, delay, ease: EASE_OUT_EXPO }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.45, delay, ease: EASE_OUT_EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
