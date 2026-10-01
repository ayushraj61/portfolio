'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '@/data/products';
import { getProductPlanet } from '@/lib/productPlanet';
import StatusBadge from './StatusBadge';
import SectionWrapper from './SectionWrapper';

const worlds = [...products].sort((a, b) => a.order - b.order);

export default function ProductGrid() {
  const [selectedId, setSelectedId] = useState('daknode');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLCanvasElement>(null);
  const selected = worlds.find((product) => product.id === selectedId) ?? worlds[0];
  const selectedIndex = worlds.findIndex((product) => product.id === selected.id);

  useEffect(() => {
    const canvas = sphereRef.current;
    if (!canvas) return;
    const texture = getProductPlanet(selected.id, selected.themeColor ?? '#d4a853');
    canvas.width = texture.width;
    canvas.height = texture.height;
    canvas.getContext('2d')?.drawImage(texture, 0, 0);
  }, [selected.id, selected.themeColor]);

  function selectWorld(id: string) {
    setSelectedId(id);
    setSelectedTech(null);
    if (window.innerWidth <= 1050) {
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        block: 'start',
      }));
    }
  }

  function stepWorld(direction: number) {
    selectWorld(worlds[(selectedIndex + direction + worlds.length) % worlds.length].id);
  }

  function inspectTech(tech: string) {
    setSelectedTech(selectedTech === tech ? null : tech);
    if (window.innerWidth <= 1050) {
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        block: 'start',
      }));
    }
  }

  return (
    <SectionWrapper className="section universe-section" id="work" isDestination atmosphereColor="#475980">
      <div className="container">
        <div className="universe-heading">
          <div>
            <p className="section-eyebrow"><span className="section-eyebrow-dot" /> Destination 03 / Product universe</p>
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, x: 54, clipPath: 'inset(0 0 0 18%)' }}
              whileInView={{ opacity: 1, x: 0, clipPath: 'inset(0 0 0 0%)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Things I&apos;ve built<span className="accent-period">.</span>
            </motion.h2>
          </div>
          <p className="universe-intro">Each world is a product, system, or experiment. Choose one to see what it does and what went into building it.</p>
        </div>

        <div className="universe-shell">
          <div className="universe-map" aria-label="Choose a product destination">
            <span className="orbit orbit-outer" aria-hidden="true" />
            <span className="orbit orbit-inner" aria-hidden="true" />
            <span className="universe-axis universe-axis-horizontal" aria-hidden="true" />
            <span className="universe-axis universe-axis-vertical" aria-hidden="true" />
            <span className="universe-crosshair" aria-hidden="true" />

            <div className="selected-world" style={{ '--world-color': selected.themeColor } as React.CSSProperties}>
              <span className="selected-world-glow" aria-hidden="true" />
              <canvas ref={sphereRef} className="selected-world-sphere" aria-hidden="true" />
              {(selected.technology ?? []).slice(0, 3).map((tech, index) => (
                <button
                  key={tech}
                  type="button"
                  className={`selected-world-moon selected-world-moon-${index} ${selectedTech === tech ? 'active' : ''}`}
                  onClick={() => inspectTech(tech)}
                  title={tech}
                  aria-label={`Inspect ${tech} used for ${selected.name}`}
                  aria-pressed={selectedTech === tech}
                />
              ))}
              <span className="selected-world-label">{selected.name}</span>
            </div>

            {worlds.filter((product) => product.id !== selected.id).map((product) => (
              <button
                key={product.id}
                type="button"
                className={`world-node world-node-${product.id}`}
                style={{ '--node-color': product.themeColor } as React.CSSProperties}
                onClick={() => selectWorld(product.id)}
                aria-label={`Explore ${product.name}`}
              >
                <span className="world-node-dot" aria-hidden="true" />
                <span className="world-node-name">{product.name.replace('HyperFlow Sales & Compliance AI', 'Sales & Compliance')}</span>
              </button>
            ))}
            <span className="universe-map-caption">SELECT A SIGNAL TO EXPLORE</span>
          </div>

          <div className="universe-panel" ref={panelRef} aria-live="polite">
            <div className="universe-panel-topline">
              <span>DESTINATION {String(selectedIndex + 1).padStart(2, '0')} / {String(worlds.length).padStart(2, '0')}</span>
              <StatusBadge status={selected.status} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="universe-panel-content"
              >
                <span className="universe-panel-category">{selected.category}</span>
                <h3>{selected.name}</h3>
                <p className="universe-panel-description">{selected.expandedDescription ?? selected.description}</p>
                {selected.whatItDoes && (
                  <div className="universe-fact">
                    <span>THE IDEA</span>
                    <p>{selected.whatItDoes}</p>
                  </div>
                )}
                <div className="universe-tech">
                  <span className="universe-meta-label">TECHNOLOGY / SATELLITES</span>
                  <div className="universe-tech-list">
                    {(selected.technology ?? []).map((tech) => (
                      <button
                        key={tech}
                        type="button"
                        className={selectedTech === tech ? 'active' : ''}
                        onClick={() => inspectTech(tech)}
                        aria-pressed={selectedTech === tech}
                      >
                        <span aria-hidden="true">✦</span> {tech}
                      </button>
                    ))}
                  </div>
                  <p className="universe-tech-note">{selectedTech ? `${selectedTech} is part of this product's listed stack.` : 'Select a satellite to inspect the stack.'}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="universe-panel-actions">
              {selected.url ? (
                <a href={selected.url} target="_blank" rel="noopener noreferrer" className="universe-visit">Visit {selected.name} <span aria-hidden="true">↗</span></a>
              ) : (
                <span className="universe-no-link">IN ACTIVE DEVELOPMENT</span>
              )}
              <div className="universe-steps">
                <button type="button" onClick={() => stepWorld(-1)} aria-label="Previous product">←</button>
                <button type="button" onClick={() => stepWorld(1)} aria-label="Next product">→</button>
              </div>
            </div>
          </div>
        </div>
        <p className="universe-footnote">A map of work in progress. “Building” and “experiment” are intentional labels, not finished-product claims.</p>
      </div>
    </SectionWrapper>
  );
}
