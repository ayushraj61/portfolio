'use client';

// ========================================
// MAIN PAGE — The Journey
// Per design-enhance.txt §5: Launch sequence first
// Per design-enhance.txt §7: Two modes — Experience + Quick Explore
// Per DESIGN.txt §22: Hybrid Experience
// ========================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LaunchScreen from '@/components/LaunchScreen';
import SpaceCanvas from '@/components/SpaceCanvas';
import ScrollProgress from '@/components/ScrollProgress';
import JourneyIndicator from '@/components/JourneyIndicator';
import Spaceship from '@/components/Spaceship';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SpaceTransition from '@/components/SpaceTransition';
import FeaturedBuild from '@/components/FeaturedBuild';
import ProductGrid from '@/components/ProductGrid';
import BuilderPath from '@/components/BuilderPath';
import ExperienceSection from '@/components/ExperienceSection';
import TechDepth from '@/components/TechDepth';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { scrollToStop } from '@/data/journey';

export default function Home() {
  const [hasLaunched, setHasLaunched] = useState(false);
  const [showLaunch, setShowLaunch] = useState(true);

  const handleLaunch = () => {
    setHasLaunched(true);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    // Small delay before removing the launch screen DOM (after aperture dissolves)
    setTimeout(() => setShowLaunch(false), 1300);
  };

  const handleSkip = (destination: string) => {
    setHasLaunched(true);
    setShowLaunch(false);
    requestAnimationFrame(() => scrollToStop(destination));
  };

  return (
    <>
      {/* Launch Screen — The cinematic entry point */}
      <AnimatePresence>
        {showLaunch && (
          <LaunchScreen onLaunch={handleLaunch} onSkip={handleSkip} />
        )}
      </AnimatePresence>

      {/* Main portfolio — rendered underneath, revealed directly through opening 3D aperture */}
      <div
        aria-hidden={!hasLaunched}
        inert={!hasLaunched}
        style={{
          opacity: 1,
          pointerEvents: hasLaunched ? 'auto' : 'none',
        }}
      >
        {/* Fixed space background — animated starfield with scroll-driven journey */}
        <SpaceCanvas />

        {/* The Spaceship — central navigation metaphor anchored to the viewport */}
        <Spaceship />

        {/* Scroll progress bar — journey progress */}
        <ScrollProgress />

        {/* Journey indicator — side navigation dots (desktop only) */}
        <JourneyIndicator />

        {/* Navigation */}
        <Navbar />

        {/* Main content — The journey through space */}
        <main id="main" style={{ position: 'relative', zIndex: 1 }}>

          {/* ===== LAUNCH — The beginning ===== */}
          <HeroSection />

          {/* ===== DESTINATION 1: Signal Origin ===== */}
          <SpaceTransition nextDestination="About Me" />
          <AboutSection />

          {/* ===== DESTINATION 2: Active Station ===== */}
          <SpaceTransition nextDestination="DakNode Station" />
          <FeaturedBuild />

          {/* ===== DESTINATION 3: Product Universe ===== */}
          <SpaceTransition nextDestination="Product Worlds" />
          <ProductGrid />

          {/* ===== DESTINATION 4: AI & Systems ===== */}
          <SpaceTransition nextDestination="AI & Systems" />
          <TechDepth />

          {/* ===== DESTINATION 5: Mission Log ===== */}
          <SpaceTransition nextDestination="Mission Log" />
          <ExperienceSection />

          {/* ===== DESTINATION 6: Engineering Path ===== */}
          <SpaceTransition nextDestination="Engineering Path" />
          <BuilderPath />

          {/* ── The route continues beyond the map ── */}
          <SpaceTransition nextDestination="The Unknown" showNav={false} />

          {/* ===== FINAL: Contact — The Unknown ===== */}
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
