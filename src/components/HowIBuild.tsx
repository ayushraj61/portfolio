'use client';

import { motion } from 'framer-motion';
import { principles } from '@/data/products';
import PhilosophyStrip from './PhilosophyStrip';

// ========================================
// HOW I BUILD — Builder's philosophy
// Per tech-info section 22
// Mature, understated voice
// ========================================

export default function HowIBuild() {
  return (
    <section className="section" id="how-i-build" aria-label="How I build">
      <div className="container">
        <motion.div
          className="section-eyebrow"
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow-dot" />
          Destination 05 / Operating Principles
        </motion.div>

        <motion.h2
          className="section-title"
          initial={{ opacity: 0, x: 54, clipPath: 'inset(0 0 0 18%)' }}
          whileInView={{ opacity: 1, x: 0, clipPath: 'inset(0 0 0 0%)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          How I build
        </motion.h2>

        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginBottom: '3rem' }}
        >
          I like taking an idea from zero to something people can actually use.
        </motion.p>

        <PhilosophyStrip />

        <div className="principles-grid">
          {principles.map((principle, i) => (
            <motion.div
              key={principle.number}
              className="principle-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <p className="principle-number">{principle.number}</p>
              <h3 className="principle-title">{principle.title}</h3>
              <p className="principle-desc">&ldquo;{principle.description}&rdquo;</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
