'use client';

import { useEffect, useRef } from 'react';

export default function HeroVisual() {
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const visual = visualRef.current;
    const hero = visual?.closest('.hero');
    if (!visual || !hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let scrollOffset = 0;

    const render = () => {
      visual.style.setProperty('--sky-x', `${pointerX * -12}px`);
      visual.style.setProperty('--sky-y', `${pointerY * -10 + scrollOffset * 0.1}px`);
      visual.style.setProperty('--moon-x', `${pointerX * 20}px`);
      visual.style.setProperty('--moon-y', `${pointerY * 15 - scrollOffset * 0.08}px`);
      frame = 0;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const onPointerMove = (event: Event) => {
      const pointer = event as PointerEvent;
      const bounds = hero.getBoundingClientRect();
      pointerX = (pointer.clientX - bounds.left) / bounds.width - 0.5;
      pointerY = (pointer.clientY - bounds.top) / bounds.height - 0.5;
      schedule();
    };
    const onPointerLeave = () => { pointerX = 0; pointerY = 0; schedule(); };
    const onScroll = () => {
      scrollOffset = Math.min(Math.max(window.scrollY, 0), hero.clientHeight);
      schedule();
    };

    hero.addEventListener('pointermove', onPointerMove, { passive: true });
    hero.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      hero.removeEventListener('pointermove', onPointerMove);
      hero.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={visualRef} className="hero-visual-container" aria-hidden="true">
      <div className="hero-sky-photo" />
      <div className="hero-sky-shade" />
      <div className="hero-moon-scene">
        <span className="hero-moon-halo" />
        <span className="hero-moon" />
        <span className="hero-moon-orbit" />
        <span className="hero-moon-label"><i /> THE MOON <b>BEYOND THE HORIZON</b></span>
      </div>
      <span className="hero-launch-point"><i /> LAUNCH POINT <b>01 / ORIGIN</b></span>
      <span className="hero-horizon-rule" />
    </div>
  );
}
