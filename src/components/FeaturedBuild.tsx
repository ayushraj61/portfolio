'use client';

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { products } from '@/data/products';
import StatusBadge from './StatusBadge';
import SectionWrapper from './SectionWrapper';

// ========================================
// FEATURED BUILD — DakNode prominent section
// "What I'm building now" — Per sections 8 & 24
// Wrapped in SectionWrapper for "destination approaching" effect
// ========================================

export default function FeaturedBuild() {
  const daknode = products.find((p) => p.id === 'daknode')!;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-5, 5]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    const xPct = clientX / width - 0.5;
    const yPct = clientY / height - 0.5;
    mouseX.set(xPct * 200);
    mouseY.set(yPct * 200);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <SectionWrapper className="section" id="building" isDestination={true} atmosphereColor="#d4a853">
      <div className="container">
        <motion.div
          className="section-eyebrow"
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow-dot" />
          Destination 02 / Active Station
        </motion.div>

        <motion.h2
          className="section-title"
          initial={{ opacity: 0, x: 54, clipPath: 'inset(0 0 0 18%)' }}
          whileInView={{ opacity: 1, x: 0, clipPath: 'inset(0 0 0 0%)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          What I&apos;m building now
        </motion.h2>

        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginBottom: '2.5rem' }}
        >
          Exploring the infrastructure layer required for agents to communicate with the outside world reliably and safely.
        </motion.p>

        <motion.div
          className="featured-build"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ rotateX, rotateY, transformPerspective: 1200 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Active signal ring animation */}
          <div className="featured-signal-rings" aria-hidden="true">
            <span className="signal-ring ring-1" />
            <span className="signal-ring ring-2" />
            <span className="signal-ring ring-3" />
          </div>

          <div className="featured-build-status">
            <StatusBadge status={daknode.status} />
            <span className="featured-active-badge">
              <span className="featured-active-dot" />
              Active Signal
            </span>
          </div>

          <h3 className="featured-build-name">{daknode.name}</h3>
          <p className="featured-build-category">{daknode.category}</p>
          <p className="featured-build-desc">{daknode.expandedDescription}</p>

          <div className="featured-system" aria-label="DakNode communication system direction">
            <span className="featured-system-title">SYSTEM DIRECTION / IN DEVELOPMENT</span>
            <div className="featured-system-route">
              <span>AGENT</span><i aria-hidden="true">→</i>
              <strong>DAKNODE</strong><i aria-hidden="true">→</i>
              <span>EMAIL</span>
            </div>
            <div className="featured-system-channels">
              <span>IDENTITY</span><span>INBOX</span><span>EVENTS</span>
            </div>
          </div>

          <div className="featured-build-tags">
            {daknode.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>

          {daknode.url && (
            <a
              href={daknode.url}
              target="_blank"
              rel="noopener noreferrer"
              className="featured-build-link"
            >
              Explore DakNode <span className="arrow">→</span>
            </a>
          )}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
