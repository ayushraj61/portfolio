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
// Interactive DakNode architecture node
interface ArchNode {
  id: string;
  label: string;
  category: string;
  role: string;
  protocol: string;
  latency: string;
  x: number;
  y: number;
  type: 'agent' | 'core' | 'queue' | 'delivery' | 'security';
}

const dakNodeGraph: ArchNode[] = [
  {
    id: 'agent',
    label: 'Autonomous AI Agents',
    category: 'INGRESS / CLIENTS',
    role: 'Autonomous inbound and outbound agent workloads issuing secure protocol requests.',
    protocol: 'gRPC / HTTPS',
    latency: '3.2 ms',
    x: 22,
    y: 30,
    type: 'agent',
  },
  {
    id: 'auth',
    label: 'Zero-Trust Gate',
    category: 'SECURITY SANDBOX',
    role: 'Cryptographic token validation, permission isolation, and ephemeral agent credentials.',
    protocol: 'mTLS · Ed25519',
    latency: '1.8 ms',
    x: 22,
    y: 72,
    type: 'security',
  },
  {
    id: 'core',
    label: 'DakNode Engine',
    category: 'CENTRAL BROKER',
    role: 'Core distributed event orchestrator, routing engine, and persistent state management kernel.',
    protocol: 'Internal Bus',
    latency: '0.9 ms',
    x: 50,
    y: 51,
    type: 'core',
  },
  {
    id: 'queue',
    label: 'Redis Event Queue',
    category: 'ASYNC STREAM BUS',
    role: 'In-memory asynchronous message queue executing reliable sub-15ms guaranteed delivery.',
    protocol: 'Redis Streams',
    latency: '4.1 ms',
    x: 78,
    y: 26,
    type: 'queue',
  },
  {
    id: 'inbox',
    label: 'Agent Inboxes',
    category: 'PERSISTENT IDENTITIES',
    role: 'Dedicated SPF, DKIM, DMARC programmatic mailbox identities for autonomous AI agents.',
    protocol: 'OAuth2 · SMTP',
    latency: '11.5 ms',
    x: 78,
    y: 51,
    type: 'delivery',
  },
  {
    id: 'webhook',
    label: 'Realtime Webhooks',
    category: 'PUSH DISPATCH',
    role: 'High-throughput outbound webhook dispatch delivering events instantly to external systems.',
    protocol: 'HTTP/2 Push',
    latency: '8.4 ms',
    x: 78,
    y: 76,
    type: 'delivery',
  },
];

function NodeSvgIcon({ type }: { type: ArchNode['type'] }) {
  switch (type) {
    case 'agent':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="3" />
          <circle cx="8.5" cy="10" r="1.5" />
          <circle cx="15.5" cy="10" r="1.5" />
          <path d="M9 15h6" />
          <path d="M12 2v2" />
        </svg>
      );
    case 'security':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <circle cx="12" cy="11" r="1.5" />
          <path d="M12 12.5v2.5" />
        </svg>
      );
    case 'core':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'queue':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" />
          <polyline points="16 3 20 6 16 9" />
          <polyline points="8 15 4 18 8 21" />
        </svg>
      );
    case 'delivery':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
  }
}

