'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Star = { x: number; y: number; radius: number; opacity: number; phase: number; speed: number };

function seededRandom() {
  let seed = 1847;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

const BirdsFlock = () => {
  return (
    <motion.div
      initial={{ x: '-20vw', y: '30vh', opacity: 0, scale: 0.6 }}
      animate={{ x: '110vw', y: '10vh', opacity: [0, 1, 1, 0] }}
      transition={{ duration: 12, ease: "linear" }}
      className="absolute pointer-events-none"
      style={{ zIndex: 20, top: 0, left: 0 }}
    >
      <svg width="200" height="150" viewBox="0 0 200 150" fill="#000000" opacity="1">
        <g className="bird-flap" style={{ transformOrigin: '20px 25px', animationDelay: '0s' }}>
          <path d="M10,30 Q15,20 20,25 Q25,20 30,30 Q25,26 20,30 Q15,26 10,30 Z" />
        </g>
        <g className="bird-flap" style={{ transformOrigin: '50px 45px', animationDelay: '0.2s' }}>
          <path d="M40,50 Q45,40 50,45 Q55,40 60,50 Q55,46 50,50 Q45,46 40,50 Z" />
        </g>
        <g className="bird-flap" style={{ transformOrigin: '35px 65px', animationDelay: '0.4s' }}>
          <path d="M25,70 Q30,60 35,65 Q40,60 45,70 Q40,66 35,70 Q30,66 25,70 Z" />
        </g>
        <g className="bird-flap" style={{ transformOrigin: '70px 15px', animationDelay: '0.1s' }}>
          <path d="M60,20 Q65,10 70,15 Q75,10 80,20 Q75,16 70,20 Q65,16 60,20 Z" />
        </g>
        <g className="bird-flap" style={{ transformOrigin: '95px 40px', animationDelay: '0.3s' }}>
          <path d="M85,45 Q90,35 95,40 Q100,35 105,45 Q100,41 95,45 Q90,41 85,45 Z" />
        </g>
        <g className="bird-flap" style={{ transformOrigin: '120px 60px', animationDelay: '0.5s' }}>
          <path d="M110,65 Q115,55 120,60 Q125,55 130,65 Q125,61 120,65 Q115,61 110,65 Z" />
        </g>
      </svg>
    </motion.div>
  );
};

export default function HeroVisual() {
  const visualRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDay, setIsDay] = useState(false);

  useEffect(() => {
    if (isDay) {
      document.body.classList.add('is-sun-mode');
    } else {
      document.body.classList.remove('is-sun-mode', 'cursor-over-sun');
    }
    return () => {
      document.body.classList.remove('is-sun-mode', 'cursor-over-sun');
    };
  }, [isDay]);

  useEffect(() => {
    const visual = visualRef.current;
    const canvas = canvasRef.current;
    const hero = visual?.closest('.hero');
    const context = canvas?.getContext('2d', { alpha: true });
    if (!visual || !canvas || !hero || !context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let scrollOffset = 0;
    let stars: Star[] = [];

    const renderStars = (time: number) => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      context.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio);
      for (const star of stars) {
        const twinkle = reducedMotion ? 1 : 0.78 + Math.sin(time * 0.001 * star.speed + star.phase) * 0.22;
        context.fillStyle = `rgba(235,244,255,${star.opacity * twinkle})`;
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
      }
    };

    const resize = () => {
      const { width, height } = visual.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const random = seededRandom();
      stars = Array.from({ length: Math.min(170, Math.round(width * height / 6500)) }, () => ({
        x: random() * width,
        y: random() * height * 0.78,
        radius: 0.35 + random() * 0.8,
        opacity: 0.24 + random() * 0.44,
        phase: random() * Math.PI * 2,
        speed: 0.45 + random() * 1.05,
      }));
      if (reducedMotion) renderStars(0);
    };

    const render = (time: number) => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      visual.style.setProperty('--sky-x', `${currentX * -8}px`);
      visual.style.setProperty('--sky-y', `${currentY * -6 + scrollOffset * 0.06}px`);
      visual.style.setProperty('--rocks-x', `${currentX * 16}px`);
      visual.style.setProperty('--rocks-y', `${currentY * 10 - scrollOffset * 0.02}px`);
      visual.style.setProperty('--moon-x', `${currentX * 3}px`);
      visual.style.setProperty('--moon-y', `${currentY * 2 - scrollOffset * 0.03}px`);
      renderStars(time);
      frame = requestAnimationFrame(render);
    };

    const onPointerMove = (event: Event) => {
      const pointer = event as PointerEvent;
      targetX = (pointer.clientX / window.innerWidth - 0.5) * 2;
      targetY = (pointer.clientY / window.innerHeight - 0.5) * 2;
    };
    const onPointerLeave = () => { targetX = 0; targetY = 0; };
    const onScroll = () => {
      scrollOffset = Math.min(Math.max(window.scrollY, 0), hero.clientHeight);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !frame && !reducedMotion) frame = requestAnimationFrame(render);
      if (!entry.isIntersecting && frame) { cancelAnimationFrame(frame); frame = 0; }
    });
    const resizer = new ResizeObserver(resize);

    resize();
    onScroll();
    observer.observe(hero);
    resizer.observe(visual);
    if (!reducedMotion) {
      hero.addEventListener('pointermove', onPointerMove, { passive: true });
      hero.addEventListener('pointerleave', onPointerLeave);
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    return () => {
      observer.disconnect();
      resizer.disconnect();
      hero.removeEventListener('pointermove', onPointerMove);
      hero.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={visualRef} className={`hero-visual-container ${isDay ? 'day-mode' : ''}`} aria-hidden="true">
      <div className="hero-sky-photo sky-layer" />
      <div className="hero-sky-shade" />
      {/* ROTATING COSMOS */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={false}
        animate={{ rotate: isDay ? 110 : 0, opacity: isDay ? 0 : 1 }}
        transition={{ duration: 3.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformOrigin: "50% 150%" }}
      >
        <canvas ref={canvasRef} id="cosmos" className="hero-cosmos" />
      </motion.div>

      {/* ROTATING CELESTIAL WHEEL (Moon & Sun) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={false}
        animate={{ rotate: isDay ? 110 : 0 }}
        transition={{ duration: 3.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformOrigin: "50% 150%", zIndex: 40 }}
      >
        {/* MOON */}
        <div 
          className="hero-moon-scene" 
          onClick={() => setIsDay(true)}
          style={{ 
            pointerEvents: isDay ? 'none' : 'auto',
            cursor: 'pointer',
            opacity: isDay ? 0 : 1,
            transition: 'opacity 1.5s ease-in-out'
          }}
        >
          <span className="hero-moon-halo" />
          <span className="hero-moon" />
          <span className="hero-moon-orbit" />
          <span className="hero-moon-label"><i /> THE MOON <b>BEYOND THE HORIZON</b></span>
        </div>

        {/* SUN */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ transform: 'rotate(-110deg)', transformOrigin: '50% 150%' }}
        >
          <div 
            id="hero-sun-target"
            className="hero-moon-scene hero-sun-scene" 
            onClick={() => setIsDay(false)}
            onPointerEnter={() => {
              if (isDay) document.body.classList.add('cursor-over-sun');
            }}
            onPointerLeave={() => {
              document.body.classList.remove('cursor-over-sun');
            }}
            style={{ 
              pointerEvents: isDay ? 'auto' : 'none',
              cursor: 'pointer',
              opacity: isDay ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out'
            }}
          >
            <span className="hero-sun-halo" />
            <span className="hero-sun" />
            <span className="hero-sun-orbit" />
            <span className="hero-sun-label"><i /> THE SUN <b>DAYLIGHT HORIZON</b></span>
          </div>
        </div>
      </motion.div>
      <div className="hero-rocks-layer rocks-layer" />
      <div className="hero-rocks-moonlight" />
      <span className="hero-launch-point"><i /> LAUNCH POINT <b>01 / ORIGIN</b></span>
      <span className="hero-horizon-rule" />
      
      {/* Render Birds ONLY during Day Mode */}
      <AnimatePresence>
        {isDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 20 }}
          >
            <BirdsFlock />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
