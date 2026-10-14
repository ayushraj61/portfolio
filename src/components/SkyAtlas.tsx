'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
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
  // Astronomical Showcase Data
  celestialImage: string;
  celestialName: string;
  celestialDesignation: string;
  celestialType: string;
  telescopeSource: string;
  spectralClass: string;
}

const universes: UniverseConfig[] = [
  {
    id: 'building',
    number: '01',
    name: 'DakNode',
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
    celestialImage: '/cosmos/supernova-core.jpg',
    celestialName: 'NGC 3132 · Southern Ring Pulsar Core',
    celestialDesignation: 'ACTIVE PULSAR · PROTOCOL STATION 01',
    celestialType: 'Stellar Remnant & Ionized Core',
    telescopeSource: 'Observatory Optical Survey · Spectral Core',
    spectralClass: 'Class O · High-Energy Ionization',
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
    celestialImage: '/cosmos/planet-exoplanet.jpg',
    celestialName: 'Kepler-186f Analog · Terra Exoplanet',
    celestialDesignation: 'ORBITAL FLEET GRAVITY WELL · STATION 02',
    celestialType: 'Habitable Core & Terrestrial Exoplanet',
    telescopeSource: 'Deep Astronomical Reconnaissance',
    spectralClass: 'Class M Planetary System',
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
    celestialImage: '/cosmos/deep-nebula-jwst.jpg',
    celestialName: 'NGC 2174 · Molecular Stellar Nursery',
    celestialDesignation: 'NEURAL CLUSTER FILAMENTS · STATION 03',
    celestialType: 'Ionized Hydrogen Star-Forming Engine',
    telescopeSource: 'James Webb Space Telescope (JWST) NIRCam',
    spectralClass: 'H II Region · Molecular Cloud',
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
    celestialImage: '/cosmos/nebula-butterfly.jpg',
    celestialName: 'NGC 6302 · Butterfly Nebula Bipolar Core',
    celestialDesignation: 'CHRONO BEACON · FLIGHT PATH · STATION 04',
    celestialType: 'Bipolar Planetary Nebula & Supersonic Wings',
    telescopeSource: 'Hubble Space Telescope (WFC3/UVIS)',
    spectralClass: 'Supersonic Gas Envelope (>950,000 km/h)',
  },
];

interface ShowcaseProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  domain: string;
  image: string;
  accent: string;
  metrics: { label: string; value: string }[];
  tech: string[];
}

