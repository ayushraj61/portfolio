'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

// ========================================
// SECTION WRAPPER — "Destinations Approaching"
// Per DESIGN.txt §25: sections should feel like
// destinations being approached by the spaceship
// 
// Each section scales up from distance, fades in,
// with cinematic easing — like approaching a space station
// ========================================

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  /** Stronger approach effect for major "destinations" */
  isDestination?: boolean;
}

export default function SectionWrapper({
  children,
  className = '',
  id,
  delay = 0,
  isDestination = false,
  atmosphereColor,
}: SectionWrapperProps & { atmosphereColor?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.section
      id={id}
      className={className}
      initial={reduceMotion ? false : {
        opacity: 0,
        y: isDestination ? 80 : 50,
        scale: isDestination ? 0.96 : 0.98,
        filter: isDestination ? 'blur(4px)' : 'blur(0px)',
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      viewport={{
        once: true,
        margin: '-10%',
      }}
      transition={reduceMotion ? { duration: 0 } : {
        duration: isDestination ? 1.2 : 0.9,
        delay,
        ease: [0.16, 1, 0.3, 1], // Smooth deceleration — like a ship slowing down
      }}
    >
      {atmosphereColor && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            background: `radial-gradient(ellipse at center, ${atmosphereColor} 0%, transparent 60%)`,
            opacity: 0.15,
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      )}
      {children}
    </motion.section>
  );
}
