'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { experienceData, products, techStack } from '@/data/products';

type DestinationId = 'building' | 'products' | 'technology' | 'experience';

const destinations: {
  id: DestinationId;
  number: string;
  name: string;
  shortName: string;
  eyebrow: string;
  intro: string;
  color: string;
  section: string;
}[] = [
  {
    id: 'building', number: '01', name: 'Current Build', shortName: 'DakNode',
    eyebrow: 'A signal in progress', intro: 'The infrastructure I am building now.',
    color: '#dfb66f', section: 'building',
  },
  {
    id: 'products', number: '02', name: 'Product Universe', shortName: 'Products',
    eyebrow: 'Things I have made', intro: 'Useful ideas, experiments, and products in orbit.',
    color: '#8ca9ff', section: 'work',
  },
  {
    id: 'technology', number: '03', name: 'Tech Galaxy', shortName: 'Tech',
    eyebrow: 'What I work with', intro: 'The tools behind the systems I build.',
    color: '#7bd7d1', section: 'tech-depth',
  },
  {
    id: 'experience', number: '04', name: 'Mission Log', shortName: 'Experience',
    eyebrow: 'Experience', intro: 'The work that shaped how I build.',
    color: '#caa4ee', section: 'experience',
  },
];

const selectedProducts = products.filter((product) =>
  ['hyperflow', 'outlay', 'splitme', 'outfund', 'statechat'].includes(product.id)
);

