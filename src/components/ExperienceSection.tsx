'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from './SectionWrapper';

export default function ExperienceSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const switchSystem = (index: number) => {
    if (currentIndex === index || isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleWheel = (e: WheelEvent) => {
      const rect = section.getBoundingClientRect();

      if (isAnimating) {
        if (Math.abs(rect.top) < 200) {
          e.preventDefault();
        }
        return;
      }

      // SCROLLING DOWN: Catch them as they try to leave Project 0
      if (e.deltaY > 10 && rect.top <= 50 && rect.top > -300 && currentIndex === 0) {
        e.preventDefault();
        if (Math.abs(rect.top) > 5) {
          window.scrollBy({ top: rect.top, behavior: 'smooth' });
        }
        switchSystem(1);
      }
      // SCROLLING UP: Catch them as they try to leave Project 1
      else if (e.deltaY < -10 && rect.top >= -50 && rect.top < 300 && currentIndex === 1) {
        e.preventDefault();
        if (Math.abs(rect.top) > 5) {
          window.scrollBy({ top: rect.top, behavior: 'smooth' });
        }
        switchSystem(0);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentIndex, isAnimating]);

  return (
    <SectionWrapper className="relative w-full h-[100vh] min-h-[800px] overflow-hidden" id="experience" atmosphereColor="#3b82f6">
      <div ref={sectionRef} className="relative w-full h-full">
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
        
        {/* Re-added Section Headings aligned with the container */}
        <div className="absolute top-12 left-0 w-full z-50 pointer-events-none">
          <div className="container mx-auto">
          <motion.div
            className="section-eyebrow"
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-eyebrow-dot" />
            Destination 05 / Mission Log
          </motion.div>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, x: 54, clipPath: 'inset(0 0 0 18%)' }}
            whileInView={{ opacity: 1, x: 0, clipPath: 'inset(0 0 0 0%)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Where I&apos;ve worked<span className="accent-period">.</span>
          </motion.h2>
        </div>
      </div>

      <div 
        className="absolute inset-0 flex dashboard-container"
      >
        {/* ============================================== */}
        {/* LEFT SIDE: Mission Log Text                    */}
        {/* ============================================== */}
        <div className="log-panel">
          
          {/* b3 Log */}
          <div className={`log-content ${currentIndex === 0 ? 'active' : ''}`}>
            <div className="log-header">
              <div className="log-date" style={{ color: '#3b82f6' }}>SEP 2025 - APR 2026 / CHANDIGARH</div>
              <h2 className="log-title">b3 Solutions</h2>
              <p className="log-role">AI Developer Intern</p>
            </div>
            <div className="log-bullets">
              <div className="bullet" style={{ '--accent': '#3b82f6' } as React.CSSProperties}>Built a document automation platform processing thousands of invoices/month — full backend with FastAPI, Celery, React, and PostgreSQL.</div>
              <div className="bullet" style={{ '--accent': '#3b82f6' } as React.CSSProperties}>Designed a multi-stage OCR pipeline (PyMuPDF → pdfplumber → Tesseract) with per-supplier Strategy-pattern parsers. <strong style={{ color: '#3b82f6' }}>— 90% extraction accuracy</strong></div>
              <div className="bullet" style={{ '--accent': '#3b82f6' } as React.CSSProperties}>Built async processing with Celery + Redis for classification and duplicate detection. <strong style={{ color: '#3b82f6' }}>— Cut duplicates by 99%</strong></div>
              <div className="bullet" style={{ '--accent': '#3b82f6' } as React.CSSProperties}>Replaced third-party cloud storage with self-hosted MinIO (S3-compatible). <strong style={{ color: '#3b82f6' }}>— Saved $300/month</strong></div>
            </div>
          </div>

          {/* RDSO Log */}
          <div className={`log-content ${currentIndex === 1 ? 'active' : ''}`}>
            <div className="log-header">
              <div className="log-date" style={{ color: '#f59e0b' }}>JUN 2025 - JUL 2025 / LUCKNOW</div>
              <h2 className="log-title">RDSO, Indian Railway</h2>
              <p className="log-role">Python Developer Intern</p>
            </div>
            <div className="log-bullets">
              <div className="bullet" style={{ '--accent': '#f59e0b' } as React.CSSProperties}>Developed a custom automated Word document generator for standardized railway reports. <strong style={{ color: '#f59e0b' }}>— 90%+ faster report generation</strong></div>
              <div className="bullet" style={{ '--accent': '#f59e0b' } as React.CSSProperties}>Implemented dynamic table formatting with styling, zebra-striping, and template rendering for customizable reports.</div>
              <div className="bullet" style={{ '--accent': '#f59e0b' } as React.CSSProperties}>Gained hands-on experience in backend development with Django and web application design with PostgreSQL integration.</div>
            </div>
          </div>

        </div>

        {/* ============================================== */}
        {/* RIGHT SIDE: Planetary System                   */}
        {/* ============================================== */}
        <div className="stage" id="stage">
          
          {/* SYSTEM 1: b3 Solutions */}
          <div className={`system-view ${currentIndex === 0 ? 'active' : currentIndex > 0 ? 'hidden-up' : 'hidden-down'}`}>
            <div className="scene-3d">
              
              <div className="orbits-container">
                <div className="orbit-ring r1"></div>
                <div className="orbit-ring r2"></div>
                <div className="orbit-ring r3"></div>
                
                {/* Ring 1 (140px) | Duration: 25s */}
                <div className="carrier" style={{ animation: 'spinZ 25s linear infinite', animationDelay: '0s' }}>
                  <div className="sat-wrapper" style={{ transform: 'translateX(140px)' }}>
                    <div className="sat-logo" data-tech="FastAPI" style={{ animation: 'anti-spin 25s linear infinite', animationDelay: '0s' }}>
                      <div className="mini-planet"></div>
                      <div className="sat-icon" style={{ color: '#009688' }}><i className="devicon-fastapi-plain"></i></div>
                    </div>
                  </div>
                </div>
                <div className="carrier" style={{ animation: 'spinZ 25s linear infinite', animationDelay: '-12.5s' }}>
                  <div className="sat-wrapper" style={{ transform: 'translateX(140px)' }}>
                    <div className="sat-logo" data-tech="PostgreSQL" style={{ animation: 'anti-spin 25s linear infinite', animationDelay: '-12.5s' }}>
                      <div className="mini-planet"></div>
                      <div className="sat-icon" style={{ color: '#336791' }}><i className="devicon-postgresql-plain"></i></div>
                    </div>
                  </div>
                </div>
                
                {/* Ring 2 (200px) | Duration: 35s */}
                <div className="carrier" style={{ animation: 'spinZ 35s linear infinite', animationDelay: '-5s' }}>
                  <div className="sat-wrapper" style={{ transform: 'translateX(200px)' }}>
                    <div className="sat-logo" data-tech="React" style={{ animation: 'anti-spin 35s linear infinite', animationDelay: '-5s' }}>
                      <div className="mini-planet"></div>
                      <div className="sat-icon" style={{ color: '#61DAFB' }}><i className="devicon-react-original"></i></div>
                    </div>
                  </div>
                </div>
                <div className="carrier" style={{ animation: 'spinZ 35s linear infinite', animationDelay: '-22.5s' }}>
                  <div className="sat-wrapper" style={{ transform: 'translateX(200px)' }}>
                    <div className="sat-logo" data-tech="Redis" style={{ animation: 'anti-spin 35s linear infinite', animationDelay: '-22.5s' }}>
                      <div className="mini-planet"></div>
                      <div className="sat-icon" style={{ color: '#DC382D' }}><i className="devicon-redis-plain"></i></div>
                    </div>
                  </div>
                </div>

                {/* Ring 3 (260px) | Duration: 45s */}
                <div className="carrier" style={{ animation: 'spinZ 45s linear infinite', animationDelay: '-15s' }}>
                  <div className="sat-wrapper" style={{ transform: 'translateX(260px)' }}>
                    <div className="sat-logo" data-tech="Celery" style={{ animation: 'anti-spin 45s linear infinite', animationDelay: '-15s' }}>
                      <div className="mini-planet"></div>
                      <div className="sat-icon" style={{ color: '#A6CE39' }}><i className="devicon-python-plain"></i></div>
                    </div>
                  </div>
                </div>
                <div className="carrier" style={{ animation: 'spinZ 45s linear infinite', animationDelay: '-37.5s' }}>
                  <div className="sat-wrapper" style={{ transform: 'translateX(260px)' }}>
                    <div className="sat-logo" data-tech="Docker" style={{ animation: 'anti-spin 45s linear infinite', animationDelay: '-37.5s' }}>
                      <div className="mini-planet"></div>
                      <div className="sat-icon" style={{ color: '#2496ED' }}><i className="devicon-docker-plain"></i></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="planet planet-b3"></div>
            </div>
          </div>

          {/* SYSTEM 2: RDSO */}
          <div className={`system-view ${currentIndex === 1 ? 'active' : currentIndex < 1 ? 'hidden-down' : 'hidden-up'}`}>
            <div className="scene-3d">
              
              <div className="orbits-container">
                <div className="orbit-ring r1"></div>
                <div className="orbit-ring r2"></div>
                
                {/* Ring 1 (140px) | Duration: 20s */}
                <div className="carrier" style={{ animation: 'spinZ 20s linear infinite', animationDelay: '0s' }}>
                  <div className="sat-wrapper" style={{ transform: 'translateX(140px)' }}>
                    <div className="sat-logo" data-tech="Python" style={{ animation: 'anti-spin 20s linear infinite', animationDelay: '0s' }}>
                      <div className="mini-planet"></div>
                      <div className="sat-icon" style={{ color: '#3776AB' }}><i className="devicon-python-plain"></i></div>
                    </div>
                  </div>
                </div>
                <div className="carrier" style={{ animation: 'spinZ 20s linear infinite', animationDelay: '-10s' }}>
                  <div className="sat-wrapper" style={{ transform: 'translateX(140px)' }}>
                    <div className="sat-logo" data-tech="Django" style={{ animation: 'anti-spin 20s linear infinite', animationDelay: '-10s' }}>
                      <div className="mini-planet"></div>
                      <div className="sat-icon" style={{ color: '#092E20' }}><i className="devicon-django-plain"></i></div>
                    </div>
                  </div>
                </div>
                
                {/* Ring 2 (200px) | Duration: 30s */}
                <div className="carrier" style={{ animation: 'spinZ 30s linear infinite', animationDelay: '-5s' }}>
                  <div className="sat-wrapper" style={{ transform: 'translateX(200px)' }}>
                    <div className="sat-logo" data-tech="PostgreSQL" style={{ animation: 'anti-spin 30s linear infinite', animationDelay: '-5s' }}>
                      <div className="mini-planet"></div>
                      <div className="sat-icon" style={{ color: '#336791' }}><i className="devicon-postgresql-plain"></i></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="planet planet-rdso"></div>
            </div>
          </div>
          
        </div>

        {/* Global UI Elements placed outside flex containers so they stay anchored to the screen bounds */}
        <div className="mission-control">
          <div className={`mission-tab ${currentIndex === 0 ? 'active' : ''}`} onClick={() => switchSystem(0)}>b3 Solutions</div>
          <div className={`mission-tab ${currentIndex === 1 ? 'active' : ''}`} onClick={() => switchSystem(1)}>RDSO</div>
        </div>

        <div className="scroll-hint">Scroll down to travel</div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-container {
          display: flex;
          width: 100%;
          height: 100%;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .stage {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
        }
        
        .system-view {
          position: absolute;
          top: 54%; left: 50%; /* Shifted downward to balance with the text */
          width: 800px; height: 800px;
          transform: translate(-50%, -50%) translateZ(0px) scale(1);
          transition: opacity 0.8s ease, transform 1s cubic-bezier(0.2, 0.8, 0.2, 1);
          opacity: 0;
          pointer-events: none;
          z-index: 1;
          will-change: transform, opacity;
        }
        .system-view.active {
          opacity: 1;
          pointer-events: auto;
          z-index: 2;
          transform: translate(-50%, -50%) translateZ(0px) scale(1);
        }
        .system-view.hidden-up { 
          transform: translate(-50%, -50%) translateZ(800px) scale(2.5); 
          opacity: 0;
        }
        .system-view.hidden-down { 
          transform: translate(-50%, -50%) translateZ(-1000px) scale(0.2); 
          opacity: 0;
        }

        .scene-3d {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          transform-style: preserve-3d;
        }

        .planet {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) translateZ(0); 
          border-radius: 50%;
          will-change: background-position;
        }
        @keyframes planetSpin {
          from { background-position: 0% 50%; }
          to { background-position: 100% 50%; }
        }

        .planet-b3 {
          width: 140px; height: 140px; 
          background-image: url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop');
          background-size: 300% 100%;
          box-shadow: 
            inset -30px -30px 40px rgba(0,0,0,0.95), 
            inset 5px 5px 20px rgba(255, 255, 255, 0.4),
            0 0 50px rgba(59, 130, 246, 0.6);
          animation: planetSpin 40s linear infinite;
        }
        .planet-rdso {
          width: 120px; height: 120px;
          background-image: url('https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop');
          background-size: 300% 100%;
          box-shadow: 
            inset -25px -25px 35px rgba(0,0,0,0.95), 
            inset 5px 5px 15px rgba(255, 255, 255, 0.4),
            0 0 40px rgba(245, 158, 11, 0.5);
          animation: planetSpin 40s linear infinite;
        }

        .orbits-container {
          position: absolute;
          top: 50%; left: 50%;
          width: 100%; height: 100%;
          transform-style: preserve-3d;
          transform: translate(-50%, -50%) rotateX(60deg);
        }
        .orbit-ring {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          border: 1.5px solid rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          pointer-events: none;
        }
        .orbit-ring.r1 { width: 280px; height: 280px; }
        .orbit-ring.r2 { width: 400px; height: 400px; border: 1.5px dashed rgba(255,255,255,0.1); }
        .orbit-ring.r3 { width: 520px; height: 520px; }

        .carrier {
          position: absolute;
          top: 50%; left: 50%;
          transform-style: preserve-3d;
        }
        .sat-wrapper {
          position: absolute;
          top: 0; left: 0;
          transform-style: preserve-3d;
        }

        .sat-logo {
          width: 44px; height: 44px;
          position: absolute;
          top: -22px; left: -22px;
          cursor: pointer;
          will-change: transform;
          transform-style: preserve-3d;
        }
        .mini-planet {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          border-radius: 50%;
          background: #000000;
          box-shadow: 
            inset -8px -8px 12px rgba(0,0,0,0.9), 
            inset 2px 2px 6px rgba(255, 255, 255, 0.4),
            0 0 10px rgba(0,0,0,0.5);
          transition: box-shadow 0.3s;
        }
        .sat-icon {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          filter: drop-shadow(0 0 3px currentColor);
          z-index: 2;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .sat-logo:hover .mini-planet {
          box-shadow: 
            inset -8px -8px 12px rgba(0,0,0,0.9), 
            inset 2px 2px 6px rgba(255, 255, 255, 0.8),
            0 0 20px rgba(255,255,255,0.2);
        }
        .sat-logo:hover .sat-icon {
          transform: scale(1.3);
        }

        .sat-logo::after {
          content: attr(data-tech);
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.9);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-family: monospace;
          color: #fff;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s;
          white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.1);
          z-index: 3;
        }
        .sat-logo:hover::after { opacity: 1; }

        @keyframes spinZ {
          from { transform: rotateZ(0deg); }
          to { transform: rotateZ(360deg); }
        }
        @keyframes anti-spin {
          from { transform: rotateZ(0deg) rotateX(-60deg); }
          to { transform: rotateZ(-360deg) rotateX(-60deg); }
        }

        .log-panel {
          width: 480px;
          position: relative;
          z-index: 20;
          color: #e2e8f0;
          margin-left: 10vw; /* Shift text inward on the left side to align with titles */
        }
        
        .log-content {
          position: absolute;
          top: 56%;
          left: 0px; right: 50px;
          transform: translateY(-50%) translateX(30px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
          will-change: opacity, transform;
        }
        .log-content.active {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
          pointer-events: auto;
        }

        .log-header { margin-bottom: 40px; }
        .log-date { font-family: "JetBrains Mono", monospace; font-size: 12px; letter-spacing: 2px; margin-bottom: 15px; }
        .log-title { font-size: 32px; font-weight: 700; margin: 0 0 10px 0; }
        .log-role { font-size: 18px; color: #94a3b8; font-weight: 400; margin: 0; }
        
        .log-bullets { display: flex; flex-direction: column; gap: 20px; }
        .bullet { position: relative; padding-left: 20px; font-size: 14px; color: #cbd5e1; line-height: 1.6; }
        .bullet::before { content: ''; position: absolute; left: 0; top: 8px; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
        .bullet strong { display: block; margin-top: 4px; font-weight: 600; }

        .scroll-hint {
          position: absolute;
          bottom: 40px;
          right: max(40px, 5vw); /* Moved to bottom right corner since tabs are on the left */
          color: #64748b;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          animation: pulse 2s infinite;
          pointer-events: none;
          z-index: 40;
        }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }

        .mission-control {
          position: absolute;
          bottom: 40px;
          left: 10vw; /* Perfect alignment with the text block above it */
          display: flex;
          gap: 10px;
          background: rgba(10, 20, 35, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 8px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          z-index: 30;
        }
        .mission-tab {
          padding: 10px 24px;
          border-radius: 100px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        .mission-tab:hover { color: #fff; background: rgba(255,255,255,0.05); }
        .mission-tab.active { background: rgba(255,255,255,0.1); color: #fff; box-shadow: inset 0 1px 1px rgba(255,255,255,0.1); }
      `}} />
      </div>
    </SectionWrapper>
  );
}