function DestinationContent({ id }: { id: DestinationId }) {
  const [activeNode, setActiveNode] = useState<string | null>('core');
  const [dakView, setDakView] = useState<'cli' | 'website' | 'topology'>('cli');
  const [cliCopied, setCliCopied] = useState(false);

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

        {/* Interactive Architecture & Showcase Card */}
        <div className="sky-atlas-schematic-card daknode-hybrid-card">
          <div className="schematic-header">
            <div className="schematic-title-group">
              <span className="schematic-radar-dot" />
              <span className="schematic-title">DAKNODE PLATFORM & TOPOLOGY</span>
            </div>

            {/* 3-Way Mode Switcher Tabs */}
            <div className="daknode-view-tabs" role="tablist" aria-label="DakNode Showcase Views">
              <button
                type="button"
                className={`dak-tab-btn ${dakView === 'cli' ? 'is-active' : ''}`}
                onClick={() => setDakView('cli')}
                role="tab"
                aria-selected={dakView === 'cli'}
              >
                <span className="tab-glyph">⚡</span> CLI & Inboxes
              </button>
              <button
                type="button"
                className={`dak-tab-btn ${dakView === 'website' ? 'is-active' : ''}`}
                onClick={() => setDakView('website')}
                role="tab"
                aria-selected={dakView === 'website'}
              >
                <span className="tab-glyph">🌐</span> Live Site
              </button>
              <button
                type="button"
                className={`dak-tab-btn ${dakView === 'topology' ? 'is-active' : ''}`}
                onClick={() => setDakView('topology')}
                role="tab"
                aria-selected={dakView === 'topology'}
              >
                <span className="tab-glyph">⇋</span> Topology
              </button>
            </div>
          </div>

          {/* VIEW 1: CLI & Inboxes (Interactive Terminal Simulator from daknode.com) */}
          {dakView === 'cli' && (
            <div className="daknode-terminal-deck">
              <div className="terminal-subnav">
                <div className="terminal-window-dots" aria-hidden="true">
                  <span className="window-dot dot-red" />
                  <span className="window-dot dot-yellow" />
                  <span className="window-dot dot-green" />
                </div>
                <div className="terminal-subtabs">
                  <span className="subtab-item is-active">⚡ INSTALL SKILL</span>
                  <span className="subtab-item">AGENT SELF-SIGNUP</span>
                  <span className="subtab-item">HERMES</span>
                </div>
              </div>

              <div className="terminal-body-box">
                <div className="terminal-file-header">
                  <span className="terminal-path">~/your-project</span>
                  <button
                    type="button"
                    className="terminal-copy-btn"
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText('npx skills add https://daknode.com/skill');
                      }
                      setCliCopied(true);
                      setTimeout(() => setCliCopied(false), 2000);
                    }}
                  >
                    {cliCopied ? '✓ COPIED' : '📋 COPY'}
                  </button>
                </div>

                <p className="terminal-explainer">
                  Using an AI coding assistant? Install the DakNode skill to give it instant knowledge of the API — inbox provisioning, inbound events, and reading threads. Works with Claude Code and Cursor.
                </p>

                <div className="terminal-cli-code">
                  <span className="prompt-sym">$</span>
                  <span className="prompt-cmd">npx skills add https://daknode.com/skill</span>
                </div>

                <div className="terminal-cli-output">
                  <span className="check-mark">✓ [ok]</span> skill installed · Claude Code · Cursor
                </div>

                {/* Live Inbox Demo Container */}
                <div className="terminal-live-inbox-box">
                  <div className="live-inbox-header">
                    <span className="live-tag">LIVE INBOX</span>
                    <code className="live-address">eagertrail371@demo.inbound.daknode.com</code>
                    <span className="live-expiry">Expires in 14:54</span>
                  </div>
                  <div className="live-inbox-waiting">
                    <span className="live-ping-dot" />
                    <span>Waiting for your first email · Send a message to the address above from any mail client.</span>
                  </div>
                </div>
              </div>

              <div className="terminal-footer-bar">
                <div className="terminal-badges">
                  <span>● Persistent agent identity</span>
                  <span>● Real-time inbound events</span>
                  <span>● API-first infrastructure</span>
                </div>
                <a
                  href="https://daknode.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="terminal-cta-btn"
                >
                  GET AN API KEY ↗
                </a>
              </div>
            </div>
          )}

          {/* VIEW 2: Website Screenshot Mockup (Real Browser Frame of daknode.com) */}
          {dakView === 'website' && (
            <div className="daknode-browser-mockup">
              <div className="browser-chrome-bar">
                <div className="terminal-window-dots" aria-hidden="true">
                  <span className="window-dot dot-red" />
                  <span className="window-dot dot-yellow" />
                  <span className="window-dot dot-green" />
                </div>
                <div className="browser-url-bar">
                  <span className="url-lock">🔒</span>
                  <span className="url-text">https://daknode.com</span>
                </div>
                <a
                  href="https://daknode.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="browser-visit-link"
                >
                  Open Website ↗
                </a>
              </div>

              <div className="browser-viewport">
                <img
                  src="/daknode-preview.png"
                  alt="DakNode Platform - Give every AI agent a real inbox"
                  className="browser-screenshot-img"
                  loading="eager"
                />
                <div className="browser-hover-overlay">
                  <div className="overlay-badge">
                    <span className="overlay-kicker">DAKNODE.COM PRODUCTION DECK</span>
                    <h4 className="overlay-title">Give every AI agent a real inbox</h4>
                    <p className="overlay-desc">Persistent email identities, OAuth, SPF/DKIM verification, and real-time webhook routing.</p>
                  </div>
                  <a
                    href="https://daknode.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="overlay-action-btn"
                  >
                    Visit Live Platform ↗
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: Topology Schematic (The 3-Tier Clean Architectural Diagram) */}
          {dakView === 'topology' && (
            <>
              <div className="schematic-canvas">
                <svg className="schematic-svg-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="traceGradInbound" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#e5b967" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="traceGradOutbound" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#e5b967" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>

                  <path d="M 22 30 C 36 30, 36 51, 50 51" stroke="url(#traceGradInbound)" strokeWidth="0.85" fill="none" strokeDasharray="3,3" />
                  <path d="M 22 72 C 36 72, 36 51, 50 51" stroke="url(#traceGradInbound)" strokeWidth="0.85" fill="none" />
                  <path d="M 50 51 C 64 51, 64 26, 78 26" stroke="url(#traceGradOutbound)" strokeWidth="0.85" fill="none" />
                  <line x1="50" y1="51" x2="78" y2="51" stroke="url(#traceGradOutbound)" strokeWidth="0.85" />
                  <path d="M 50 51 C 64 51, 64 76, 78 76" stroke="url(#traceGradOutbound)" strokeWidth="0.85" fill="none" />

                  <circle cx="36" cy="40" r="1.2" fill="#e5b967" className="pulse-photon" />
                  <circle cx="36" cy="61" r="1.2" fill="#60a5fa" className="pulse-photon-2" />
                  <circle cx="64" cy="38" r="1.2" fill="#60a5fa" className="pulse-photon" />
                  <circle cx="64" cy="51" r="1.2" fill="#e5b967" className="pulse-photon-2" />
                  <circle cx="64" cy="64" r="1.2" fill="#34d399" className="pulse-photon" />
                </svg>

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
                      aria-pressed={isSelected}
                    >
                      <span className="node-glow" />
                      <span className="node-icon-box">
                        <NodeSvgIcon type={node.type} />
                      </span>
                      <span className="node-text-col">
                        <span className="node-category">{node.category}</span>
                        <span className="node-label">{node.label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="schematic-inspector">
                {(() => {
                  const current = dakNodeGraph.find((n) => n.id === activeNode) || dakNodeGraph[2];
                  return (
                    <div className="inspector-panel-grid">
                      <div className="inspector-panel-left">
                        <div className="inspector-badge-row">
                          <span className="inspector-tag">INSPECTING // {current.category}</span>
                          <span className="inspector-latency">LATENCY: {current.latency}</span>
                        </div>
                        <strong className="inspector-label">{current.label}</strong>
                        <p className="inspector-role">{current.role}</p>
                      </div>
                      <div className="inspector-panel-right">
                        <div className="inspector-stat-pill">
                          <span className="stat-pill-label">PROTOCOL</span>
                          <span className="stat-pill-value">{current.protocol}</span>
                        </div>
                        <div className="inspector-stat-pill">
                          <span className="stat-pill-label">TELEMETRY</span>
                          <span className="stat-pill-value stat-live">
                            <span className="stat-pulse-dot" />
                            ACTIVE
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          )}
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
      {/* =========================================================================
          THE IN-SKY UNIVERSE SHOWCASE
          Deep-sky celestial wonders integrated seamlessly into the photographic sky.
          Zero connecting lines. Zero resting text.
         ========================================================================= */}
      <div className="sky-atlas" aria-label="Explore my work through the night sky">
        {/* The 4 Celestial Deep-Sky Universes — Zero resting text, pure cosmic wonders */}
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
                {/* Visual Celestial Universe in the Sky (Luminous Deep-Sky Cosmic Wonder) */}
                <span className="universe-celestial-body" aria-hidden="true">
                  {/* Outer Cosmic Nebula Gas Cloud (mix-blend-mode: screen, seamlessly merges into the sky photo) */}
                  <span className="cosmic-nebula-haze" />

                  {/* Interstellar Accretion Dust / Spiral Disc */}
                  <span className="cosmic-accretion-ring" />

                  {/* Embedded Star Cluster Points */}
                  <span className="cluster-star star-1" />
                  <span className="cluster-star star-2" />
                  <span className="cluster-star star-3" />

                  {/* Stellar Core / Galactic Nucleus */}
                  <span className="galactic-nucleus">
                    <span className="nucleus-glow" />
                    <span className="nucleus-point" />
                  </span>

                  {/* Subtle Starlight Flare */}
                  <span className="stellar-flare" />
                </span>

                {/* HOLOGRAPHIC HUD TOOLTIP — Revealed STRICTLY on Hover / Focus */}
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
                        opacity: 0.7,
                        scale: 0.96,
                      }
                }
                animate={
                  reducedMotion
                    ? { opacity: 1 }
                    : {
                        clipPath: `circle(150vmax at ${clipOrigin})`,
                        opacity: 1,
                        scale: 1,
                      }
                }
                exit={
                  reducedMotion
                    ? { opacity: 0 }
                    : {
                        clipPath: `circle(0px at ${clipOrigin})`,
                        opacity: 0,
                        scale: 0.96,
                      }
                }
                transition={{
                  duration: reducedMotion ? 0.2 : 0.52,
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
                  {/* Top Bar with Return to Sky Button */}
                  <header className="sky-atlas-portal-header">
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
