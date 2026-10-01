'use client';

import { motion } from 'framer-motion';

// ========================================
// PHILOSOPHY STRIP — Build → Ship → Learn
// "I learn by building." — Part of the building approach
// ========================================

const items = [
  {
    number: '01',
    title: 'Build',
    desc: 'Turn ideas into working software.',
  },
  {
    number: '02',
    title: 'Ship',
    desc: 'Deploy it and put it in front of real users.',
  },
  {
    number: '03',
    title: 'Learn',
    desc: 'Use feedback to decide what deserves another iteration.',
  },
];

export default function PhilosophyStrip() {
  return (
    <div className="philosophy-strip philosophy-strip-embedded" aria-label="Building philosophy">
        <motion.p
          className="philosophy-header"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
        >
          I learn by building.
        </motion.p>

        <div className="philosophy-grid">
          {items.map((item, i) => (
            <motion.div
              key={item.number}
              className="philosophy-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <span className="philosophy-number">{item.number}</span>
              <div>
                <p className="philosophy-item-title">{item.title}</p>
                <p className="philosophy-item-desc">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
    </div>
  );
}
