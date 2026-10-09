'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { experienceData, products, techStack } from '@/data/products';

type DestinationId = 'building' | 'products' | 'technology' | 'experience';

interface UniverseConfig {
  id: DestinationId;
  number: string;
  name: string;
  shortName: string;
  classification: string;
  coordinates: string;
  eyebrow: string;
  intro: string;
  color: string;
  accentGlow: string;
  section: string;
  status: string;
  // Position in the sky (percentages)
  skyDesktop: { x: number; y: number };
  skyMobile: { x: number; y: number };
}

const universes: UniverseConfig[] = [
  {
    id: 'building',
    number: '01',
    name: 'DakNode Station',
    shortName: 'DakNode',
    classification: 'ACTIVE PULSAR · PROTOCOL STATION',
    coordinates: 'RA 14h 29m // DEC +62°',
    eyebrow: 'Current Build · In Active Development',
    intro: 'The communication and infrastructure layer for autonomous AI agents.',
    color: '#e5b967',
    accentGlow: 'rgba(229, 185, 103, 0.45)',
    section: 'building',
    status: 'BROADCASTING TELEMETRY',
    skyDesktop: { x: 49, y: 31 },
    skyMobile: { x: 26, y: 16 },
  },
  {
    id: 'products',
    number: '02',
    name: 'Product Universe',
    shortName: 'Products',
    classification: 'ORBITAL FLEET · 5 DEPLOYED SYSTEMS',
    coordinates: 'RA 18h 45m // DEC +38°',
    eyebrow: 'Deployed Systems & Ventures',
    intro: 'Useful ideas, business automation, and production products in stable orbit.',
    color: '#60a5fa',
    accentGlow: 'rgba(96, 165, 250, 0.45)',
    section: 'work',
    status: '5 ORBITS ACTIVE',
    skyDesktop: { x: 72, y: 24 },
    skyMobile: { x: 74, y: 16 },
  },
  {
    id: 'technology',
    number: '03',
    name: 'Tech Galaxy',
    shortName: 'Tech Stack',
    classification: 'NEURAL CLUSTER · ARCHITECTURE',
    coordinates: 'RA 21h 12m // DEC +48°',
    eyebrow: 'Engineering Engine & AI Depth',
    intro: 'The specialized models, distributed backends, and architectures behind my systems.',
    color: '#34d399',
    accentGlow: 'rgba(52, 211, 153, 0.45)',
    section: 'tech-depth',
    status: 'SYSTEM HEALTH 100%',
    skyDesktop: { x: 53, y: 51 },
    skyMobile: { x: 30, y: 26 },
  },
  {
    id: 'experience',
    number: '04',
    name: 'Mission Log',
    shortName: 'Experience',
    classification: 'CHRONO BEACON · FLIGHT PATH',
    coordinates: 'RA 23h 59m // DEC +55°',
    eyebrow: 'Career Flight Path & Impact',
    intro: 'Production systems shipped, real-world problems solved, and engineering breakthroughs.',
    color: '#c084fc',
    accentGlow: 'rgba(192, 132, 252, 0.45)',
    section: 'experience',
    status: 'ARCHIVE VERIFIED',
    skyDesktop: { x: 76, y: 46 },
    skyMobile: { x: 76, y: 26 },
  },
];

const selectedProducts = products.filter((product) =>
  ['hyperflow', 'outlay', 'splitme', 'outfund', 'statechat'].includes(product.id)
);

// Interactive DakNode architecture node
interface ArchNode {
  id: string;
  label: string;
  role: string;
  x: number;
  y: number;
  type: 'agent' | 'core' | 'queue' | 'delivery' | 'security';
}

const dakNodeGraph: ArchNode[] = [
  { id: 'agent', label: 'Autonomous AI Agent', role: 'Inbound / Outbound Requester', x: 15, y: 32, type: 'agent' },
  { id: 'auth', label: 'Zero-Trust Gate', role: 'Token Verification & Sandboxing', x: 38, y: 32, type: 'security' },
  { id: 'core', label: 'DakNode Engine', role: 'Core Event Broker & Routing', x: 55, y: 50, type: 'core' },
  { id: 'queue', label: 'Redis Event Queue', role: 'Sub-15ms Async Pipeline', x: 72, y: 32, type: 'queue' },
  { id: 'inbox', label: 'Agent Inboxes', role: 'Persistent Email Identities', x: 88, y: 50, type: 'delivery' },
  { id: 'webhook', label: 'Realtime Webhooks', role: 'Bidirectional Event Stream', x: 72, y: 68, type: 'delivery' },
];

