'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// ========================================
// SPACE TRANSITION — Between sections
// Per DESIGN.txt §22: Hybrid Experience
// "Immersive outside → Clean inside → Immersive transition → Next destination"
//
// Creates the feeling of traveling between destinations
// with parallax star lines and a destination label
// ========================================

interface SpaceTransitionProps {
  /** Label of the next destination */
  nextDestination: string;
  /** Whether to show navigational elements */
  showNav?: boolean;
}

export default function SpaceTransition({ nextDestination, showNav = true }: SpaceTransitionProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const lineWidth = useTransform(scrollYProgress, [0.2, 0.5], ['0%', '100%']);
  const labelOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0.4]);
  const starsOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.6, 0.9], [0, 0.6, 0.6, 0]);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        zIndex: 1,
        padding: '4rem 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        minHeight: '120px',
        pointerEvents: 'none',
        touchAction: 'pan-y',
      }}
      aria-hidden="true"
    >
      {/* Traveling star lines */}
      <motion.div
        style={{
          opacity: starsOpacity,
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '8px',
          padding: '0 10%',
        }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              height: '1px',
              background: `linear-gradient(90deg, transparent, rgba(212, 168, 83, ${0.08 + i * 0.03}), transparent)`,
              transform: `scaleX(${0.3 + i * 0.15})`,
              opacity: 0.3 + (i % 2) * 0.2,
            }}
          />
        ))}
      </motion.div>

      {/* Center navigation line */}
      <motion.div
        style={{
          width: lineWidth,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--accent-border), var(--accent), var(--accent-border), transparent)',
          position: 'relative',
          zIndex: 1,
        }}
      />

      {/* Destination label */}
      {showNav && (
        <motion.div
          style={{
            opacity: labelOpacity,
            marginTop: '1.25rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--text-faint)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <span style={{
            width: '4px',
            height: '4px',
            background: 'var(--accent)',
            opacity: 0.5,
          }} />
          Approaching: {nextDestination}
          <span style={{
            width: '4px',
            height: '4px',
            background: 'var(--accent)',
            opacity: 0.5,
          }} />
        </motion.div>
      )}
    </div>
  );
}