function DestinationContent({ id }: { id: DestinationId }) {
  if (id === 'building') {
    const daknode = products.find((product) => product.id === 'daknode')!;
    return (
      <div className="sky-atlas-feature sky-atlas-feature-building">
        <div className="sky-atlas-feature-copy">
          <span className="sky-atlas-kicker">Building now / AI infrastructure</span>
          <h3>{daknode.name}</h3>
          <p>{daknode.expandedDescription}</p>
          <div className="sky-atlas-tags">{daknode.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
          <a href={daknode.url} target="_blank" rel="noopener noreferrer" className="sky-atlas-link">Visit DakNode <span aria-hidden="true">↗</span></a>
        </div>
        <div className="sky-atlas-system" aria-label="DakNode connects agents, inboxes, events, and workflows">
          <span className="sky-atlas-system-label">Communication architecture</span>
          <span className="sky-atlas-system-node sky-atlas-system-agent">AI agent</span>
          <span className="sky-atlas-system-node sky-atlas-system-core">DakNode<span className="sky-atlas-system-core-dot" /></span>
          <span className="sky-atlas-system-node sky-atlas-system-inbox">Inbox</span>
          <span className="sky-atlas-system-node sky-atlas-system-events">Events</span>
          <span className="sky-atlas-system-node sky-atlas-system-workflow">Workflows</span>
          <span className="sky-atlas-system-line line-one" /><span className="sky-atlas-system-line line-two" />
          <span className="sky-atlas-system-line line-three" /><span className="sky-atlas-system-line line-four" />
        </div>
      </div>
    );
  }

  if (id === 'products') {
    return (
      <div className="sky-atlas-grid sky-atlas-product-grid">
        {selectedProducts.map((product, index) => (
          <article className="sky-atlas-card sky-atlas-product" key={product.id} style={{ '--product-color': product.themeColor } as CSSProperties}>
            <div className="sky-atlas-card-top"><span>SYS / {String(index + 1).padStart(2, '0')}</span><span>{product.status}</span></div>
            <span className="sky-atlas-product-orb" aria-hidden="true" />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <span className="sky-atlas-card-category">{product.category}</span>
            {product.url && <a href={product.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${product.name}`} className="sky-atlas-card-link">Visit project ↗</a>}
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
            <div className="sky-atlas-card-top"><span>CLUSTER / {String(index + 1).padStart(2, '0')}</span><span className="sky-atlas-tech-star" aria-hidden="true">✦</span></div>
            <h3>{group.title}</h3>
            <div className="sky-atlas-tech-items">{group.items.map((item) => <span key={item}>{item}</span>)}</div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="sky-atlas-grid sky-atlas-experience-grid">
      {experienceData.map((role) => (
        <article className="sky-atlas-card sky-atlas-role" key={role.number}>
          <div className="sky-atlas-card-top"><span>MISSION / {role.number}</span><span>{role.duration}</span></div>
          <span className="sky-atlas-card-category">{role.company} · {role.location}</span>
          <h3>{role.role}</h3>
          <ul>{role.bullets.slice(0, 4).map((bullet) => <li key={bullet.text}>{bullet.text}{bullet.highlight && <strong> — {bullet.highlight}</strong>}</li>)}</ul>
        </article>
      ))}
    </div>
  );
}

export default function SkyAtlas() {
  const [selected, setSelected] = useState<DestinationId | null>(null);
  const [mobileMapOpen, setMobileMapOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const trigger = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);
  const portal = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const destination = destinations.find((item) => item.id === selected);
  const isOpen = selected !== null;

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => closeButton.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'Tab') {
        const controls = portal.current?.querySelectorAll<HTMLElement>('button, a[href]');
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      trigger.current?.focus();
    };
  }, [isOpen]);

  const open = (id: DestinationId, button: HTMLButtonElement) => {
    const bounds = button.getBoundingClientRect();
    setOrigin({ x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 });
    trigger.current = button;
    setSelected(id);
    setMobileMapOpen(false);
  };

  const clipOrigin = `${origin.x}px ${origin.y}px`;

  return (
    <>
      <div className="sky-atlas" aria-label="Explore my work through the night sky">
        <div className="sky-atlas-caption"><span className="sky-atlas-caption-line" />Explore the sky <span>· Select a constellation</span></div>
        <div className="sky-atlas-constellations">
          {destinations.map((item) => (
            <button
              type="button" key={item.id}
              className={`sky-atlas-constellation sky-atlas-constellation-${item.id}`}
              style={{ '--atlas-accent': item.color } as CSSProperties}
              onClick={(event) => open(item.id, event.currentTarget)}
              aria-label={`Explore ${item.name}`}
            >
              <span className="sky-atlas-constellation-art" aria-hidden="true">
                <i /><i /><i /><i /><i />
                <span className="sky-atlas-galaxy" />
              </span>
              <span className="sky-atlas-constellation-name"><small>{item.number} / CONSTELLATION</small>{item.shortName}</span>
            </button>
          ))}
        </div>
        <button className="sky-atlas-mobile-trigger" type="button" onClick={() => setMobileMapOpen((value) => !value)} aria-expanded={mobileMapOpen} aria-controls="sky-atlas-mobile-map">
          <span aria-hidden="true">✧</span> Explore the sky
        </button>
        {mobileMapOpen && <div id="sky-atlas-mobile-map" className="sky-atlas-mobile-map">
          <div className="sky-atlas-mobile-map-heading">Choose a constellation</div>
          {destinations.map((item) => <button type="button" key={item.id} onClick={(event) => open(item.id, event.currentTarget)}><span style={{ color: item.color }}>✦</span>{item.name}<span aria-hidden="true">↗</span></button>)}
        </div>}
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {destination && <motion.div
            ref={portal}
            className="sky-atlas-portal"
            key="sky-atlas-portal"
            role="dialog" aria-modal="true" aria-label={`${destination.name} constellation`}
            style={{ '--atlas-accent': destination.color } as CSSProperties}
            initial={reducedMotion ? { opacity: 0 } : { clipPath: `circle(0px at ${clipOrigin})` }}
            animate={reducedMotion ? { opacity: 1 } : { clipPath: `circle(150vmax at ${clipOrigin})` }}
            exit={reducedMotion ? { opacity: 0 } : { clipPath: `circle(0px at ${clipOrigin})` }}
            transition={{ duration: reducedMotion ? 0.15 : 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="sky-atlas-portal-stars" aria-hidden="true" />
            <div className="sky-atlas-portal-inner">
              <header className="sky-atlas-portal-header">
                <span className="sky-atlas-portal-mark">✧ <span>AYUSH RAJ / STAR MAP</span></span>
                <button type="button" ref={closeButton} className="sky-atlas-close" onClick={() => setSelected(null)}>← Back to the sky <span aria-hidden="true">×</span></button>
              </header>
              <main className="sky-atlas-portal-main">
                <div className="sky-atlas-portal-heading">
                  <div><span className="sky-atlas-kicker">{destination.number} / {destination.eyebrow}</span><h2>{destination.name}</h2><p>{destination.intro}</p></div>
                  <span className="sky-atlas-heading-orb" aria-hidden="true" />
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={destination.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: reducedMotion ? 0 : 0.32 }}>
                    <DestinationContent id={destination.id} />
                  </motion.div>
                </AnimatePresence>
              </main>
              <footer className="sky-atlas-portal-footer">
                <nav aria-label="Other constellations">{destinations.map((item) => <button key={item.id} type="button" aria-current={item.id === selected ? 'page' : undefined} onClick={() => setSelected(item.id)}><span style={{ color: item.color }}>✦</span>{item.shortName}</button>)}</nav>
                <a href={`#${destination.section}`} onClick={() => setSelected(null)}>Explore full section ↓</a>
              </footer>
            </div>
          </motion.div>}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
