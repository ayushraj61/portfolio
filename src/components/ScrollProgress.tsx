'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

// ========================================
// SCROLL PROGRESS — Top bar showing journey progress
// Subtle visual indicator of scroll position
// ========================================

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
