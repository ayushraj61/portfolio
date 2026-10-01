'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { journeyStops } from '@/data/journey';
import { socialLinks } from '@/data/products';
import LaunchFlight from './LaunchFlight';

interface LaunchScreenProps {
  onLaunch: () => void;
  onSkip: (destination: string) => void;
}

type LaunchPhase = 'idle' | 'flight' | 'done';

export default function LaunchScreen({ onLaunch, onSkip }: LaunchScreenProps) {
  const [phase, setPhase] = useState<LaunchPhase>('idle');
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<LaunchPhase>('idle');
  const completedRef = useRef(false);

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => {
    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const focusable = screenRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]');
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
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let frameId = 0;
    let tick = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stars = Array.from({ length: width < 768 ? 125 : 230 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      depth: .4 + Math.random() * 1.8,
      radius: .3 + Math.random() * 1.2,
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = () => {
      if (phaseRef.current !== 'idle') return;
      ctx.fillStyle = '#05080e';
      ctx.fillRect(0, 0, width, height);
      for (const star of stars) {
        const alpha = .28 + .18 * Math.sin(tick * .016 + star.x) + star.depth * .16;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215, 229, 250, ${alpha})`;
        ctx.fill();
      }
      tick++;
      if (!reducedMotion) frameId = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const finishJourney = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setPhase('done');
    onLaunch();
  };

  const handleLaunch = () => {
    if (phaseRef.current !== 'idle' || completedRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishJourney();
      return;
    }
    setPhase('flight');
    phaseRef.current = 'flight';
  };

  if (phase === 'done') return null;
  const inFlight = phase !== 'idle';

  return (
    <motion.div
      ref={screenRef}
      className={`launch-screen${inFlight ? ' launch-screen-in-flight' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Begin Ayush Raj's portfolio journey"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .8 }}
    >
      <canvas ref={canvasRef} className="launch-canvas" aria-hidden="true" />
      <AnimatePresence>
        {!inFlight && (
          <motion.div className="launch-idle" exit={{ opacity: 0, scale: 1.12 }} transition={{ duration: .55 }}>
            <div className="launch-horizon" aria-hidden="true">
              <span className="launch-horizon-ring launch-horizon-ring-one" />
              <span className="launch-horizon-ring launch-horizon-ring-two" />
              <span className="launch-horizon-orbit" />
              <span className="launch-horizon-point launch-horizon-point-one" />
              <span className="launch-horizon-point launch-horizon-point-two" />
            </div>
            <span className="launch-coordinate launch-coordinate-left" aria-hidden="true">AR / 00<br />EARTH ORBIT</span>
            <span className="launch-coordinate launch-coordinate-right" aria-hidden="true">EXPLORATION<br />IN PROGRESS</span>
            <div className="launch-content">
              <motion.div className="launch-ship" initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8 }} aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 20L12 16L20 20L12 2Z" fill="white" fillOpacity=".9" stroke="rgba(212,168,83,.5)" strokeWidth=".5" />
                </svg>
                <div className="launch-ship-glow" />
              </motion.div>
              <motion.div className="launch-name" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .3 }}>Ayush Raj</motion.div>
              <motion.p className="launch-subtitle" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .5 }}>
                Software Engineer · AI Builder · Product Builder
              </motion.p>
              <motion.button className="launch-btn" onClick={handleLaunch} autoFocus initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .8 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: .98 }}>
                <span className="launch-btn-dot" />Begin Journey
              </motion.button>
              {!showQuickMenu ? (
                <motion.button className="launch-skip" onClick={() => setShowQuickMenu(true)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5, delay: 1.2 }}>
                  Quick Explore <span aria-hidden="true">↗</span>
                </motion.button>
              ) : (
                <nav className="launch-quick-menu" aria-label="Quick explore destinations">
                  <span className="launch-quick-title">JUMP TO A DESTINATION</span>
                  <div className="launch-quick-grid">
                    {journeyStops.filter((stop) => stop.id !== 'hero').map((stop) => (
                      <button key={stop.id} type="button" onClick={() => onSkip(stop.id)}><span>{stop.shortLabel}</span><span aria-hidden="true">↗</span></button>
                    ))}
                    <a href={socialLinks.resume} target="_blank" rel="noopener noreferrer"><span>Resume</span><span aria-hidden="true">↗</span></a>
                  </div>
                  <button className="launch-quick-close" type="button" onClick={() => setShowQuickMenu(false)}>← Back to launch</button>
                </nav>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {inFlight && <LaunchFlight onComplete={finishJourney} onSkip={finishJourney} />}
    </motion.div>
  );
}