const showcaseProducts: ShowcaseProduct[] = [
  {
    id: 'daknode',
    name: 'DakNode',
    tagline: 'Email infrastructure for autonomous agents.',
    description:
      'Developer infrastructure providing autonomous AI agents with persistent email identities, programmatic mailboxes, sub-15ms guaranteed FIFO event streams, and zero-trust sandboxed communication boundaries.',
    url: 'https://daknode.com',
    domain: 'daknode.com',
    image: '/products/daknode.png',
    accent: '#d4a853',
    metrics: [
      { label: 'THROUGHPUT', value: '128k events/s Core' },
      { label: 'SECURITY', value: 'mTLS Zero-Trust Gate' },
      { label: 'EVENT BUS', value: 'Redis Streams (FIFO)' },
    ],
    tech: ['Next.js', 'PostgreSQL', 'Redis', 'gRPC', 'Docker'],
  },
  {
    id: 'outlay',
    name: 'Outlay',
    tagline: 'Forward the bill. That is the whole job.',
    description:
      'High-accuracy corporate financial automation engine. Automatically reads invoices, splits itemized GST taxes, reconciles debit card transactions, and files expenses to the company ledger in under 800ms.',
    url: 'https://outlay.site',
    domain: 'outlay.site',
    image: '/products/outlay.png',
    accent: '#10b981',
    metrics: [
      { label: 'OCR ACCURACY', value: '99.4% Verified' },
      { label: 'EXTRACTION SLA', value: '< 850ms P99' },
      { label: 'BANK RECON', value: '2s Auto-Matched' },
    ],
    tech: ['Next.js', 'OCR API', 'PostgreSQL', 'Tailwind CSS'],
  },
  {
    id: 'hyperflow',
    name: 'HyperFlow Automation',
    tagline: 'Automate the work that slows you down. Scale what matters.',
    description:
      'Unified enterprise automation platform connecting fragmented operational software (Salesforce, SAP, custom internal APIs) with autonomous AI agent loops, multi-step LLM workflows, and dynamic tool orchestration.',
    url: 'https://hyperflowautomation.in',
    domain: 'hyperflowautomation.in',
    image: '/products/hyperflow.png',
    accent: '#6366f1',
    metrics: [
      { label: 'CORE ENGINE', value: 'LangChain & FastAPI' },
      { label: 'LATENCY SLA', value: '< 1.2s Agent Loop' },
      { label: 'AUTOMATION', value: 'Autonomous Agents' },
    ],
    tech: ['Python', 'LangChain', 'FastAPI', 'React', 'Docker'],
  },
  {
    id: 'splitme',
    name: 'SplitMe',
    tagline: 'Stop acting like a debt collector.',
    description:
      'Zero-friction group expense tracking and settlement product. Employs a graph reduction solver to compute the mathematically minimum transactions needed to settle group debts, with instant one-tap UPI links.',
    url: 'https://splitme.site',
    domain: 'splitme.site',
    image: '/products/splitme.png',
    accent: '#f43f5e',
    metrics: [
      { label: 'SOLVER ENGINE', value: 'Graph Reduction' },
      { label: 'TRANSACTIONS', value: 'Min Transfers (3 of 12)' },
      { label: 'PLATFORM FEE', value: '0% Free & Direct' },
    ],
    tech: ['React', 'Node.js', 'MongoDB', 'UPI Deeplinks'],
  },
  {
    id: 'outfund',
    name: 'OutFund',
    tagline: 'Collect funds. Zero friction.',
    description:
      'Lightweight fundraising platform engineered for instant campaign creation, automated UPI payment reconciliation, verified donor receipts, and 0% platform commission.',
    url: 'https://outfund.site',
    domain: 'outfund.site',
    image: '/products/outfund.png',
    accent: '#a855f7',
    metrics: [
      { label: 'PLATFORM FEE', value: '0% Commission' },
      { label: 'VERIFICATION', value: 'Automated UPI Bus' },
      { label: 'RECEIPTS', value: 'Auto-Generated PDF' },
    ],
    tech: ['Next.js', 'UPI Engine', 'Stripe', 'PostgreSQL'],
  },
];

// Interactive DakNode architecture node
// Interactive DakNode architecture node
interface ArchNode {
  id: string;
  label: string;
  category: string;
  role: string;
  protocol: string;
  latency: string;
  throughput: string;
  statusBadge: string;
  x: number;
  y: number;
  type: 'agent' | 'security' | 'core' | 'queue' | 'inbox' | 'webhook';
  accentColor: string;
}

