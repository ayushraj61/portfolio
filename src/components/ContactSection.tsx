'use client';

import { motion } from 'framer-motion';
import { socialLinks } from '@/data/products';

// ========================================
// CONTACT SECTION — "Build something useful."
// Per DESIGN.txt section 16 & tech-info section 32
// NOT "hire me". The unknown ahead. Journey continues.
// ========================================

export default function ContactSection() {
  return (
    <section className="contact-section deep-space-ending" id="contact" aria-label="Get in touch">
      <div className="container">
        {/* Nebula overlay for atmosphere */}
        <div className="nebula-overlay nebula-3" />

        <motion.div
          className="section-eyebrow"
          style={{ justifyContent: 'center' }}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow-dot" />
          Next Destination: Unknown
        </motion.div>

        <motion.h2
          className="contact-title"
          initial={{ opacity: 0, x: 54, clipPath: 'inset(0 0 0 18%)' }}
          whileInView={{ opacity: 1, x: 0, clipPath: 'inset(0 0 0 0%)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Build something useful.
        </motion.h2>

        <motion.p
          className="contact-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          I want to work closer to the problem: understand the real constraint, then build the system that solves it.
          If you have a problem worth building for, let&apos;s talk.
        </motion.p>

        <motion.div
          className="contact-links"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <a
            href={`mailto:${socialLinks.email}`}
            className="contact-link contact-link-primary"
          >
            Email me →
          </a>
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            LinkedIn ↗
          </a>
          <a
            href={socialLinks.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            Résumé ↗
          </a>
        </motion.div>

        {/* Journey end — The unknown (§45 design-enhance) */}
        <motion.div
          className="journey-end"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <span className="journey-end-line" />
          <span className="journey-end-label">Next Destination</span>
          <span className="journey-end-unknown">UNKNOWN</span>
          <span className="journey-end-text">Still building. Still learning. Still exploring.</span>
        </motion.div>
      </div>
    </section>
  );
}