function DestinationContent({ id }: { id: DestinationId }) {
  const [activeNode, setActiveNode] = useState<string | null>('core');

  if (id === 'building') {
    const daknode = products.find((product) => product.id === 'daknode')!;
    return (
      <div className="sky-atlas-feature sky-atlas-feature-building">
        <div className="sky-atlas-feature-copy">
          <div className="sky-atlas-telemetry-badge">
            <span className="telemetry-pulse" />
            <span>ACTIVE STATION TELEMETRY // DAKNODE PROTOCOL v0.4</span>
          </div>

          <h3 className="universe-hero-title">{daknode.name}</h3>
          <p className="universe-hero-desc">{daknode.expandedDescription}</p>

          <div className="sky-atlas-feature-specs">
            <div className="spec-item">
              <span className="spec-label">PERSISTENT INBOXES</span>
              <span className="spec-value">Programmatic OAuth, SPF, DKIM identities for AI agents</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">EVENT-DRIVEN WEBHOOKS</span>
              <span className="spec-value">Sub-15ms push delivery for autonomous incoming actions</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">ZERO-TRUST BOUNDARY</span>
              <span className="spec-value">Sandboxed agent communication preventing credential leaks</span>
            </div>
          </div>

          <div className="sky-atlas-tags">
            {daknode.tags.map((tag) => (
              <span key={tag} className="sky-tag-pill">{tag}</span>
            ))}
          </div>

          <div className="sky-atlas-action-row">
            <a
              href={daknode.url}
              target="_blank"
              rel="noopener noreferrer"
              className="sky-atlas-link-primary"
            >
              <span>Visit DakNode Platform</span>
              <span aria-hidden="true" className="link-arrow">↗</span>
            </a>
            <span className="sky-atlas-badge-live">● Live in active development</span>
          </div>
        </div>

        {/* Interactive Architecture Schematic */}
        <div className="sky-atlas-schematic-card">
          <div className="schematic-header">
            <div className="schematic-title-group">
              <span className="schematic-radar-dot" />
              <span className="schematic-title">COMMUNICATION TOPOLOGY SCHEMATIC</span>
            </div>
            <span className="schematic-freq">FREQ: 1420.4 MHz</span>
          </div>

          <div className="schematic-canvas">
            {/* Connection Lines (SVG) */}
            <svg className="schematic-svg-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e5b967" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.7" />
                </linearGradient>
              </defs>
              <line x1="15" y1="32" x2="38" y2="32" stroke="url(#lineGrad)" strokeWidth="0.8" strokeDasharray="2,2" />
              <line x1="38" y1="32" x2="55" y2="50" stroke="url(#lineGrad)" strokeWidth="0.8" />
              <line x1="55" y1="50" x2="72" y2="32" stroke="url(#lineGrad)" strokeWidth="0.8" />
              <line x1="72" y1="32" x2="88" y2="50" stroke="url(#lineGrad)" strokeWidth="0.8" strokeDasharray="2,2" />
              <line x1="55" y1="50" x2="72" y2="68" stroke="url(#lineGrad)" strokeWidth="0.8" />
              <circle cx="26" cy="32" r="1" fill="#e5b967" className="pulse-photon" />
              <circle cx="46" cy="41" r="1" fill="#e5b967" className="pulse-photon-2" />
              <circle cx="63" cy="41" r="1" fill="#60a5fa" className="pulse-photon" />
              <circle cx="80" cy="41" r="1" fill="#60a5fa" className="pulse-photon-2" />
            </svg>

            {/* Interactive Nodes */}
            {dakNodeGraph.map((node) => {
              const isSelected = activeNode === node.id;
              return (
                <button
                  type="button"
                  key={node.id}
                  className={`schematic-node node-${node.type} ${isSelected ? 'is-active' : ''}`}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onClick={() => setActiveNode(node.id)}
                >
                  <span className="node-glow" />
                  <span className="node-icon">
                    {node.type === 'agent' && '🤖'}
                    {node.type === 'security' && '🔒'}
                    {node.type === 'core' && '⚡'}
                    {node.type === 'queue' && '⇋'}
                    {node.type === 'delivery' && '✉'}
                  </span>
                  <span className="node-label">{node.label}</span>
                </button>
              );
            })}
          </div>

          {/* Node Inspector Footer */}
          <div className="schematic-inspector">
            {(() => {
              const current = dakNodeGraph.find((n) => n.id === activeNode) || dakNodeGraph[2];
              return (
                <div className="inspector-content">
                  <span className="inspector-tag">INSPECTING // {current.type.toUpperCase()}</span>
                  <strong className="inspector-label">{current.label}</strong>
                  <p className="inspector-role">{current.role}</p>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    );
  }

  if (id === 'products') {
    return (
      <div className="sky-atlas-grid sky-atlas-product-grid">
        {selectedProducts.map((product, index) => (
          <article
            className="sky-atlas-card sky-atlas-product"
            key={product.id}
            style={{ '--product-color': product.themeColor || '#60a5fa' } as CSSProperties}
          >
            <div className="sky-atlas-card-top">
              <span className="card-sys-id">ORBIT // {String(index + 1).padStart(2, '0')}</span>
              <span className={`card-status-pill status-${product.status}`}>
                <span className="status-dot" />
                {product.status.toUpperCase()}
              </span>
            </div>

            <div className="product-planet-visual" aria-hidden="true">
              <span className="product-planet-ring" />
              <span className="product-planet-core" />
              <span className="product-planet-satellite" />
            </div>

            <h3 className="card-title">{product.name}</h3>
            <p className="card-desc">{product.description}</p>

            <span className="sky-atlas-card-category">{product.category}</span>

            <div className="card-tech-chips">
              {product.technology?.slice(0, 3).map((tech) => (
                <span key={tech} className="chip">{tech}</span>
              ))}
            </div>

            {product.url ? (
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${product.name}`}
                className="sky-atlas-card-link"
              >
                Launch System <span className="link-arrow">↗</span>
              </a>
            ) : (
              <span className="card-private-badge">In Private Sandbox</span>
            )}
          </article>
        ))}
      </div>
    );
  }

  if (id === 'technology') {
    return (
      <div className="sky-atlas-grid sky-atlas-tech-grid">
        {techStack.map((group, index) => (
          <article className="sky-atlas-card sky-atlas-tech" key={group.title}>
            <div className="sky-atlas-card-top">
              <span className="card-sys-id">CLUSTER // 0{index + 1}</span>
              <span className="sky-atlas-tech-star" aria-hidden="true">✦</span>
            </div>

            <div className="tech-cluster-aura" aria-hidden="true" />
            <h3 className="card-title">{group.title}</h3>

            <div className="sky-atlas-tech-items">
              {group.items.map((item) => (
                <span key={item} className="tech-tag">
                  <span className="tech-dot" />
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="sky-atlas-grid sky-atlas-experience-grid">
      {experienceData.map((role) => (
        <article className="sky-atlas-card sky-atlas-role" key={role.number}>
          <div className="sky-atlas-card-top">
            <span className="card-sys-id">MISSION ARCHIVE // {role.number}</span>
            <span className="role-duration-pill">{role.duration}</span>
          </div>

          <div className="role-header-group">
            <span className="sky-atlas-card-category">{role.company} · {role.location}</span>
            <h3 className="card-title">{role.role}</h3>
          </div>

          <div className="role-stack-chips">
            {role.tags.map((tag) => (
              <span key={tag} className="chip">{tag}</span>
            ))}
          </div>

          <ul className="role-bullets">
            {role.bullets.map((bullet) => (
              <li key={bullet.text}>
                <span>{bullet.text}</span>
                {bullet.highlight && <strong className="role-highlight"> — {bullet.highlight}</strong>}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

export default function SkyAtlas() {
  const [selected, setSelected] = useState<DestinationId | null>(null);
  const [hovered, setHovered] = useState<DestinationId | null>(null);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [isWarping, setIsWarping] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);
  const portal = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  const destination = universes.find((item) => item.id === selected);
  const isOpen = selected !== null;

  // Body scroll locking and keyboard accessibility
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => closeButton.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
      // Quick universe switching with 1-4 keys
      if (event.key === '1') setSelected('building');
      if (event.key === '2') setSelected('products');
      if (event.key === '3') setSelected('technology');
      if (event.key === '4') setSelected('experience');

      // Arrow navigation
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        const currentIndex = universes.findIndex((u) => u.id === selected);
        const next = universes[(currentIndex + 1) % universes.length];
        setSelected(next.id);
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        const currentIndex = universes.findIndex((u) => u.id === selected);
        const prev = universes[(currentIndex - 1 + universes.length) % universes.length];
        setSelected(prev.id);
      }

      // Tab trap
      if (event.key === 'Tab') {
        const controls = portal.current?.querySelectorAll<HTMLElement>('button, a[href]');
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      trigger.current?.focus();
    };
  }, [isOpen, selected]);

  const openUniverse = (id: DestinationId, button: HTMLButtonElement) => {
    const bounds = button.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    setOrigin({ x, y });
    trigger.current = button;
    setIsWarping(true);
    setSelected(id);

    setTimeout(() => {
      setIsWarping(false);
    }, 700);
  };

  const clipOrigin = `${origin.x}px ${origin.y}px`;

  return (
    <>
      {/* =========================================================================
          THE IN-SKY UNIVERSE CONSTELLATION
          Pure astrophotography precision: real optical stars, diffraction spikes,
          precision hairline reticles, and architectural astronomical labels.
         ========================================================================= */}
      <div className="sky-atlas" aria-label="Explore my work through the night sky">
        {/* Subtle, delicate constellation lines connecting the stars */}
        <svg className="sky-atlas-lines-svg" aria-hidden="true" preserveAspectRatio="none">
          <defs>
            <linearGradient id="constellationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e5b967" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Desktop connecting lines — delicate hairlines */}
          <g className="desktop-constellation-lines">
            <line x1="49%" y1="31%" x2="72%" y2="24%" stroke="url(#constellationGrad)" strokeWidth="0.75" strokeDasharray="2,5" />
            <line x1="49%" y1="31%" x2="53%" y2="51%" stroke="url(#constellationGrad)" strokeWidth="0.75" strokeDasharray="2,5" />
            <line x1="72%" y1="24%" x2="76%" y2="46%" stroke="url(#constellationGrad)" strokeWidth="0.75" strokeDasharray="2,5" />
            <line x1="53%" y1="51%" x2="76%" y2="46%" stroke="url(#constellationGrad)" strokeWidth="0.75" strokeDasharray="2,5" />

            {/* Traveling photon pulses along lines */}
            <circle cx="60.5%" cy="27.5%" r="1" fill="#e5b967" className="constellation-pulse-photon photon-1" />
            <circle cx="51%" cy="41%" r="1" fill="#34d399" className="constellation-pulse-photon photon-2" />
            <circle cx="74%" cy="35%" r="1" fill="#60a5fa" className="constellation-pulse-photon photon-3" />
            <circle cx="64.5%" cy="48.5%" r="1" fill="#c084fc" className="constellation-pulse-photon photon-4" />
          </g>
        </svg>

        {/* Observatory Sky Chart Legend (Matches THE MOON & LAUNCH POINT DNA) */}
        <div className="sky-atlas-legend" aria-hidden="true">
          <i className="legend-diamond" />
          <span className="legend-title">CELESTIAL ATLAS // 4 DESTINATIONS</span>
          <b className="legend-sub">INTERACTIVE SECTORS IN THE SKY</b>
        </div>

        {/* The 4 Celestial Universe Stars */}
        <div className="sky-atlas-constellations">
          {universes.map((item) => {
            const isHovered = hovered === item.id;
            return (
              <button
                type="button"
                key={item.id}
                className={`sky-atlas-universe universe-${item.id} ${isHovered ? 'is-hovered' : ''}`}
                style={
                  {
                    '--atlas-accent': item.color,
                    '--atlas-glow': item.accentGlow,
                    '--pos-x': `${item.skyDesktop.x}%`,
                    '--pos-y': `${item.skyDesktop.y}%`,
                    '--pos-mobile-x': `${item.skyMobile.x}%`,
                    '--pos-mobile-y': `${item.skyMobile.y}%`,
                  } as CSSProperties
                }
                onClick={(event) => openUniverse(item.id, event.currentTarget)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(item.id)}
                onBlur={() => setHovered(null)}
                aria-label={`Enter ${item.name} Universe`}
              >
                {/* Visual Celestial Entity — Real Astrophotography Star */}
                <span className="celestial-star" aria-hidden="true">
                  {/* Soft atmospheric corona glow */}
                  <span className="star-corona" />

                  {/* Precision optical guide reticle (hairline astronomical viewfinder) */}
                  <span className="star-reticle">
                    <span className="reticle-ring" />
                    <span className="reticle-tick tick-n" />
                    <span className="reticle-tick tick-s" />
                    <span className="reticle-tick tick-e" />
                    <span className="reticle-tick tick-w" />
                  </span>

                  {/* Optical diffraction spikes (telescope cross rays) */}
                  <span className="diffraction-spikes">
                    <span className="diffraction-ray ray-h" />
                    <span className="diffraction-ray ray-v" />
                    <span className="diffraction-ray ray-diag-1" />
                    <span className="diffraction-ray ray-diag-2" />
                  </span>

                  {/* Brilliant white-hot star pinpoint */}
                  <span className="star-core" />

                  {/* Astrometric Annotation Label (Exact same DNA as THE MOON & LAUNCH POINT) */}
                  <span className="star-astro-label">
                    <i className="astro-diamond" />
                    <span className="astro-code">{item.number} // {item.shortName.toUpperCase()}</span>
                    <b className="astro-sub">{item.classification.split('·')[0].trim()}</b>
                  </span>
                </span>

                {/* HOLOGRAPHIC HUD TOOLTIP — Revealed on Hover / Focus */}
                <span className="universe-hud-tooltip">
                  <span className="hud-corner top-left" />
                  <span className="hud-corner top-right" />
                  <span className="hud-corner bottom-left" />
                  <span className="hud-corner bottom-right" />

                  <span className="hud-header">
                    <span className="hud-coords">{item.coordinates}</span>
                    <span className="hud-status">
                      <span className="status-blink-dot" />
                      {item.status}
                    </span>
                  </span>

                  <span className="hud-body">
                    <span className="hud-classification">{item.classification}</span>
                    <strong className="hud-title">{item.name}</strong>
                    <span className="hud-desc">{item.intro}</span>
                  </span>

                  <span className="hud-footer">
                    <span className="hud-prompt">
                      ENTER UNIVERSE <span className="hud-arrow">↗</span>
                    </span>
                    <span className="hud-number">[ {item.number} ]</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile Quick Dock (accessible at top of mobile screen) */}
        <div className="sky-atlas-mobile-dock" aria-label="Quick universe selection">
          <div className="mobile-dock-header">
            <span className="dock-icon">✧</span>
            <span>BUILDER&apos;S SKY // 4 UNIVERSES</span>
          </div>
          <div className="mobile-dock-pills">
            {universes.map((item) => (
              <button
                key={item.id}
                type="button"
                className="mobile-dock-pill"
                style={{ '--atlas-accent': item.color } as CSSProperties}
                onClick={(e) => openUniverse(item.id, e.currentTarget)}
              >
                <span className="pill-dot" />
                <span className="pill-name">{item.shortName}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          THE FULL-SCREEN UNIVERSE PORTAL (WARP APERTURE TRANSITION)
          Expands from the exact clicked star coordinates like opening a universe!
         ========================================================================= */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {destination && (
              <motion.div
                ref={portal}
                className={`sky-atlas-portal ${isWarping ? 'is-warping' : ''}`}
                key="sky-atlas-portal"
                role="dialog"
                aria-modal="true"
                aria-label={`${destination.name} Universe`}
                style={
                  {
                    '--atlas-accent': destination.color,
                    '--atlas-glow': destination.accentGlow,
                  } as CSSProperties
                }
                initial={
                  reducedMotion
                    ? { opacity: 0 }
                    : {
                        clipPath: `circle(0px at ${clipOrigin})`,
                        filter: 'brightness(2.5) contrast(1.4)',
                      }
                }
                animate={
                  reducedMotion
                    ? { opacity: 1 }
                    : {
                        clipPath: `circle(160vmax at ${clipOrigin})`,
                        filter: 'brightness(1) contrast(1)',
                      }
                }
                exit={
                  reducedMotion
                    ? { opacity: 0 }
                    : {
                        clipPath: `circle(0px at ${clipOrigin})`,
                        filter: 'brightness(1.8)',
                      }
                }
                transition={{
                  duration: reducedMotion ? 0.2 : 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Cosmic Hyperspace Star-Warp Background */}
                <div className="sky-atlas-portal-cosmos" aria-hidden="true">
                  <div className="portal-nebula-glow" />
                  <div className="portal-stars-dense" />
                  <div className="portal-grid-matrix" />
                  <div className="portal-vortex-ring" />
                </div>

                {/* Inner Content Deck */}
                <div className="sky-atlas-portal-inner">
                  {/* Top Holographic Navigation Bar */}
                  <header className="sky-atlas-portal-header">
                    <div className="portal-header-left">
                      <span className="portal-brand-symbol">✧</span>
                      <div className="portal-brand-text">
                        <span className="brand-title">AYUSH RAJ // SKY OBSERVATORY</span>
                        <span className="brand-sub">
                          UNIVERSE {destination.number} OF 04 · {destination.coordinates}
                        </span>
                      </div>
                    </div>

                    {/* Universe Switcher Tabs in Header */}
                    <nav className="portal-header-tabs" aria-label="Switch Universe">
                      {universes.map((item) => {
                        const isActive = item.id === destination.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            className={`portal-tab-pill ${isActive ? 'is-active' : ''}`}
                            style={{ '--tab-accent': item.color } as CSSProperties}
                            onClick={() => setSelected(item.id)}
                            aria-current={isActive ? 'page' : undefined}
                          >
                            <span className="tab-indicator" />
                            <span className="tab-num">{item.number}</span>
                            <span className="tab-label">{item.shortName}</span>
                          </button>
                        );
                      })}
                    </nav>

                    {/* Close / Return to Sky Button */}
                    <button
                      type="button"
                      ref={closeButton}
                      className="sky-atlas-close-btn"
                      onClick={() => setSelected(null)}
                      aria-label="Return to night sky"
                    >
                      <span className="close-btn-text">← Return to Sky</span>
                      <span className="close-btn-kbd" aria-hidden="true">ESC</span>
                    </button>
                  </header>

                  {/* Main Universe Content Area */}
                  <main className="sky-atlas-portal-main">
                    {/* Universe Hero Presentation Banner */}
                    <div className="sky-atlas-portal-heading">
                      <div className="heading-copy">
                        <div className="heading-meta-pill">
                          <span className="meta-dot" />
                          <span className="meta-text">{destination.classification}</span>
                        </div>
                        <h2 className="heading-title">{destination.name}</h2>
                        <p className="heading-tagline">{destination.intro}</p>
                      </div>

                      {/* 3D Celestial Hologram Orb */}
                      <div className="sky-atlas-heading-orb-wrapper" aria-hidden="true">
                        <div className="heading-orb-pulse-ring ring-outer" />
                        <div className="heading-orb-pulse-ring ring-mid" />
                        <div className="sky-atlas-heading-orb" />
                        <span className="orb-coordinates">{destination.coordinates}</span>
                      </div>
                    </div>

                    {/* Animated Tab Content Container */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={destination.id}
                        initial={{ opacity: 0, y: 22, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -16, scale: 0.98 }}
                        transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <DestinationContent id={destination.id} />
                      </motion.div>
                    </AnimatePresence>
                  </main>

                  {/* Universe Footer Command Deck */}
                  <footer className="sky-atlas-portal-footer">
                    <div className="footer-universe-nav">
                      <span className="footer-nav-label">QUICK JUMP:</span>
                      <div className="footer-pills">
                        {universes.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className={`footer-jump-btn ${item.id === destination.id ? 'is-active' : ''}`}
                            onClick={() => setSelected(item.id)}
                          >
                            <span className="jump-bullet" style={{ color: item.color }}>✦</span>
                            <span>{item.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="footer-actions">
                      <a
                        href={`#${destination.section}`}
                        className="footer-section-scroll-link"
                        onClick={() => setSelected(null)}
                      >
                        <span>Explore full {destination.name} section on page</span>
                        <span aria-hidden="true">↓</span>
                      </a>
                    </div>
                  </footer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