const dakNodeGraph: ArchNode[] = [
  {
    id: 'agent',
    label: 'Autonomous AI Agents',
    category: 'INGRESS / CLIENTS',
    role: 'Autonomous AI assistants (Claude Code, Cursor) and background agent daemons issuing authenticated API requests.',
    protocol: 'gRPC / HTTPS',
    latency: '3.2 ms',
    throughput: '42.5k req/s',
    statusBadge: 'CONNECTED',
    x: 18,
    y: 30,
    type: 'agent',
    accentColor: '#38bdf8',
  },
  {
    id: 'auth',
    label: 'Zero-Trust Gate',
    category: 'SECURITY SANDBOX',
    role: 'Cryptographic token validation, permission isolation, and ephemeral agent credentials with mTLS encryption.',
    protocol: 'mTLS · Ed25519',
    latency: '1.4 ms',
    throughput: '99.99% PASS',
    statusBadge: 'VERIFIED',
    x: 18,
    y: 72,
    type: 'security',
    accentColor: '#f59e0b',
  },
  {
    id: 'core',
    label: 'DakNode Engine',
    category: 'CENTRAL BROKER',
    role: 'High-performance distributed event orchestrator, routing engine, mailbox state manager, and Raft consensus broker.',
    protocol: 'Internal Bus · Raft',
    latency: '0.8 ms',
    throughput: '128k events/s',
    statusBadge: 'HEALTHY',
    x: 50,
    y: 51,
    type: 'core',
    accentColor: '#e5b967',
  },
  {
    id: 'queue',
    label: 'Redis Event Queue',
    category: 'ASYNC STREAM BUS',
    role: 'In-memory asynchronous message queue executing reliable sub-15ms guaranteed FIFO message delivery.',
    protocol: 'Redis Streams',
    latency: '2.1 ms',
    throughput: '85.2k msg/s',
    statusBadge: 'BUFFERED',
    x: 82,
    y: 25,
    type: 'queue',
    accentColor: '#f43f5e',
  },
  {
    id: 'inbox',
    label: 'Agent Inboxes',
    category: 'PERSISTENT IDENTITIES',
    role: 'Dedicated SPF, DKIM, DMARC programmatic mailbox identities for autonomous AI agents with thread history.',
    protocol: 'OAuth2 · SMTP',
    latency: '9.5 ms',
    throughput: 'Zero-Leak Mail',
    statusBadge: 'PROVISIONED',
    x: 82,
    y: 51,
    type: 'inbox',
    accentColor: '#10b981',
  },
  {
    id: 'webhook',
    label: 'Realtime Webhooks',
    category: 'PUSH DISPATCH',
    role: 'High-throughput outbound webhook dispatch delivering events instantly to agent webhooks in under 15ms.',
    protocol: 'HTTP/2 Push',
    latency: '4.8 ms',
    throughput: '< 15ms Push',
    statusBadge: 'STREAMING',
    x: 82,
    y: 77,
    type: 'webhook',
    accentColor: '#a855f7',
  },
];

function NodeSvgIcon({ type }: { type: ArchNode['type'] }) {
  switch (type) {
    case 'agent':
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="16" x2="8" y2="16" strokeWidth="3" />
          <line x1="16" y1="16" x2="16" y2="16" strokeWidth="3" />
        </svg>
      );
    case 'security':
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case 'core':
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
        </svg>
      );
    case 'queue':
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case 'inbox':
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
          <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
      );
    case 'webhook':
      return (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
          <circle cx="18" cy="17" r="3" />
          <circle cx="18" cy="7" r="3" />
          <path d="M18 9.98v4" />
          <circle cx="6" cy="17" r="3" />
        </svg>
      );
  }
}

