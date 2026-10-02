'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { products, Product } from '@/data/products';
import SectionWrapper from './SectionWrapper';
import './ProductOrbit.css';

// Select the 4 flagship systems for the 3D orbital array
const targetIds = ['daknode', 'hyperflow', 'outlay', 'splitme'];
const flagshipProducts: Product[] = targetIds
  .map((id) => products.find((p) => p.id === id))
  .filter((p): p is Product => Boolean(p));

export default function ProductGrid() {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

  // References for pure 60fps DOM physics animation (zero re-render lag)
  const sceneRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Animation state refs (readable synchronously inside requestAnimationFrame)
  const activeIndexRef = useRef<number>(-1);
  const hoveredIndexRef = useRef<number>(-1);
  const isAmbientOrbitRef = useRef<boolean>(true);
  const globalAngleRef = useRef<number>(0);
  const scenePitchRef = useRef<number>(-7);

  // Synchronize state with animation refs
  useEffect(() => {
    activeIndexRef.current = activeIndex;
    isAmbientOrbitRef.current = activeIndex === -1;
  }, [activeIndex]);

  useEffect(() => {
    hoveredIndexRef.current = hoveredIndex;
  }, [hoveredIndex]);

  // Select project (locks blade & brings card to front center)
  const selectProject = useCallback((index: number) => {
    setActiveIndex((prev) => {
      if (prev === index) {
        // Tapping active project again releases back to ambient orbit
        return -1;
      }
      return index;
    });
  }, []);

  // Resume free ambient rotation
  const resumeAmbientOrbit = useCallback(() => {
    setActiveIndex(-1);
    setHoveredIndex(-1);
  }, []);

  // 60FPS 3D Physics Loop
  useEffect(() => {
    let animId: number;
    const cards = cardsRef.current;
    const scene = sceneRef.current;
    const core = coreRef.current;

    // Detect responsive dimensions (compact radius to save horizontal space)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const isTablet = typeof window !== 'undefined' && window.innerWidth < 1100;
    const ringRadius = isMobile ? 190 : isTablet ? 220 : 255;
    const extractedZ = isMobile ? 300 : isTablet ? 340 : 385;
    const backgroundZ = isMobile ? 150 : 205;

    // Initialize individual card physics states
    const cardPhysics = flagshipProducts.map((_, i) => ({
      tx: 0,
      ty: 0,
      tz: ringRadius,
      rotY: i * 90,
      scale: 1,
      opacity: 1,
    }));

    function lerp(start: number, end: number, amt: number) {
      return (1 - amt) * start + amt * end;
    }

    function mod(n: number, m: number) {
      return ((n % m) + m) % m;
    }

    function animate() {
      const isAmbient = isAmbientOrbitRef.current;
      const activeIdx = activeIndexRef.current;
      const hoveredIdx = hoveredIndexRef.current;

      if (isAmbient) {
        // Ambient orbit rotates continuously by default (increased by 25%)!
        globalAngleRef.current += 0.275;
      } else {
        // When active, rotate cylinder smoothly so target card faces front (angle = 0)
        const targetGlobalAngle = -(activeIdx * 90);
        const diff = mod(targetGlobalAngle - globalAngleRef.current + 180, 360) - 180;
        globalAngleRef.current += diff * 0.055;
      }

      // Smooth pitch
      scenePitchRef.current = lerp(scenePitchRef.current, isAmbient ? -8 : -5, 0.05);
      if (scene) {
        scene.style.transform = `rotateX(${scenePitchRef.current}deg)`;
      }

      // Singularity core pulse
      if (core) {
        core.style.transform = `translateZ(0) scale(${isAmbient ? 1 : 0.88})`;
      }

      // Update 3D coordinates for each card
      cardPhysics.forEach((p, i) => {
        const cardEl = cards[i];
        if (!cardEl) return;

        const isCurrentActive = !isAmbient && i === activeIdx;
        const orbitAngle = globalAngleRef.current + i * 90;

        let targetTx = 0;
        let targetTy = 0;
        let targetTz = ringRadius;
        let targetRotY = orbitAngle;
        let targetScale = 1;
        let targetOpacity = 1;

        if (isCurrentActive) {
          // EXTRACTED FORWARD FROM ORBIT TO VIEWER:
          targetTx = 0;
          targetTy = -5;
          targetTz = extractedZ;
          targetRotY = 0;
          targetScale = 1.06;
          targetOpacity = 1;
          cardEl.classList.remove('is-hover-scaled');
          cardEl.classList.add('is-extracted');
        } else if (!isAmbient) {
          // BACKGROUND ORBIT (when another card is focused):
          targetTx = 0;
          targetTy = 0;
          targetTz = backgroundZ;
          targetRotY = orbitAngle;
          targetScale = i === hoveredIdx ? 1.02 : 0.84;
          targetOpacity = i === hoveredIdx ? 0.72 : 0.38;
          cardEl.classList.remove('is-extracted');
          if (i === hoveredIdx) {
            cardEl.classList.add('is-hover-scaled');
          } else {
            cardEl.classList.remove('is-hover-scaled');
          }
        } else {
          // FREE CONTINUOUS AMBIENT ORBIT (DEFAULT STATE):
          targetTx = 0;
          targetTy = 0;
          targetRotY = orbitAngle;
          cardEl.classList.remove('is-extracted');

          if (i === hoveredIdx) {
            // Hovering left element increases card size during continuous rotation!
            targetScale = 1.18;
            targetTz = ringRadius + 18;
            targetOpacity = 1;
            cardEl.classList.add('is-hover-scaled');
          } else {
            targetScale = hoveredIdx !== -1 ? 0.94 : 0.98;
            targetTz = ringRadius;
            targetOpacity = hoveredIdx !== -1 ? 0.82 : 0.96;
            cardEl.classList.remove('is-hover-scaled');
          }
        }

        // Interpolation
        const speed = isCurrentActive ? 0.075 : 0.05;
        p.tx = lerp(p.tx, targetTx, speed);
        p.ty = lerp(p.ty, targetTy, speed);
        p.tz = lerp(p.tz, targetTz, speed);
        p.scale = lerp(p.scale, targetScale, speed);
        p.opacity = lerp(p.opacity, targetOpacity, speed);

        const rotDiff = mod(targetRotY - p.rotY + 180, 360) - 180;
        p.rotY += rotDiff * speed;

        // Apply 3D matrix transform
        cardEl.style.transform = `translateX(${p.tx}px) translateY(${p.ty}px) rotateY(${p.rotY}deg) translateZ(${p.tz}px) scale(${p.scale})`;
        cardEl.style.opacity = String(p.opacity);

        // Depth sorting
        const rad = (p.rotY * Math.PI) / 180;
        const apparentZ = Math.cos(rad) * p.tz;
        cardEl.style.zIndex = String(Math.round(apparentZ + 500));
      });

      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);

    // Keyboard navigation
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        const next = activeIndexRef.current === -1 ? 0 : (activeIndexRef.current + 1) % 4;
        selectProject(next);
      } else if (e.key === 'ArrowUp') {
        const prev = activeIndexRef.current === -1 ? 3 : (activeIndexRef.current - 1 + 4) % 4;
        selectProject(prev);
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        selectProject(parseInt(e.key, 10) - 1);
      } else if (e.key === 'Escape') {
        resumeAmbientOrbit();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectProject, resumeAmbientOrbit]);

  return (
    <SectionWrapper className="section orbital-section universe-section" id="work" isDestination atmosphereColor="#475980">
      <div className="container">
        <div className="orbital-shell">
          
          {/* ===================================================
              LEFT SIDE: 3D Cybernetic Server Monolith Blades
              =================================================== */}
          <div className="orbital-left-panel">
            <div className="orbital-header">
              <div className="orbital-eyebrow">
                <span className="orbital-beacon-dot" />
                Destination 03 // Orbital Showcase
              </div>
              <motion.h2
                className="orbital-title"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6 }}
              >
                <span>Engineered Systems.</span>
              </motion.h2>
            </div>

            {/* The Docking Chassis */}
            <div className="orbital-dock-chassis">
              {flagshipProducts.map((product, index) => {
                const isActive = activeIndex === index;
                const formattedNum = String(index + 1).padStart(2, '0');

                return (
                  <div
                    key={product.id}
                    className={`orbital-blade ${isActive ? 'active' : ''}`}
                    data-node={index}
                    onClick={() => selectProject(index)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => {
                      setHoveredIndex((cur) => (cur === index ? -1 : cur));
                    }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    aria-label={`Inspect ${product.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectProject(index);
                      }
                    }}
                  >
                    <div className="orbital-blade-left">
                      <span className="orbital-node-num">{formattedNum}</span>
                      <div className="orbital-blade-stack">
                        <span className="orbital-blade-category">{product.category}</span>
                        <h3 className="orbital-blade-title">{product.name}</h3>
                      </div>
                    </div>
                    <div className="orbital-blade-right">
                      <span className="orbital-blade-pill">{product.status}</span>
                      <div className="orbital-status-diode" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===================================================
              RIGHT SIDE: 3D Black Hole & Orbital Extraction Stage
              =================================================== */}
          <div
            className="orbital-right-viewport"
            ref={viewportRef}
            onClick={(e) => {
              if (e.target === viewportRef.current || e.target === sceneRef.current) {
                resumeAmbientOrbit();
              }
            }}
          >
            <div className="orbital-scene3d" ref={sceneRef}>
              
              {/* Singularity Core & Accretion Ring */}
              <div className="orbital-galactic-core" ref={coreRef} />
              <div className="orbital-accretion-ring" />
              <div className="orbital-accretion-inner-ring" />

              {/* 3D Orbital Cards (Flat DOM, Driven by 60FPS JS Engine) */}
              {flagshipProducts.map((product, index) => {
                const isActive = activeIndex === index;
                const stationCode = `STATION // ${String(index + 1).padStart(2, '0')}`;
                const nodeCode = `SYS-0${index + 1}`;

                return (
                  <div
                    key={product.id}
                    ref={(el) => {
                      cardsRef.current[index] = el;
                    }}
                    id={`orbital-card-${index}`}
                    data-node={index}
                    className={`orbital-station-card ${isActive ? 'is-extracted' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectProject(index);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${product.name} orbital station card`}
                  >
                    <div className="orbital-card-top">
                      <span className="orbital-card-category">{product.category}</span>
                      <span className="orbital-card-station-id">{stationCode}</span>
                    </div>

                    <h3 className="orbital-card-title">{product.name}</h3>

                    <p className="orbital-card-desc">
                      {product.expandedDescription ?? product.description}
                    </p>

                    <div className="orbital-card-action-dock">
                      {product.url ? (
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="orbital-card-action-btn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          EXPLORE SYSTEM ↗
                        </a>
                      ) : (
                        <span className="orbital-card-node-code">ACTIVE DEV</span>
                      )}
                      <span className="orbital-card-node-code">{nodeCode}</span>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

        </div>
      </div>
    </SectionWrapper>
  );
}
