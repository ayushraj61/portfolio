'use client';

import { motion } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import './ProductOrbit.css';

interface ProductShowcaseItem {
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

const showcaseProducts: ProductShowcaseItem[] = [
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

export default function ProductGrid() {
  return (
    <SectionWrapper
      className="section orbital-section universe-section"
      id="work"
      isDestination
      atmosphereColor="#475980"
    >
      <div className="container">
        {/* Section Header */}
        <div className="orbital-header">
          <div className="orbital-eyebrow">
            <span className="orbital-beacon-dot" />
            Destination 03 // Real Systems In-Action
          </div>
          <motion.h2
            className="orbital-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            Engineered Systems & Products
          </motion.h2>
          <motion.p
            className="orbital-subtitle"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Real products running in production and development. Click any title or tap the live browser window to launch the live system.
          </motion.p>
        </div>

        {/* Sequential Split Showcase List */}
        <div className="split-showcase-list">
          {showcaseProducts.map((product) => (
            <motion.article
              key={product.id}
              className="split-showcase-row"
              style={{ '--card-accent': product.accent } as React.CSSProperties}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
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
            </motion.article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