function DestinationContent({ id }: { id: DestinationId }) {
  const [activeNode, setActiveNode] = useState<string | null>('core');
  const [dakView, setDakView] = useState<'cli' | 'website' | 'topology'>('website');
  const [cliCopied, setCliCopied] = useState(false);

  if (id === 'building') {
    const daknode = products.find((product) => product.id === 'daknode')!;
    return (
      <div className="sky-atlas-feature sky-atlas-feature-building">
        <div className="sky-atlas-feature-copy">
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
                <a
                  href="https://daknode.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="browser-viewport-link"
                  title="Open daknode.com in new tab"
                >
                  <img
                    src="/daknode-preview.png"
                    alt="DakNode Platform - Give every AI agent a real inbox"
                    className="browser-screenshot-img"
                    loading="eager"
                  />
                </a>
              </div>
            </div>
          )}

          {/* VIEW 3: Topology Schematic (The 3-Tier Clean Architectural Diagram) */}
          {/* VIEW 3: Topology Schematic (Standard Cloud Architecture Flow) */}
          {dakView === 'topology' && (() => {
            const current = dakNodeGraph.find((n) => n.id === activeNode) || dakNodeGraph[2];
            const connections = [
              { id: 'agent-core', from: 'agent', to: 'core', d: 'M 270 114 C 345 114, 335 194, 410 194', color: '#38bdf8' },
              { id: 'auth-core', from: 'auth', to: 'core', d: 'M 270 274 C 345 274, 335 194, 410 194', color: '#f59e0b' },
              { id: 'core-queue', from: 'core', to: 'queue', d: 'M 590 194 C 655 194, 665 95, 730 95', color: '#f43f5e' },
              { id: 'core-inbox', from: 'core', to: 'inbox', d: 'M 590 194 L 730 194', color: '#10b981' },
              { id: 'core-webhook', from: 'core', to: 'webhook', d: 'M 590 194 C 655 194, 665 293, 730 293', color: '#a855f7' },
            ];

            return (
              <div className="topology-schematic-deck">
                {/* Pipeline Stage Bar */}
                <div className="topology-stage-bar">
                  <div className="stage-step">
                    <span className="stage-step-tag">01 · INGRESS</span>
                    <span className="stage-step-title">Clients & Security</span>
                  </div>
                  <div className="stage-flow-indicator" aria-hidden="true">➔</div>
                  <div className="stage-step stage-step-core">
                    <span className="stage-step-tag">02 · BROKER</span>
                    <span className="stage-step-title">DakNode Engine</span>
                  </div>
                  <div className="stage-flow-indicator" aria-hidden="true">➔</div>
                  <div className="stage-step">
                    <span className="stage-step-tag">03 · EGRESS</span>
                    <span className="stage-step-title">Dispatch & Storage</span>
                  </div>
                </div>

                {/* Interactive Node Graph Canvas */}
                <div className="schematic-canvas">
                  <svg className="topology-svg-canvas" viewBox="0 0 1000 380" preserveAspectRatio="none" aria-hidden="true">
                    {/* Base Inactive Circuit Wires */}
                    {connections.map((conn) => (
                      <path
                        key={`base-${conn.id}`}
                        d={conn.d}
                        className="topology-track"
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}

                    {/* Active Animated Data Stream Packets */}
                    {connections.map((conn) => {
                      const isConnActive = activeNode === 'core' || activeNode === conn.from || activeNode === conn.to;
                      return (
                        <path
                          key={`stream-${conn.id}`}
                          d={conn.d}
                          className={`topology-stream ${isConnActive ? 'is-active' : ''}`}
                          style={{ stroke: conn.color }}
                          vectorEffect="non-scaling-stroke"
                        />
                      );
                    })}

                    {/* Clean Connection Pin Terminals */}
                    <circle cx="270" cy="114" r="3" fill="#38bdf8" />
                    <circle cx="270" cy="274" r="3" fill="#f59e0b" />
                    <circle cx="410" cy="194" r="3.5" fill="#e5b967" />
                    <circle cx="590" cy="194" r="3.5" fill="#e5b967" />
                    <circle cx="730" cy="95" r="3" fill="#f43f5e" />
                    <circle cx="730" cy="194" r="3" fill="#10b981" />
                    <circle cx="730" cy="293" r="3" fill="#a855f7" />
                  </svg>

                  {/* Architecture Node Cards */}
                  {dakNodeGraph.map((node) => {
                    const isSelected = activeNode === node.id;
                    return (
                      <button
                        type="button"
                        key={node.id}
                        className={`topology-node node-${node.type} ${isSelected ? 'is-active' : ''}`}
                        style={{
                          left: `${node.x}%`,
                          top: `${node.y}%`,
                          '--node-accent': node.accentColor,
                        } as CSSProperties}
                        onMouseEnter={() => setActiveNode(node.id)}
                        onClick={() => setActiveNode(node.id)}
                        aria-pressed={isSelected}
                      >
                        {/* Input Port Pin on Left */}
                        {(node.id === 'core' || node.id === 'queue' || node.id === 'inbox' || node.id === 'webhook') && (
                          <span className="topology-port port-left" aria-hidden="true" />
                        )}

                        <div className="node-top-meta">
                          <span className="node-cat-tag">{node.category}</span>
                          <span className="node-latency-chip">
                            <span className="chip-led-dot" />
                            {node.latency}
                          </span>
                        </div>

                        <div className="node-main-row">
                          <div className="node-icon-wrapper" aria-hidden="true">
                            <NodeSvgIcon type={node.type} />
                          </div>
                          <div className="node-title-group">
                            <span className="node-main-label">{node.label}</span>
                            <span className="node-subprotocol">{node.protocol}</span>
                          </div>
                        </div>

                        {/* Output Port Pin on Right */}
                        {(node.id === 'agent' || node.id === 'auth' || node.id === 'core') && (
                          <span className="topology-port port-right" aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Professional Telemetry Console Inspector */}
                <div className="schematic-inspector">
                  <div className="inspector-console-bar">
                    <div className="console-status-group">
                      <span className="console-pulse-indicator" />
                      <span className="console-system-title">DAKNODE ARCHITECTURE TOPOLOGY // COMPONENT INSPECTOR</span>
                    </div>
                    <div className="console-sla-badge">
                      <span className="sla-glyph">⚡</span>
                      <span>SUB-15MS P99 LATENCY SLA</span>
                    </div>
                  </div>

                  <div className="inspector-panel-grid">
                    <div className="inspector-panel-left">
                      <div className="inspector-identity-row">
                        <div className={`inspector-avatar avatar-${current.type}`} style={{ color: current.accentColor }}>
                          <NodeSvgIcon type={current.type} />
                        </div>
                        <div className="inspector-heading-col">
                          <div className="inspector-category-kicker">{current.category}</div>
                          <h4 className="inspector-node-title">{current.label}</h4>
                        </div>
                      </div>
                      <p className="inspector-role-desc">{current.role}</p>
                    </div>

                    <div className="inspector-panel-right">
                      <div className="inspector-stat-pill">
                        <span className="stat-pill-label">PROTOCOL</span>
                        <span className="stat-pill-value">{current.protocol}</span>
                      </div>
                      <div className="inspector-stat-pill">
                        <span className="stat-pill-label">LATENCY</span>
                        <span className="stat-pill-value stat-latency">{current.latency}</span>
                      </div>
                      <div className="inspector-stat-pill">
                        <span className="stat-pill-label">THROUGHPUT</span>
                        <span className="stat-pill-value">{current.throughput}</span>
                      </div>
                      <div className="inspector-stat-pill">
                        <span className="stat-pill-label">TELEMETRY</span>
                        <span className="stat-pill-value stat-live">
                          <span className="stat-pulse-dot" />
                          {current.statusBadge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="inspector-quick-switcher" role="tablist" aria-label="Quick Select Topology Nodes">
                    <span className="switcher-label">INSPECT:</span>
                    {dakNodeGraph.map((node) => (
                      <button
                        type="button"
                        key={node.id}
                        className={`quick-node-btn ${node.id === activeNode ? 'is-active' : ''}`}
                        onClick={() => setActiveNode(node.id)}
                        style={{ '--btn-accent': node.accentColor } as CSSProperties}
                      >
                        <span className="quick-dot" />
                        <span>{node.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }

  if (id === 'products') {
    return (
      <div className="split-showcase-list sky-atlas-split-showcase">
        {showcaseProducts.map((product) => (
          <article
            key={product.id}
            className="split-showcase-row"
            style={{ '--card-accent': product.accent } as CSSProperties}
          >
            {/* Left Column: Heading, Tagline, Description, Metrics, Tech */}
            <div className="split-info-col">
              <h3 className="split-title">
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="split-title-link"
                  title={`Visit ${product.name}`}
                >
                  {product.name} <span className="title-arrow">↗</span>
                </a>
              </h3>

              <div className="split-quote-tagline">&ldquo;{product.tagline}&rdquo;</div>

              <p className="split-description">{product.description}</p>

              <div className="split-metrics-grid">
                {product.metrics.map((metric) => (
                  <div key={metric.label} className="split-metric-card">
                    <div className="split-metric-lbl">{metric.label}</div>
                    <div className="split-metric-val">{metric.value}</div>
                  </div>
                ))}
              </div>

              <div className="split-tech-row">
                {product.tech.map((t) => (
                  <span key={t} className="tech-chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Uncropped Browser Screenshot Frame */}
            <div className="split-screen-col">
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="split-browser-link"
                title={`Tap to open ${product.domain}`}
              >
                <div className="split-browser-frame">
                  <div className="split-frame-header">
                    <div className="frame-dots">
                      <span className="frame-dot red" />
                      <span className="frame-dot yellow" />
                      <span className="frame-dot green" />
                    </div>
                    <div className="split-frame-url">
                      <span>🔒</span> {product.domain}
                    </div>
                    <span className="split-frame-badge">VISIT SITE ↗</span>
                  </div>

                  <div className="split-screen-canvas">
                    <img
                      src={product.image}
                      alt={`${product.name} Interface`}
                      className="split-screen-img"
                      loading="lazy"
                    />
                    <div className="split-screen-overlay">
                      <span className="split-tap-pill">Open {product.domain} ↗</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
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

// Transition type assignment:
// Style 1 (Cyber Hologram Intercept): DakNode (protocol pulsar) & Tech Stack (technology)
// Style 2 (Retro CRT Broken TV): Product Universe (orbital fleet) & Experience (journey timeline)
const getTransitionType = (id: DestinationId): 'cyber' | 'crt' => {
  return id === 'building' || id === 'technology' ? 'cyber' : 'crt';
};

// Web Audio API Synthesizer (Zero network requests, zero latency)
function playTransitionSound(type: 'cyber' | 'crt') {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;

    if (type === 'crt') {
      const duration = 0.30;
      const bufferSize = ctx.sampleRate * duration;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(2.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start(now);
    } else {
      const duration = 0.22;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(120, now + duration);

      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    }
  } catch {
    // Autoplay policy or unsupported environments handled gracefully
  }
}

export default function SkyAtlas() {
  const [selected, setSelected] = useState<DestinationId | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [hovered, setHovered] = useState<DestinationId | null>(null);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const trigger = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);
  const portal = useRef<HTMLDivElement | null>(null);
  const noiseCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const destination = universes.find((item) => item.id === selected);
  const isOpen = selected !== null;
  const transitionType = destination ? getTransitionType(destination.id) : 'cyber';

  const closeUniverse = useCallback(() => {
    if (!destination || isClosing) return;
    const type = getTransitionType(destination.id);
    playTransitionSound(type);
    setIsClosing(true);

    const closeDuration = type === 'cyber' ? 210 : 330;
    setTimeout(() => {
      setSelected(null);
      setIsClosing(false);
    }, closeDuration);
  }, [destination, isClosing]);

  // Body scroll locking and keyboard accessibility
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => closeButton.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeUniverse();
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
  }, [isOpen, selected, closeUniverse]);

  // Real-time CRT Static Noise Canvas Loop (Only for Style 2: products & experience)
  useEffect(() => {
    if (!destination || (destination.id !== 'products' && destination.id !== 'experience')) return;
    const canvas = noiseCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = Math.floor(window.innerWidth / 4);
    canvas.height = Math.floor(window.innerHeight / 4);

    let animationId: number;
    let frames = 0;
    const render = () => {
      if (frames < 20) {
        const w = canvas.width;
        const h = canvas.height;
        const imgData = ctx.createImageData(w, h);
        const buffer = new Uint32Array(imgData.data.buffer);
        const len = buffer.length;
        for (let i = 0; i < len; i++) {
          buffer[i] = Math.random() < 0.28 ? 0xffffffff : 0x00000000;
        }
        ctx.putImageData(imgData, 0, 0);
        frames++;
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [destination, isClosing]);

  const openUniverse = (id: DestinationId, button: HTMLButtonElement) => {
    const type = getTransitionType(id);
    playTransitionSound(type);
    setIsClosing(false);
    setSelected(id);
    trigger.current = button;
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

      </div>

      {/* =========================================================================
          THE FULL-SCREEN UNIVERSE PORTAL (GLITCH & CRT CUSTOM TRANSITIONS)
          Style 1 (Cyber Hologram Intercept): DakNode & Tech Stack (1.4x open, 1.5x close)
          Style 2 (Retro CRT Broken TV): Product Universe & Experience (1.4x open, 1.5x close)
         ========================================================================= */}
      {typeof document !== 'undefined' && destination
        ? createPortal(
            <div
              ref={portal}
              className={`sky-atlas-portal style-${transitionType} ${isClosing ? 'is-closing' : 'is-opening'}`}
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
            >
              {/* Real-time CRT Scanlines and Noise Overlay for Style 2 */}
              {transitionType === 'crt' && (
                <div className="crt-screen-fx" aria-hidden="true">
                  <div className="crt-scanlines" />
                  <canvas ref={noiseCanvasRef} className="crt-noise-canvas" />
                </div>
              )}

              {/* Cyber Telemetry HUD Tag for Style 1 */}
              {transitionType === 'cyber' && (
                <div className="cyber-telemetry-layer" aria-hidden="true">
                  <div className="telemetry-code">
                    // {destination.name.toUpperCase()} · TELEMETRY LOCKED
                  </div>
                </div>
              )}

              {/* Cosmic Hyperspace Star-Warp Background */}
              <div 
                className="sky-atlas-portal-cosmos" 
                style={{ '--universe-color': destination.color } as CSSProperties} 
                data-destination={destination.id}
                aria-hidden="true"
              >
                {/* Deep Cosmic Diffuse Optical Aura */}
                <div 
                  className="portal-nebula-aura"
                  style={{ backgroundImage: `url(${destination.celestialImage})` }}
                />
                {/* Sharp Telescopic Optical Layer */}
                <div 
                  className="portal-nebula-photo" 
                  style={{ backgroundImage: `url(${destination.celestialImage})` }} 
                />
                <div className="portal-nebula-glow" />
                <div className="portal-stars-dense" />
                <div className="portal-grid-matrix" />
                <div className="portal-vortex-ring" />
                <div className="portal-readability-scrim" />
              </div>

              {/* Inner Content Deck */}
              <div className="sky-atlas-portal-inner">
                {/* Top Bar with Return to Sky Button */}
                <header className="sky-atlas-portal-header">
                  <button
                    type="button"
                    ref={closeButton}
                    className="sky-atlas-close-btn"
                    onClick={closeUniverse}
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
                      <div 
                        className="sky-atlas-heading-orb"
                        style={{
                          backgroundImage: `radial-gradient(circle at 40% 38%, rgba(255, 255, 255, 0.95) 0%, transparent 35%), url(${destination.celestialImage})`,
                          boxShadow: `0 0 45px ${destination.accentGlow}, 0 0 15px rgba(255, 255, 255, 0.45), inset -12px -12px 24px rgba(0, 0, 0, 0.95), inset 4px 4px 10px rgba(255, 255, 255, 0.25)`
                        }}
                      />
                    </div>
                  </div>

                  {/* Animated Tab Content Container */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={destination.id}
                      initial={{ opacity: 0, y: 22, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -16, scale: 0.98 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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
                          onClick={() => {
                            const type = getTransitionType(item.id);
                            playTransitionSound(type);
                            setSelected(item.id);
                          }}
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
                      onClick={closeUniverse}
                    >
                      <span>Explore full {destination.name} section on page</span>
                      <span aria-hidden="true">↓</span>
                    </a>
                  </div>
                </footer>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
