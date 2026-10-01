'use client';

import { motion } from 'framer-motion';
import { techStack, engineeringCapabilities } from '@/data/products';
import SectionWrapper from './SectionWrapper';

// ========================================
// TECH DEPTH — Grouped technologies
// Per tech-info section 21 & 28
// No skill bars. No 50 colorful logos.
// Compact, meaningful groupings.
// ========================================

export default function TechDepth() {
  return (
    <SectionWrapper className="section" id="tech-depth" atmosphereColor="#8b8fff">
      <div className="container">
        <motion.div
          className="section-eyebrow"
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow-dot" />
          Destination 04 / AI &amp; Systems
        </motion.div>

        <motion.h2
          className="section-title"
          initial={{ opacity: 0, x: 54, clipPath: 'inset(0 0 0 18%)' }}
          whileInView={{ opacity: 1, x: 0, clipPath: 'inset(0 0 0 0%)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          What I work with
        </motion.h2>

        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginBottom: '3rem' }}
        >
          Technologies grouped by how they serve the work, not by how many I can list.
        </motion.p>

        {/* Tech groups */}
        <motion.div
          className="tech-groups"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {techStack.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
            >
              <h3 className="tech-group-title">{group.title}</h3>
              <div className="tech-group-items">
                {group.items.map((item) => (
                  <span key={item} className="tech-item">
                    <span className="tech-item-dot" />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Engineering credibility */}
        <motion.div
          style={{ marginTop: '4rem' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h3
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--text-warm)',
              marginBottom: '1.5rem',
            }}
          >
            I care about the parts after the demo works.
          </h3>

          <div className="credibility-grid">
            {engineeringCapabilities.map((cap, i) => (
              <motion.span
                key={cap}
                className="credibility-item"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                {cap}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <div className="systems-archive">
          <div className="systems-archive-copy">
            <span className="systems-archive-kicker">EARLIER SYSTEM / FINANCE AUTOMATION</span>
            <h3>From documents to usable data.</h3>
            <p>Backend work around invoice processing, OCR fallbacks, structured extraction, asynchronous workers, storage, databases, and deployment.</p>
          </div>
          <div className="systems-archive-flow" aria-label="Invoice automation workflow">
            <span>DOCUMENT</span><i aria-hidden="true">→</i>
            <span>EXTRACT</span><i aria-hidden="true">→</i>
            <span>PROCESS</span><i aria-hidden="true">→</i>
            <span>STORE</span>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
