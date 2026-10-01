'use client';

import { useEffect, useRef } from 'react';

type Star = { x: number; y: number; radius: number; opacity: number; phase: number; speed: number };

function seededRandom() {
  let seed = 1847;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

export default function HeroVisual() {
  const visualRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    <div ref={visualRef} className="hero-visual-container" aria-hidden="true">
      <div className="hero-sky-photo sky-layer" />
      <div className="hero-sky-shade" />
      <canvas ref={canvasRef} id="cosmos" className="hero-cosmos" />
      <div className="hero-moon-scene">
        <span className="hero-moon-halo" />
        <span className="hero-moon" />
        <span className="hero-moon-orbit" />
        <span className="hero-moon-label"><i /> THE MOON <b>BEYOND THE HORIZON</b></span>
      </div>
      <div className="hero-rocks-layer rocks-layer" />
      <div className="hero-rocks-moonlight" />
      <span className="hero-launch-point"><i /> LAUNCH POINT <b>01 / ORIGIN</b></span>
      <span className="hero-horizon-rule" />
    </div>
  );
}
