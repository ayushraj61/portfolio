'use client';

import { useEffect, useRef } from 'react';

// ========================================
// CUSTOM CURSOR — Pure DOM, zero React re-renders
// Uses requestAnimationFrame + direct DOM transforms
// for absolute maximum performance.
// ========================================

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch devices
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = cursorRef.current;
    if (!el) return;

    document.body.classList.add('has-custom-cursor');

    // All state lives in plain variables — no React state, no re-renders
    let mouseX = -100;
    let mouseY = -100;
    let currentAngle = 0; // smoothed angle in degrees
    let targetAngle = 0;

    // Accumulate recent movement for a stable velocity vector
    let velX = 0;
    let velY = 0;

    const checkSunHover = (cx: number, cy: number) => {
      if (!document.body.classList.contains('is-sun-mode')) {
        if (document.body.classList.contains('cursor-over-sun')) {
          document.body.classList.remove('cursor-over-sun');
        }
        return;
      }

      const sunEl = document.querySelector('.hero-sun');
      if (sunEl) {
        const rect = sunEl.getBoundingClientRect();
        const sunCenterX = rect.left + rect.width / 2;
        const sunCenterY = rect.top + rect.height / 2;
        const radius = Math.max(rect.width, rect.height) / 2 + 20;
        const dist = Math.hypot(cx - sunCenterX, cy - sunCenterY);
        if (dist <= radius) {
          document.body.classList.add('cursor-over-sun');
          return;
        }
      }
      document.body.classList.remove('cursor-over-sun');
    };

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - mouseX;
      const dy = e.clientY - mouseY;

      mouseX = e.clientX;
      mouseY = e.clientY;
      checkSunHover(e.clientX, e.clientY);

      // Accumulate velocity with decay (exponential moving average)
      velX = velX * 0.6 + dx * 0.4;
      velY = velY * 0.6 + dy * 0.4;

      // Only compute a new target angle when there's meaningful movement
      const speed = Math.sqrt(velX * velX + velY * velY);
      if (speed > 1.5) {
        targetAngle = Math.atan2(velY, velX) * (180 / Math.PI) + 90;
      }
    };

    const onMouseLeave = () => {
      mouseX = -100;
      mouseY = -100;
      document.body.classList.remove('cursor-over-sun');
    };

    // Single rAF loop — runs at 60fps, does all the work
    let frameId: number;
    const tick = () => {
      if (el) {
        // Shortest-path angle interpolation
        let diff = targetAngle - currentAngle;

        // Normalize to [-180, 180]
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;

        // Lerp toward target (0.12 = smooth, not sluggish)
        currentAngle += diff * 0.12;

        // Apply transform directly — no React, no virtual DOM
        el.style.transform = `translate(${mouseX}px, ${mouseY}px) rotate(${currentAngle}deg)`;
      }
      frameId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    frameId = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove('has-custom-cursor', 'cursor-over-sun');
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="custom-cursor-path"
          d="M12 2L4 20L12 16L20 20L12 2Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
