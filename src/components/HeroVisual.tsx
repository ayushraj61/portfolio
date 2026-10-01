'use client';

import { useEffect, useRef } from 'react';
import { getEarthTexture } from '@/lib/earthTexture';

export default function HeroVisual() {
  const globeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let active = true;
    getEarthTexture().then((texture) => {
      const canvas = globeRef.current;
      if (!active || !canvas) return;
      canvas.width = texture.width;
      canvas.height = texture.height;
      canvas.getContext('2d')?.drawImage(texture, 0, 0);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <div className="hero-visual-container" aria-hidden="true">
      <span className="hero-visual-index">FIG. 01 / THE STARTING POINT</span>
      <span className="hero-visual-orbit hero-visual-orbit-one" />
      <span className="hero-visual-orbit hero-visual-orbit-two" />
      <span className="hero-visual-orbit hero-visual-orbit-three" />
      <span className="hero-visual-axis hero-visual-axis-x" />
      <span className="hero-visual-axis hero-visual-axis-y" />
      <span className="hero-visual-planet"><canvas ref={globeRef} /><span /></span>
      <span className="hero-visual-tag hero-visual-tag-earth">EARTH <b>01 / ORIGIN</b></span>
      <span className="hero-visual-tag hero-visual-tag-route">ROUTE <b>STILL BEING WRITTEN</b></span>
      <span className="hero-visual-coordinate">28° 36&apos; 46.0&quot; N<br />77° 12&apos; 32.0&quot; E</span>
    </div>
  );
}
