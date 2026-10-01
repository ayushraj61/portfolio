'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { journeyStops, scrollToStop } from '@/data/journey';

export default function Spaceship() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTravelling, setIsTravelling] = useState(false);
  const [railVisible, setRailVisible] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('down');

  useEffect(() => {
    let travelTimeout: ReturnType<typeof setTimeout>;
    let lastScrollY = window.scrollY;
    const update = () => {
      if (Math.abs(window.scrollY - lastScrollY) > 2) {
        setDirection(window.scrollY > lastScrollY ? 'down' : 'up');
      }
      lastScrollY = window.scrollY;
      setRailVisible(window.scrollY > 300);
      const threshold = window.scrollY + window.innerHeight * 0.42;
      for (let index = journeyStops.length - 1; index >= 0; index--) {
        const element = document.getElementById(journeyStops[index].id);
        if (element && element.offsetTop <= threshold) {
          setActiveIndex(index);
          break;
        }
      }
      setIsTravelling(true);
      clearTimeout(travelTimeout);
      travelTimeout = setTimeout(() => setIsTravelling(false), 180);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      clearTimeout(travelTimeout);
    };
  }, []);

  const isReturning = direction === 'up' && activeIndex > 0;
  const isRouteComplete = activeIndex === journeyStops.length - 1 && !isReturning;
  const next = journeyStops[isReturning ? activeIndex - 1 : activeIndex + 1] ?? journeyStops[0];

  return (
    <motion.button
      type="button"
      className={`ship-route-control ${isTravelling ? 'is-travelling' : ''} ${isReturning ? 'is-returning' : ''} ${railVisible ? 'is-absorbed-into-rail' : ''} ${journeyStops[activeIndex].id === 'work' || journeyStops[activeIndex].id === 'contact' ? 'is-hidden-on-mobile' : ''}`}
      onClick={() => scrollToStop(next.id)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.8 }}
      aria-label={isRouteComplete ? 'Return to Earth' : `Travel to ${next.label}`}
    >
      <span className="ship-route-icon" aria-hidden="true">
        <svg viewBox="0 0 32 34" fill="none">
          <path d="M16 2 5 28l11-6 11 6L16 2Z" fill="currentColor" />
          <path d="M16 6v15" stroke="#10131b" strokeWidth="1.5" />
        </svg>
        <span className="ship-route-thruster" />
      </span>
      <span className="ship-route-copy">
        <small>{isRouteComplete ? 'ROUTE COMPLETE' : isReturning ? 'NEXT STATION ABOVE' : 'NEXT DESTINATION'}</small>
        <strong>{next.label}</strong>
      </span>
      <span className="ship-route-arrow" aria-hidden="true">{isReturning ? '↑' : '↓'}</span>
    </motion.button>
  );
}
