'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface LaunchFlightProps {
  onComplete: () => void;
  onSkip: () => void;
  onReset?: () => void;
}

interface MilestoneWaypoint {
  idx: number;
  x: number;
  y: number;
  stemDir: 'up' | 'down';
  stemLength: number;
  triggerProgress: number;
  year: string;
  yearColor?: string;
  headline: string;
  detail: string;
}

const WORLD_WIDTH = 2800;
const SVG_HEIGHT = 850;

const THREAD_SVG_D =
  'M 0 430 C 60 410, 110 390, 180 390 C 280 390, 390 470, 500 470 C 610 470, 710 390, 820 390 C 930 390, 1030 470, 1140 470 C 1250 470, 1360 390, 1480 390 C 1600 390, 1700 470, 1820 470 C 1940 470, 2040 390, 2160 390 C 2280 390, 2380 470, 2500 470 C 2600 470, 2700 440, 2780 430';

const WAYPOINTS: MilestoneWaypoint[] = [
  {
    idx: 0,
    x: 180,
    y: 390,
    stemDir: 'up',
    stemLength: 75,
    triggerProgress: 0.06,
    year: '2023 · YEAR 01',
    headline: 'entered college & hacked early.',
    detail:
      'UIET Panjab University, Hoshiarpur. Studied Python, data structures, and core algorithms. Selected for Smart India Hackathon (SIH) in college and submitted initial prototype.',
  },
  {
    idx: 1,
    x: 500,
    y: 470,
    stemDir: 'down',
    stemLength: 75,
    triggerProgress: 0.18,
    year: '2023–2024 · THE SPARK',
    yearColor: '#38bdf8',
    headline: 'discovered a passion for ai & ml.',
    detail:
      'Developed a deep interest in artificial intelligence and machine learning. Started self-studying neural architectures, deep learning fundamentals, and predictive modeling.',
  },
  {
    idx: 2,
    x: 820,
    y: 390,
    stemDir: 'up',
    stemLength: 75,
    triggerProgress: 0.3,
    year: '2024 · YEAR 02',
    yearColor: '#f59e0b',
    headline: 'built for indian railways.',
    detail:
      'Python developer summer intern at RDSO (Ministry of Railways). Built custom automated Word document generator for standardized reports, accelerating generation by over 90%.',
  },
  {
    idx: 3,
    x: 1140,
    y: 470,
    stemDir: 'down',
    stemLength: 75,
    triggerProgress: 0.42,
    year: '2024 · ARCHITECTURE',
    yearColor: '#06b6d4',
    headline: 'the backend revelation.',
    detail:
      'Realized that without robust backends and system design, intelligent AI systems cannot function in production. Shifted focus to distributed architectures, high-concurrency systems, and scalable APIs.',
  },
  {
    idx: 4,
    x: 1480,
    y: 390,
    stemDir: 'up',
    stemLength: 75,
    triggerProgress: 0.55,
    year: '2025 · YEAR 03 (8–9 MOS)',
    yearColor: '#38bdf8',
    headline: 'scaled production ai at b3 solutions.',
    detail:
      '8–9 month AI developer internship in Chandigarh. Built production multi-stage OCR pipelines (90% accuracy) and Celery + Redis async workers cutting duplicate entries by 99%.',
  },
  {
    idx: 5,
    x: 1820,
    y: 470,
    stemDir: 'down',
    stemLength: 75,
    triggerProgress: 0.68,
    year: '2025 · PRODUCT SUITE',
    yearColor: '#a855f7',
    headline: 'shipped outlay & consumer systems.',
    detail:
      'Engineered and shipped full-stack platforms: Outlay (distributed financial platform & tracking) and SplitMe (collaborative group expense engine) with real-time state synchronization.',
  },
  {
    idx: 6,
    x: 2160,
    y: 390,
    stemDir: 'up',
    stemLength: 75,
    triggerProgress: 0.81,
    year: '2025–2026 · HYPERFLOW AUTOMATION',
    yearColor: '#f43f5e',
    headline: 'engineered hyperflow automation systems.',
    detail:
      'Set up and engineered Hyperflow automation systems — designing autonomous workflows to automate operational processes, business platforms, and distributed data pipelines.',
  },
  {
    idx: 7,
    x: 2500,
    y: 470,
    stemDir: 'down',
    stemLength: 75,
    triggerProgress: 0.93,
    year: '2026 · PRESENT',
    yearColor: '#10b981',
    headline: 'founding engineer at daknode.',
    detail:
      'Architecting autonomous agent email infrastructure: programmatic email identities, headless inboxes, webhook event buses, and developer APIs for AI agents.',
  },
];

