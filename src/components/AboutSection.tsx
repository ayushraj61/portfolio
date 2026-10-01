'use client';

import { motion } from 'framer-motion';
import { socialLinks } from '@/data/products';

// ========================================
// ABOUT SECTION — Personal, genuine, grounded
// Per DESIGN.txt section 20 & tech-info section 25
// 2-3 concise paragraphs. No autobiography.
// ========================================

export default function AboutSection() {
  return (
    <section className="section" id="about" aria-label="About Ayush Raj">
      <div className="container">
        <motion.div
          className="section-eyebrow"
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow-dot" />
          Destination 01 / Signal Origin
        </motion.div>

        <motion.h2
          className="section-title"
          initial={{ opacity: 0, x: 54, clipPath: 'inset(0 0 0 18%)' }}
          whileInView={{ opacity: 1, x: 0, clipPath: 'inset(0 0 0 0%)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          About me
        </motion.h2>

        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="about-text">
            I&apos;m Ayush Raj, a 4th-year engineering student and software builder interested in the space where backend engineering, AI, and product development meet.
          </p>
          <p className="about-text">
            I enjoy taking an idea from a blank screen to a deployed system — designing the backend, connecting the pieces, shipping the product, and learning from what happens next.
          </p>
          <p className="about-text">
            My long-term goal is to become a strong technical leader who can understand both the engineering and the business problem deeply enough to build AI products people genuinely need.
          </p>

          <div className="about-links">
            <a
              href={socialLinks.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="about-link"
            >
              View résumé <span>↗</span>
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="about-link"
            >
              LinkedIn <span>↗</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
