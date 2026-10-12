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