export default function LaunchFlight({ onComplete, onSkip, onReset }: LaunchFlightProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldTrackRef = useRef<HTMLDivElement>(null);
  const pathMainRef = useRef<SVGPathElement>(null);
  const pathGlowRef = useRef<SVGPathElement>(null);
  const pathShadowRef = useRef<SVGPathElement>(null);
  const stemsGroupRef = useRef<SVGGElement>(null);
  const waypointsGroupRef = useRef<SVGGElement>(null);
  const navigatorRef = useRef<HTMLDivElement>(null);
  const flashFlareRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const completeRef = useRef(onComplete);
  const skipRef = useRef(onSkip);
  const resetRef = useRef(onReset);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);
  useEffect(() => {
    skipRef.current = onSkip;
  }, [onSkip]);
  useEffect(() => {
    resetRef.current = onReset;
  }, [onReset]);

  const isTransitioningRef = useRef(false);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const animFrameRef = useRef(0);

  // Position cards with safe vertical clearance
  const positionMilestoneCards = useCallback(() => {
    const scaleY = window.innerHeight / SVG_HEIGHT;
    const cardWidth = window.innerWidth < 768 ? 275 : 320;

    WAYPOINTS.forEach((m) => {
      const card = document.getElementById(`milestone-card-${m.idx}`);
      if (!card) return;

      const cardLeft = m.x - cardWidth / 2;
      card.style.left = `${cardLeft}px`;
      card.style.width = `${cardWidth}px`;
      card.style.transform = 'none';

      if (m.stemDir === 'up') {
        const termDotScreenY = (m.y - m.stemLength) * scaleY;
        card.style.bottom = `${window.innerHeight - termDotScreenY + 16}px`;
        card.style.top = 'auto';
      } else {
        const termDotScreenY = (m.y + m.stemLength) * scaleY;
        card.style.top = `${termDotScreenY + 16}px`;
        card.style.bottom = 'auto';
      }
    });
  }, []);

  // Climax trigger into portfolio hero
  const triggerArrivalTransition = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    cancelAnimationFrame(animFrameRef.current);

    if (flashFlareRef.current) {
      flashFlareRef.current.style.opacity = '0.95';
    }

    setTimeout(() => {
      completeRef.current();
    }, 280);
  }, []);

  const handleSkip = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    cancelAnimationFrame(animFrameRef.current);

    if (flashFlareRef.current) {
      flashFlareRef.current.style.opacity = '0.95';
    }

    setTimeout(() => {
      skipRef.current();
    }, 200);
  }, []);

  const handleReset = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    if (resetRef.current) {
      resetRef.current();
    } else {
      targetProgressRef.current = 0;
      currentProgressRef.current = 0;
      isTransitioningRef.current = false;
      if (flashFlareRef.current) flashFlareRef.current.style.opacity = '0';
      if (worldTrackRef.current) worldTrackRef.current.style.transform = 'translateX(0px)';
    }
  }, []);

  // Update visual elements according to progress
  const updateMilestonePresence = useCallback((m: MilestoneWaypoint, progress: number) => {
    const stem = document.getElementById(`stem-line-${m.idx}`);
    const cdot = document.getElementById(`center-dot-${m.idx}`);
    const tdot = document.getElementById(`term-dot-${m.idx}`);
    const card = document.getElementById(`milestone-card-${m.idx}`);

    const appearThreshold = m.triggerProgress - 0.035;
    const isReached = progress >= appearThreshold;

    if (!isReached) {
      if (stem) {
        stem.setAttribute('y2', stem.getAttribute('y1') || `${m.y}`);
        stem.classList.remove('active');
      }
      if (cdot) cdot.setAttribute('opacity', '0');
      if (tdot) tdot.setAttribute('opacity', '0');
      if (card) card.classList.remove('visible', 'is-active');
      return;
    }

    const growthRatio = Math.min(1, Math.max(0, (progress - appearThreshold) / 0.035));
    const targetY = m.stemDir === 'up' ? m.y - m.stemLength : m.y + m.stemLength;
    const currentY = m.y + (targetY - m.y) * growthRatio;

    if (stem) {
      stem.setAttribute('y2', `${currentY}`);
      if (growthRatio >= 0.95) stem.classList.add('active');
      else stem.classList.remove('active');
    }

    if (cdot) cdot.setAttribute('opacity', growthRatio > 0.1 ? '1' : '0');
    if (tdot) tdot.setAttribute('opacity', growthRatio >= 0.95 ? '1' : '0');

    if (card) {
      if (growthRatio >= 0.4) {
        card.classList.add('visible');
      } else {
        card.classList.remove('visible');
      }

      const isNear = Math.abs(progress - m.triggerProgress) < 0.065;
      if (isNear) {
        card.classList.add('is-active');
      } else {
        card.classList.remove('is-active');
      }
    }
  }, []);

  const updateVisualization = useCallback(
    (progress: number) => {
      const pathMain = pathMainRef.current;
      const pathGlow = pathGlowRef.current;
      const pathShadow = pathShadowRef.current;
      const navigatorEl = navigatorRef.current;
      const worldTrack = worldTrackRef.current;

      if (!pathMain || !navigatorEl || !worldTrack) return;

      const clampedProgress = Math.max(0, Math.min(1, progress));
      const pathLength = pathMain.getTotalLength();
      const currentDist = pathLength * clampedProgress;
      const offset = pathLength * (1 - clampedProgress);

      pathMain.style.strokeDashoffset = `${offset}`;
      if (pathGlow) pathGlow.style.strokeDashoffset = `${offset}`;
      if (pathShadow) pathShadow.style.strokeDashoffset = `${offset}`;

      const pt = pathMain.getPointAtLength(currentDist);
      const scaleY = window.innerHeight / SVG_HEIGHT;

      navigatorEl.style.left = `${pt.x}px`;
      navigatorEl.style.top = `${pt.y * scaleY}px`;

      // Fill window first, then horizontal scroll
      const fillThreshold = window.innerWidth * 0.68;
      let targetCamX = 0;

      if (pt.x > fillThreshold) {
        targetCamX = -(pt.x - fillThreshold);
        const minCamX = -(WORLD_WIDTH - window.innerWidth);
        targetCamX = Math.max(minCamX, Math.min(0, targetCamX));
      }

      worldTrack.style.transform = `translateX(${targetCamX}px)`;

      WAYPOINTS.forEach((m) => {
        updateMilestonePresence(m, clampedProgress);
      });
    },
    [updateMilestonePresence]
  );

  // Main physics loop
  useEffect(() => {
    let running = true;

    const renderLoop = () => {
      if (!running || isTransitioningRef.current) return;

      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.12;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      updateVisualization(currentProgressRef.current);
      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [updateVisualization]);

  // SVG Initialization & Stars canvas
  useEffect(() => {
    // 1. Ambient Stars
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let starFrame = 0;
        let w = (canvas.width = window.innerWidth);
        let h = (canvas.height = window.innerHeight);

        const stars = Array.from({ length: 180 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.3 + 0.3,
          alpha: Math.random() * 0.7 + 0.2,
          speed: Math.random() * 0.02 + 0.005,
        }));

        const drawStars = () => {
          ctx.fillStyle = '#050811';
          ctx.fillRect(0, 0, w, h);
          for (const s of stars) {
            s.alpha += Math.sin(Date.now() * s.speed) * 0.008;
            ctx.fillStyle = `rgba(215, 229, 250, ${Math.max(0.12, Math.min(0.85, s.alpha))})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
          }
          starFrame = requestAnimationFrame(drawStars);
        };
        drawStars();

        const handleResize = () => {
          w = canvas.width = window.innerWidth;
          h = canvas.height = window.innerHeight;
          positionMilestoneCards();
        };

        window.addEventListener('resize', handleResize);
        return () => {
          cancelAnimationFrame(starFrame);
          window.removeEventListener('resize', handleResize);
        };
      }
    }
  }, [positionMilestoneCards]);

  // Set up SVG path strokes & dynamic elements
  useEffect(() => {
    const pathMain = pathMainRef.current;
    const pathGlow = pathGlowRef.current;
    const pathShadow = pathShadowRef.current;
    const stemsGroup = stemsGroupRef.current;
    const waypointsGroup = waypointsGroupRef.current;

    if (!pathMain || !pathGlow || !pathShadow || !stemsGroup || !waypointsGroup) return;

    pathMain.setAttribute('d', THREAD_SVG_D);
    pathGlow.setAttribute('d', THREAD_SVG_D);
    pathShadow.setAttribute('d', THREAD_SVG_D);

    const pathLength = pathMain.getTotalLength();
    pathMain.style.strokeDasharray = `${pathLength}`;
    pathMain.style.strokeDashoffset = `${pathLength}`;
    pathGlow.style.strokeDasharray = `${pathLength}`;
    pathGlow.style.strokeDashoffset = `${pathLength}`;
    pathShadow.style.strokeDasharray = `${pathLength}`;
    pathShadow.style.strokeDashoffset = `${pathLength}`;

    stemsGroup.innerHTML = '';
    waypointsGroup.innerHTML = '';

    WAYPOINTS.forEach((m) => {
      const targetY = m.stemDir === 'up' ? m.y - m.stemLength : m.y + m.stemLength;

      const stemLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      stemLine.setAttribute('x1', `${m.x}`);
      stemLine.setAttribute('y1', `${m.y}`);
      stemLine.setAttribute('x2', `${m.x}`);
      stemLine.setAttribute('y2', `${m.y}`);
      stemLine.setAttribute('id', `stem-line-${m.idx}`);
      stemLine.setAttribute('class', 'stem-line');
      stemsGroup.appendChild(stemLine);

      const centerDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      centerDot.setAttribute('cx', `${m.x}`);
      centerDot.setAttribute('cy', `${m.y}`);
      centerDot.setAttribute('r', '5');
      centerDot.setAttribute('id', `center-dot-${m.idx}`);
      centerDot.setAttribute('class', 'waypoint-origin-dot');
      centerDot.setAttribute('opacity', '0');
      waypointsGroup.appendChild(centerDot);

      const termDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      termDot.setAttribute('cx', `${m.x}`);
      termDot.setAttribute('cy', `${targetY}`);
      termDot.setAttribute('r', '4');
      termDot.setAttribute('id', `term-dot-${m.idx}`);
      termDot.setAttribute('class', 'waypoint-terminal-dot');
      termDot.setAttribute('opacity', '0');
      waypointsGroup.appendChild(termDot);
    });

    positionMilestoneCards();
  }, [positionMilestoneCards]);

  // Interactive Wheel, Touch, and Keyboard Listeners
  useEffect(() => {
    const hideHint = () => {
      if (hintRef.current) hintRef.current.style.opacity = '0.15';
    };

    const handleWheel = (e: WheelEvent) => {
      if (isTransitioningRef.current) return;
      hideHint();

      const delta = e.deltaY;
      const factor = e.deltaMode === 1 ? 0.022 : 0.00065;
      targetProgressRef.current = Math.max(0, Math.min(1.02, targetProgressRef.current + delta * factor));

      if (targetProgressRef.current >= 0.999) {
        triggerArrivalTransition();
      }
    };

    let touchStartY = 0;
    let touchStartX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isTransitioningRef.current) return;
      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      const delta = touchStartY - touchY + (touchStartX - touchX);
      touchStartY = touchY;
      touchStartX = touchX;

      hideHint();
      targetProgressRef.current = Math.max(0, Math.min(1.02, targetProgressRef.current + delta * 0.0018));

      if (targetProgressRef.current >= 0.999) {
        triggerArrivalTransition();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') handleReset();
      if (e.key === 'Escape') handleSkip();

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        hideHint();
        targetProgressRef.current = Math.min(1.0, targetProgressRef.current + 0.05);
        if (targetProgressRef.current >= 0.999) triggerArrivalTransition();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        hideHint();
        targetProgressRef.current = Math.max(0, targetProgressRef.current - 0.05);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [triggerArrivalTransition, handleReset, handleSkip]);

  return (
    <div className="living-thread-stage">
      <canvas ref={canvasRef} className="thread-ambient-canvas" />

      {/* Topline Status Header */}
      <div className="thread-topline">
        <div>
          <h2 className="thread-header-title">the trajectory of an engineer.</h2>
          <p className="thread-header-sub">CHRONOLOGICAL CHAPTERS · 2023 ➔ 2026</p>
        </div>
        <div className="thread-topline-actions">
          <div className="thread-scroll-indicator">
            <span>Scroll to Explore ↓</span>
          </div>
          <button
            type="button"
            className="thread-skip-btn"
            onClick={handleSkip}
            aria-label="Skip to portfolio"
          >
            Skip ↗
          </button>
        </div>
      </div>

      {/* 2800px Horizontal World Track */}
      <div ref={worldTrackRef} className="thread-world-track">
        <svg
          className="thread-svg-layer"
          viewBox={`0 0 ${WORLD_WIDTH} ${SVG_HEIGHT}`}
          preserveAspectRatio="none"
        >
          <path ref={pathShadowRef} className="thread-path-shadow" d="" />
          <path ref={pathGlowRef} className="thread-path-glow" d="" />
          <path ref={pathMainRef} className="thread-path-main" d="" />
          <g ref={stemsGroupRef} id="stems-group" />
          <g ref={waypointsGroupRef} id="waypoints-group" />
        </svg>

        {/* Traveling Navigator Dot */}
        <div ref={navigatorRef} className="thread-navigator">
          <div className="nav-oval-head" />
        </div>

        {/* 8 Milestone DOM Cards */}
        <div className="milestones-layer">
          {WAYPOINTS.map((m) => (
            <div
              key={m.idx}
              id={`milestone-card-${m.idx}`}
              className={`milestone-block ${m.stemDir === 'up' ? 'stem-up' : 'stem-down'}`}
            >
              <div
                className="milestone-year"
                style={m.yearColor ? { color: m.yearColor } : undefined}
              >
                <span className="milestone-year-dot" />
                {m.year}
              </div>
              <h3 className="milestone-headline">{m.headline}</h3>
              <p className="milestone-detail">{m.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Scroll Helper */}
      <div ref={hintRef} className="floating-scroll-hint">
        <div className="scroll-mouse-icon">
          <div className="scroll-mouse-wheel" />
        </div>
        <span>Scroll mouse wheel or trackpad to explore · You&apos;re in control</span>
      </div>

      {/* Flash Flare Transition Climax */}
      <div ref={flashFlareRef} className="flash-flare" />
    </div>
  );
}
