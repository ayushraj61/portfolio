'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { socialLinks } from '@/data/products';
import { scrollToStop } from '@/data/journey';

// ========================================
// NAVBAR — Sleek, transparent, blurs on scroll
// Minimal navigation per DESIGN.txt
// ========================================

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Current Build', href: '#building' },
  { label: 'Work', href: '#work' },
  { label: 'Technical Work', href: '#tech-depth' },
  { label: 'Resume', href: socialLinks.resume, external: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        requestAnimationFrame(() => menuTriggerRef.current?.focus());
      }
      if (event.key !== 'Tab') return;
      const focusable = mobileMenuRef.current?.querySelectorAll<HTMLElement>('button, a[href]');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    scrollToStop(href.slice(1));
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} aria-label="Primary navigation">
        <div className="navbar-inner">
          <a href="#" className="navbar-brand" aria-label="Ayush Raj — Home">
            <span className="navbar-brand-dot" aria-hidden="true" />
            Ayush Raj
          </a>

          <ul className="navbar-links">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label} ↗
                  </a>
                ) : (
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-cta"
              style={{ border: 'none', padding: '0.5rem 0' }}
            >
              LinkedIn ↗
            </a>
            <a
              href={`mailto:${socialLinks.email}`}
              className="navbar-cta"
            >
              Get in touch →
            </a>
          </div>

          <button
            ref={menuTriggerRef}
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={mobileMenuRef}
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="mobile-menu-close"
              onClick={() => {
                setMobileOpen(false);
                requestAnimationFrame(() => menuTriggerRef.current?.focus());
              }}
              aria-label="Close navigation menu"
              autoFocus
            >
              ✕
            </button>

            {navItems.map((item, i) => (
              item.external ? (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  {item.label} ↗
                </motion.a>
              ) : (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                >
                  {item.label}
                </motion.a>
              )
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navItems.length * 0.08, duration: 0.4 }}
              style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}
            >
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-menu-social"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  border: '1px solid var(--accent-border)',
                  padding: '0.6rem 1.2rem',
                  position: 'static',
                  display: 'inline-block',
                  background: 'transparent',
                  backdropFilter: 'none',
                  justifyContent: 'unset',
                }}
              >
                LinkedIn ↗
              </a>
              <a
                href={`mailto:${socialLinks.email}`}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  border: '1px solid var(--accent-border)',
                  padding: '0.6rem 1.2rem',
                }}
              >
                Email →
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
