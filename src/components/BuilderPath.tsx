'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { builderPath } from '@/data/products';
import SectionWrapper from './SectionWrapper';
import RocketMark from './RocketMark';

// ========================================
// BUILDER'S PATH — Journey Timeline
// "From writing code to building systems"
// Destination approach animation
// ========================================

export default function BuilderPath() {
  const reduceMotion = useReducedMotion();
  const [previewStage, setPreviewStage] = useState(1);
  const previewLabels = ['Foundation', 'Current focus', 'Exploring next — future direction', 'Long-term goal — future ambition'];

  return (
    <SectionWrapper className="section" id="journey" isDestination={true} atmosphereColor="#10b981">
      <div className="container">
        <motion.div
          className="section-eyebrow"
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-eyebrow-dot" />
          Destination 06 / Engineering Path
        </motion.div>

        <motion.h2
          className="section-title"
          initial={{ opacity: 0, x: 54, clipPath: 'inset(0 0 0 18%)' }}
          whileInView={{ opacity: 1, x: 0, clipPath: 'inset(0 0 0 0%)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          From writing code to building systems
        </motion.h2>

        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginBottom: '3rem' }}
        >
          Software engineering is my foundation, and AI backend engineering is my focus today. Customer engineering and founding an AI company are directions I&apos;m working toward, not roles I hold now.
        </motion.p>

        <div className="builder-path">
          {builderPath.map((stage, i) => (
            <motion.div
              key={stage.number}
              className={`path-item ${stage.state === 'current' ? 'current' : ''} ${stage.state === 'future' ? 'future' : ''} ${stage.state === 'future' && previewStage >= i ? 'is-revealed' : ''}`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.7,
                delay: i * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="path-item-number">
                {stage.number}
              </div>
              <h3 className="path-item-title">{stage.title}</h3>
              <p className="path-item-label">{stage.label}</p>
              <p className="path-item-desc">{stage.description}</p>
              {stage.futureStatus && (
                <p className="path-item-future-status">
                  <span className="path-item-future-dot" aria-hidden="true" />
                  {stage.futureStatus}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="path-route">
          <div className="path-route-readout">
            <span>FLIGHT PATH / DRAG ROCKET TO PREVIEW</span>
            <span>{String(previewStage + 1).padStart(2, '0')} / 04 · {previewStage > 1 ? 'FUTURE PREVIEW' : previewStage === 1 ? 'CURRENT FOCUS' : 'FOUNDATION'}</span>
          </div>
          <div className="path-route-map">
            <div className="path-route-track" aria-hidden="true">
              <motion.span
                className="path-route-progress"
                initial={false}
                animate={{ scaleX: previewStage / 3 }}
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 25 }}
              />
            </div>
            <div className="path-route-stops" aria-hidden="true">
              {builderPath.map((stage, i) => (
                <div key={stage.number} className={`path-route-stop ${stage.state} ${previewStage === i && i > 1 ? 'is-previewed' : ''}`}>
                  <span className="path-route-node" />
                  <span className="path-route-stop-label">
                    {stage.state === 'completed' ? 'FOUNDATION' : stage.state === 'current' ? 'YOU ARE HERE' : stage.number === '03' ? 'EXPLORING NEXT' : 'LONG-TERM GOAL'}
                  </span>
                </div>
              ))}
            </div>
            <motion.div
              className="path-route-ship-position"
              initial={false}
              animate={{ left: `${12.5 + previewStage * 25}%` }}
              transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 25 }}
              aria-hidden="true"
            >
              <span className="path-route-ship">
                <RocketMark />
              </span>
            </motion.div>
            <input
              className="path-route-slider"
              type="range"
              min="0"
              max="3"
              step="1"
              value={previewStage}
              onChange={(event) => setPreviewStage(Number(event.target.value))}
              aria-label="Move rocket along the engineering path to preview a stage"
              aria-valuetext={previewLabels[previewStage]}
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
