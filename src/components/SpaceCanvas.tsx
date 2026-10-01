'use client';

import { useEffect, useRef, useCallback } from 'react';

// ========================================
// SPACE CANVAS — Immersive Journey Starfield
// Per DESIGN.txt §25: "Motion should communicate 
// travel and progression"
//
// Effects implemented:
// ✦ Multi-layer parallax stars at different depths
// ✦ Scroll-driven acceleration (stars streak when scrolling fast)
// ✦ Atmospheric color shifts as you travel deeper
// ✦ Nebula clouds that drift and change
// ✦ Occasional shooting stars during fast scrolls
// ✦ Stars spread outward from center = forward travel feeling
// ========================================

interface Star {
  x: number;
  y: number;
  z: number; // depth layer (0 = far, 1 = near)
  baseSize: number;
  opacity: number;
  twinklePhase: number;
  twinkleSpeed: number;
  hue: number; // slight color variation
}

interface ShootingStar {
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  life: number;
  maxLife: number;
}

export default function SpaceCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const scrollRef = useRef(0);
  const lastScrollRef = useRef(0);
  const scrollSpeedRef = useRef(0);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);
  const documentHeightRef = useRef(1);

  const createStars = useCallback((width: number, height: number) => {
    const stars: Star[] = [];
    const count = Math.min(Math.floor((width * height) / 3600), width < 768 ? 120 : 280);

    for (let i = 0; i < count; i++) {
      const z = Math.random(); // 0=far, 1=near
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        baseSize: 0.3 + z * 1.8,
        opacity: 0.15 + z * 0.55,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.002 + Math.random() * 0.008,
        hue: Math.random() > 0.85 ? (Math.random() > 0.5 ? 35 : 210) : 45, // most warm, some cool
      });
    }
    return stars;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const time = ++timeRef.current;

    // Calculate scroll speed for "warp" effect
    const currentScroll = scrollRef.current;
    const scrollDelta = currentScroll - lastScrollRef.current;
    lastScrollRef.current = currentScroll;
    // Smooth the speed value
    scrollSpeedRef.current += (Math.abs(scrollDelta) - scrollSpeedRef.current) * 0.08;
    const scrollSpeed = Math.min(scrollSpeedRef.current, 40);

    // Scroll progress 0-1 through the page
    const docHeight = documentHeightRef.current;
    const scrollProgress = Math.min(currentScroll / Math.max(docHeight - height, 1), 1);

    // ====== CLEAR ======
    ctx.clearRect(0, 0, width, height);

    // ====== DEEP SPACE BACKGROUND ======
    // Atmosphere shifts as you scroll deeper — from cold blue-black to warmer tones
    const warmth = scrollProgress * 0.4;
    const bgR = Math.floor(2 + warmth * 8);
    const bgG = Math.floor(2 + warmth * 4);
    const bgB = Math.floor(8 - warmth * 3);
    ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
    ctx.fillRect(0, 0, width, height);

    // ====== NEBULA CLOUDS — shift with scroll ======
    // Nebula 1 — upper left, cool tones (fades as you travel)
    const n1x = width * (0.2 + Math.sin(time * 0.0003) * 0.05);
    const n1y = height * (0.3 - scrollProgress * 0.2);
    const n1 = ctx.createRadialGradient(n1x, n1y, 0, n1x, n1y, width * 0.45);
    n1.addColorStop(0, `rgba(60, 60, 180, ${0.025 * (1 - scrollProgress * 0.6)})`);
    n1.addColorStop(0.5, `rgba(30, 20, 80, ${0.012 * (1 - scrollProgress * 0.4)})`);
    n1.addColorStop(1, 'transparent');
    ctx.fillStyle = n1;
    ctx.fillRect(0, 0, width, height);

    // Nebula 2 — right side, warm amber (intensifies as you approach "destinations")
    const n2x = width * (0.75 + Math.cos(time * 0.0002) * 0.05);
    const n2y = height * (0.5 + scrollProgress * 0.1);
    const n2 = ctx.createRadialGradient(n2x, n2y, 0, n2x, n2y, width * 0.4);
    const amberIntensity = 0.015 + scrollProgress * 0.02;
    n2.addColorStop(0, `rgba(212, 168, 83, ${amberIntensity})`);
    n2.addColorStop(0.6, `rgba(180, 120, 50, ${amberIntensity * 0.4})`);
    n2.addColorStop(1, 'transparent');
    ctx.fillStyle = n2;
    ctx.fillRect(0, 0, width, height);

    // Nebula 3 — center bottom (appears in latter half of journey)
    if (scrollProgress > 0.4) {
      const n3alpha = (scrollProgress - 0.4) * 0.04;
      const n3x = width * 0.5;
      const n3y = height * 0.8;
      const n3 = ctx.createRadialGradient(n3x, n3y, 0, n3x, n3y, width * 0.5);
      n3.addColorStop(0, `rgba(212, 168, 83, ${n3alpha})`);
      n3.addColorStop(1, 'transparent');
      ctx.fillStyle = n3;
      ctx.fillRect(0, 0, width, height);
    }

    // ====== STARS — Parallax + warp stretch ======
    const centerX = width / 2;
    const centerY = height / 2;

    for (const star of starsRef.current) {
      // Parallax: different speed per depth layer
      const parallaxSpeed = 0.02 + star.z * 0.25;
      let sy = (star.y + currentScroll * parallaxSpeed) % height;
      if (sy < 0) sy += height;

      // Subtle horizontal drift
      const driftX = star.x + Math.sin(time * 0.0008 + star.twinklePhase) * (0.5 + star.z);

      // Twinkle
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
      const opacity = star.opacity * (0.55 + twinkle * 0.45);

      // ====== WARP STRETCH EFFECT ======
      // When scrolling fast, stars stretch outward from center = forward travel
      const warpFactor = scrollSpeed * star.z * 0.15;
      const dx = driftX - centerX;
      const dy = sy - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      // Stretch endpoint
      const stretchX = driftX + Math.cos(angle) * warpFactor;
      const stretchY = sy + Math.sin(angle) * warpFactor;

      const size = star.baseSize * (1 + warpFactor * 0.05);

      if (warpFactor > 1.5) {
        // Draw streak line during fast scroll
        ctx.beginPath();
        ctx.moveTo(driftX, sy);
        ctx.lineTo(stretchX, stretchY);
        ctx.strokeStyle = `hsla(${star.hue}, 30%, 85%, ${opacity * 0.7})`;
        ctx.lineWidth = size * 0.6;
        ctx.stroke();
      }

      // Star dot
      ctx.beginPath();
      ctx.arc(stretchX, stretchY, size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${star.hue}, 25%, 88%, ${opacity})`;
      ctx.fill();

      // Glow for near stars
      if (star.z > 0.7 && dist < width * 0.6) {
        ctx.beginPath();
        ctx.arc(stretchX, stretchY, size * 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${star.hue}, 40%, 70%, ${opacity * 0.06})`;
        ctx.fill();
      }
    }

    // ====== SHOOTING STARS — triggered by fast scrolling ======
    if (scrollSpeed > 8 && Math.random() < 0.06) {
      shootingStarsRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.6,
        angle: Math.PI * 0.15 + Math.random() * 0.3,
        speed: 4 + Math.random() * 6,
        length: 40 + Math.random() * 80,
        life: 0,
        maxLife: 30 + Math.random() * 20,
      });
    }

    // Draw & update shooting stars
    shootingStarsRef.current = shootingStarsRef.current.filter((ss) => {
      ss.life++;
      if (ss.life > ss.maxLife) return false;

      const progress = ss.life / ss.maxLife;
      const alpha = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;

      const headX = ss.x + Math.cos(ss.angle) * ss.speed * ss.life;
      const headY = ss.y + Math.sin(ss.angle) * ss.speed * ss.life;
      const tailX = headX - Math.cos(ss.angle) * ss.length * alpha;
      const tailY = headY - Math.sin(ss.angle) * ss.length * alpha;

      const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
      grad.addColorStop(0, `rgba(212, 168, 83, 0)`);
      grad.addColorStop(0.7, `rgba(230, 220, 200, ${alpha * 0.4})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.8})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      return true;
    });

    // Product destinations are interactive in the Product Universe section.

    // ====== ASTEROID BELT — Experiments Zone (§16) ======
    // Small cluster of rocks appearing near the experiment products
    const asteroidScrollPos = 0.42;
    const asteroidDist = Math.abs(scrollProgress - asteroidScrollPos);
    if (asteroidDist < 0.15) {
      const asteroidVis = 1 - asteroidDist / 0.15;
      const aOffset = (scrollProgress - asteroidScrollPos) * height * 0.2;

      // Seed-based pseudo-random positions for consistency
      for (let a = 0; a < 15; a++) {
        const seed = a * 137.508; // golden angle for distribution
        const ax = width * 0.4 + Math.sin(seed) * width * 0.2 + Math.cos(seed * 2.3) * 40;
        const ay = height * 0.5 + Math.cos(seed) * height * 0.12 + aOffset;
        const aSize = Math.max(0.5, 1 + Math.sin(seed * 3.7) * 1.5);
        const aAlpha = asteroidVis * 0.06 * (0.5 + Math.sin(seed * 5.1) * 0.5);

        ctx.beginPath();
        ctx.arc(ax, ay, aSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160, 140, 120, ${aAlpha})`;
        ctx.fill();
      }
    }

    // ====== COMET — Current exploration (§17) ======
    // A single comet that appears in the mid-journey, moving across the screen
    const cometScrollPos = 0.30;
    const cometDist = Math.abs(scrollProgress - cometScrollPos);
    if (cometDist < 0.12) {
      const cometVis = 1 - cometDist / 0.12;
      const cometX = width * (0.3 + time * 0.0002 % 0.4);
      const cometY = height * 0.2 + (scrollProgress - cometScrollPos) * height * 0.3;
      const cometAlpha = cometVis * 0.15;

      // Comet tail
      const tailLen = 60;
      const tailGrad = ctx.createLinearGradient(
        cometX - tailLen, cometY + tailLen * 0.3,
        cometX, cometY
      );
      tailGrad.addColorStop(0, 'transparent');
      tailGrad.addColorStop(1, `rgba(212, 168, 83, ${cometAlpha * 0.5})`);
      ctx.beginPath();
      ctx.moveTo(cometX - tailLen, cometY + tailLen * 0.3);
      ctx.lineTo(cometX, cometY);
      ctx.strokeStyle = tailGrad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Comet head
      ctx.beginPath();
      ctx.arc(cometX, cometY, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 240, 220, ${cometAlpha})`;
      ctx.fill();

      // Comet glow
      const cGlow = ctx.createRadialGradient(cometX, cometY, 0, cometX, cometY, 10);
      cGlow.addColorStop(0, `rgba(212, 168, 83, ${cometAlpha * 0.4})`);
      cGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = cGlow;
      ctx.beginPath();
      ctx.arc(cometX, cometY, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // ====== VIGNETTE — subtle edge darkening ======
    const vignette = ctx.createRadialGradient(
      centerX, centerY, height * 0.3,
      centerX, centerY, height * 0.85
    );
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(1, `rgba(2, 2, 5, 0.4)`);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starsRef.current = createStars(canvas.width, canvas.height);
      documentHeightRef.current = document.documentElement.scrollHeight;
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    let lastFrame = 0;
    function tick(now: number) {
      if (now - lastFrame >= 32 && !document.hidden) {
        draw();
        lastFrame = now;
      }
      animationRef.current = requestAnimationFrame(tick);
    }
    animationRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationRef.current);
    };
  }, [createStars, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="space-canvas"
      aria-hidden="true"
    />
  );
}
