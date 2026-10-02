'use client';

import { motion } from 'framer-motion';
import HeroVisual from './HeroVisual';

// ========================================
// HERO SECTION — Redesigned for impact
// Less text, more visual, eye-catching
// Inspired by: Vercel, Linear, Stripe heroes
// ========================================

export default function HeroSection() {
  return (
    <section className="hero" id="hero">
      {/* A view from the ground after the arrival flight. */}
      <HeroVisual />

      <div className="container">
        <div className="hero-content">

          {/* Name & Greeting — stacked two-tier typography */}
          <motion.h1
            className="hero-name"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hero-greeting">Hi, I&apos;m</span>
            <span className="hero-name-text">Ayush Raj</span>
          </motion.h1>

          {/* One-liner — short and punchy */}
          <motion.p
            className="hero-tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            I build products where{' '}
            <span className="hero-tagline-accent">AI meets real-world problems.</span>
          </motion.p>

          {/* CTAs — clean and spaced */}
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
          >
            <a
              href="#work"
              className="hero-btn-primary"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View my work
              <span className="hero-btn-arrow">→</span>
            </a>
            <a
              href="#contact"
              className="hero-btn-secondary"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get in touch
            </a>
          </motion.div>

          {/* Currently building — compact pill */}
          <motion.a
            href="https://daknode.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-building-pill"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <span className="building-pill-dot" />
            <span className="building-pill-label">Building</span>
            <span className="building-pill-name">DakNode</span>
            <span className="building-pill-arrow">↗</span>
          </motion.a>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <span className="scroll-indicator-text">Scroll to travel</span>
        <span className="scroll-indicator-line" />
      </motion.div>
    </section>
  );
}
