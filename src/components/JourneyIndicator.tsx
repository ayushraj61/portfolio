'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { journeyStops, scrollToStop } from '@/data/journey';
import RocketMark from './RocketMark';

// ========================================
// JOURNEY INDICATOR — Side navigation dots
// Per DESIGN.txt §23: "The spaceship should move forward"
// Shows scroll progress through journey sections
// ========================================

const sections = journeyStops;

type ArrivalSignal = {
  key: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export default function JourneyIndicator() {
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const [targetIndex, setTargetIndex] = useState(1);
  const [arrivalSignal, setArrivalSignal] = useState<ArrivalSignal | null>(null);
  const flightShipRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const approach = useMotionValue(0);
  const smoothProgress = useSpring(progress, { stiffness: 150, damping: 27, mass: 0.45 });
  const reduceMotion = useReducedMotion();
  const shipPosition = useTransform(reduceMotion ? progress : smoothProgress, (value) => `${value}%`);
  const cueX = useTransform(approach, [0, 0.7, 1], [0, 0, -42]);
  const cueOpacity = useTransform(approach, [0, 0.78, 1], [1, 1, 0]);

  useEffect(() => {
    let frame = 0;
    let lastScrollY = window.scrollY;
    let travelDirection: 'up' | 'down' = 'down';
    let upwardTarget: number | null = null;
    let previousActiveIndex = 0;
    let armedTarget: string | null = null;
    let initialized = false;
    let initializedShip = false;

    const updatePosition = () => {
      const scrollY = window.scrollY;
      const launchDistance = Math.max(300, Math.min(window.innerHeight * 0.46, 420));
      const launchProgress = Math.min(Math.max(scrollY / launchDistance, 0), 1);
      setVisible(launchProgress > 0.72);
      const moved = Math.abs(scrollY - lastScrollY) > 2;
      if (moved) {
        const newDirection = scrollY > lastScrollY ? 'down' : 'up';
        if (newDirection !== travelDirection) upwardTarget = null;
        travelDirection = newDirection;
        setDirection(newDirection);
      }
      lastScrollY = scrollY;

      const scrollPos = scrollY + window.innerHeight * 0.42;
      const stops = sections.map((section) => document.getElementById(section.id)?.offsetTop ?? 0);
      let activeIndex = 0;

      for (let i = sections.length - 1; i >= 0; i--) {
        if (stops[i] <= scrollPos) {
          activeIndex = i;
          break;
        }
      }

      setActiveSection(sections[activeIndex].id);
      const nextIndex = Math.min(activeIndex + 1, sections.length - 1);
      const distance = stops[nextIndex] - stops[activeIndex];
      const betweenStops = distance > 0 ? Math.min(Math.max((scrollPos - stops[activeIndex]) / distance, 0), 1) : 0;
      const journeyProgress = (activeIndex + betweenStops) / (sections.length - 1);
      progress.set(journeyProgress * 100);

      const ship = flightShipRef.current;
      const launchPoint = document.querySelector('.hero-launch-point');
      const rail = document.querySelector('.journey-rail');
      if (ship && launchPoint && rail) {
        const reduceFlightMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const launchRect = launchPoint.getBoundingClientRect();
        const railRect = rail.getBoundingClientRect();
        const startX = launchRect.left + 5;
        const startY = launchRect.top + 5;
        const endX = railRect.left + railRect.width / 2 - 22;
        const endY = railRect.top + railRect.height * journeyProgress;
        const t = reduceFlightMotion ? 1 : launchProgress * launchProgress * (3 - 2 * launchProgress);
        const controlX = startX + (endX - startX) * 0.66;
        const controlY = Math.min(startY, endY) - Math.min(110, window.innerHeight * 0.12);
        const inverse = 1 - t;
        const x = inverse * inverse * startX + 2 * inverse * t * controlX + t * t * endX;
        const y = inverse * inverse * startY + 2 * inverse * t * controlY + t * t * endY;
        const rotation = travelDirection === 'up'
          ? -105 + 105 * t
          : 70 + 110 * t;

        if (!initializedShip) ship.style.transition = 'none';
        ship.style.transform = `translate3d(${x - 17}px, ${y - 31}px, 0) rotate(${rotation}deg)`;
        ship.style.opacity = String(reduceFlightMotion ? Number(launchProgress === 1) : Math.min(1, scrollY / 36));
        if (!initializedShip) {
          initializedShip = true;
          requestAnimationFrame(() => { ship.style.transition = ''; });
        }
      }

      let arrivalIndex = activeIndex + 1;
      let approachValue = betweenStops;
      if (travelDirection === 'up') {
        if (upwardTarget === null) {
          // The heading may already be visible before its section passes the
          // scroll threshold. Use the visible section to avoid skipping a stop
          // when someone reverses direction near a section boundary.
          let visibleSectionIndex = 0;
          for (let i = 1; i < sections.length; i++) {
            const rect = document.getElementById(sections[i].id)?.getBoundingClientRect();
            if (rect && rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2) {
              visibleSectionIndex = i;
            }
          }
          upwardTarget = Math.max(previousActiveIndex, activeIndex, visibleSectionIndex) - 1;
        }
        while (upwardTarget >= 0) {
          const headingTop = document.getElementById(sections[upwardTarget].id)?.querySelector('h2')?.getBoundingClientRect().top;
          if (headingTop === undefined || headingTop < 140) break;
          upwardTarget--;
        }
        arrivalIndex = upwardTarget;
        const headingTop = arrivalIndex >= 0
          ? document.getElementById(sections[arrivalIndex].id)?.querySelector('h2')?.getBoundingClientRect().top
          : undefined;
        approachValue = headingTop === undefined ? 0 : Math.min(Math.max((headingTop + 200) / 340, 0), 1);
      }

      previousActiveIndex = activeIndex;

      setTargetIndex(arrivalIndex);
      approach.set(approachValue);

      const destination = sections[arrivalIndex];
      const arrivalKey = destination ? `${travelDirection}-${destination.id}` : null;
      if (approachValue < 0.55) armedTarget = null;

      if (
        initialized && moved && destination && arrivalKey !== armedTarget && approachValue > 0.78 &&
        window.innerWidth >= 1280 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        const marker = document.querySelector(`[data-journey-stop="${destination.id}"] .journey-dot`);
        const heading = document.getElementById(destination.id)?.querySelector('h2');
        const markerRect = marker?.getBoundingClientRect();
        const headingRect = heading?.getBoundingClientRect();

        if (markerRect && headingRect && headingRect.top > 70 && headingRect.top < window.innerHeight - 30) {
          armedTarget = arrivalKey;
          setArrivalSignal({
            key: `${arrivalKey}-${Date.now()}`,
            startX: markerRect.left + markerRect.width / 2,
            startY: markerRect.top + markerRect.height / 2,
            endX: Math.min(headingRect.right, window.innerWidth * 0.72),
            endY: headingRect.top + headingRect.height / 2,
          });
        }
      }

      initialized = true;
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updatePosition);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [progress, approach]);

  const handleClick = (id: string) => {
    setHoveredSection(null);
    scrollToStop(id);
  };

  const targetSection = sections[targetIndex];

  return (
    <AnimatePresence>
        <motion.nav
          key="journey-navigation"
          className="journey-indicator"
          initial={false}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.36 }}
          style={{ pointerEvents: visible ? 'auto' : 'none' }}
          aria-label="Journey progress"
          aria-hidden={!visible}
          inert={!visible}
        >
          <div className="journey-rail" aria-hidden="true">
            <motion.div className="journey-rail-traveled" style={{ height: shipPosition }} />
          </div>

          {sections.map((section) => (
            <div
              key={section.id}
              data-journey-stop={section.id}
              className="journey-station"
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <button
                className={`journey-dot ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => handleClick(section.id)}
                aria-label={`Navigate to ${section.label}: ${section.heading}`}
                title={activeSection === section.id ? undefined : `${section.label} · ${section.heading}`}
              />

              {targetSection?.id === section.id && (
                <motion.button
                  type="button"
                  className="journey-next-cue"
                  initial={false}
                  style={reduceMotion ? undefined : { x: cueX, opacity: cueOpacity }}
                  onClick={() => handleClick(section.id)}
                  aria-label={`Travel to ${section.label}: ${section.heading}`}
                >
                  <small>NEXT {direction === 'up' ? '↑' : '↓'} / {String(targetIndex + 1).padStart(2, '0')}</small>
                  <strong>{section.label}</strong>
                </motion.button>
              )}

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredSection === section.id && activeSection !== section.id && targetSection?.id !== section.id && (
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      right: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.6rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: activeSection === section.id ? 'var(--accent)' : 'var(--text-dim)',
                      whiteSpace: 'nowrap',
                      background: 'var(--bg-surface)',
                      padding: '0.3rem 0.6rem',
                      border: '1px solid var(--border)',
                    }}
                  >
                    {section.heading}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.nav>
      <div key="journey-ship" ref={flightShipRef} className="journey-flight-ship" aria-hidden="true">
        <RocketMark />
      </div>
      {arrivalSignal && (
        <motion.span
          key={arrivalSignal.key}
          className="journey-arrival-signal"
          aria-hidden="true"
          initial={{ left: arrivalSignal.startX, top: arrivalSignal.startY, opacity: 0, scale: 0.6 }}
          animate={{
            left: arrivalSignal.endX,
            top: arrivalSignal.endY,
            opacity: [0, 1, 1, 0],
            scale: [0.6, 1, 1, 0.35],
          }}
          transition={{ duration: 0.75, ease: [0.2, 0.75, 0.2, 1], times: [0, 0.12, 0.75, 1] }}
          onAnimationComplete={() => setArrivalSignal((current) => current?.key === arrivalSignal.key ? null : current)}
        />
      )}
    </AnimatePresence>
  );
}
