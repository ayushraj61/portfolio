'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { socialLinks } from '@/data/products';
import './AboutSection.css';

export default function AboutSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const expandResume = () => {
    if (!isExpanded && !isDecrypting) {
      setIsDecrypting(true);
      
      // Phase 2: Auth successful
      setTimeout(() => {
        setAuthSuccess(true);
        
        // Phase 3: Fly out
        setTimeout(() => {
          setIsDecrypting(false);
          setIsExpanded(true);
        }, 400);

      }, 700);
    }
  };

  const closeResume = () => {
    setIsExpanded(false);
    
    // Reset after closing animation
    setTimeout(() => {
      setAuthSuccess(false);
      setIsDecrypting(false);
    }, 800);
  };

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeResume();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

        <div className="about-layout-wrapper">
          <motion.div
            className="about-text-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="about-text" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1.5rem', maxWidth: '500px' }}>
              I&apos;m Ayush Raj, a 4th-year engineering student and software builder interested in the space where backend engineering, AI, and product development meet.
            </p>
            <p className="about-text" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1.5rem', maxWidth: '500px' }}>
              I enjoy taking an idea from a blank screen to a deployed system — designing the backend, connecting the pieces, shipping the product, and learning from what happens next.
            </p>
            <p className="about-text" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1.5rem', maxWidth: '500px' }}>
              My long-term goal is to become a strong technical leader who can understand both the engineering and the business problem deeply enough to build AI products people genuinely need.
            </p>

            <div className="about-links" style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
              <a
                href={socialLinks.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="about-link"
              >
                Download PDF <span>↗</span>
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

          <div className={`about-resume-content ${isExpanded ? 'is-expanded' : ''}`}>
            <div 
              className={`resume-wrapper ${isExpanded ? 'expanded' : ''} ${isDecrypting ? 'decrypting' : ''}`}
              onClick={expandResume}
            >
              <div className="resume-card">
                
                {/* State 1: Sci-Fi Abstract Wireframe */}
                <div className="abstract-content">
                  <div className="card-header">
                    <h4>AYUSH_RAJ_RESUME.PDF</h4>
                  </div>
                  
                  <div className="resume-lines">
                    <div className="r-line title"></div>
                    <div className="r-line mid"></div>
                    <div className="r-line"></div>
                    <div className="r-line short"></div>
                    <br/>
                    <div className="r-line mid"></div>
                    <div className="r-line"></div>
                    <div className="r-line short"></div>
                  </div>

                  <div className="scanline"></div>
                  
                  {/* HIGH TECH BUTTON */}
                  <div className="click-hint">
                    <div className="lock-icon"></div>
                    <span>{isDecrypting ? (authSuccess ? "ACCESS GRANTED" : "DECRYPTING...") : "DECRYPT"}</span>
                  </div>
                </div>

                {/* State 2: Actual Resume Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="real-resume" src="/ayush_resume.jpg" alt="Ayush Raj Resume" />
              </div>
              
              {/* Close Button placed outside the card bounds but inside the wrapper so it hovers above */}
              <button 
                className={`close-btn ${isExpanded ? 'active' : ''}`} 
                onClick={(e) => { e.stopPropagation(); closeResume(); }}
              >
                [ ESC ] CLOSE
              </button>
            </div>

            <div className={`modal-overlay ${isExpanded ? 'active' : ''}`} onClick={closeResume}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
