'use client';

import { useEffect, useRef, useState } from 'react';
import { getEarthTexture } from '@/lib/earthTexture';

interface LaunchFlightProps {
  onComplete: () => void;
  onSkip: () => void;
}

type RouteLabel = 'DEEP SPACE' | 'MILKY WAY' | 'SOLAR SYSTEM' | 'EARTH';

const DURATION = 12000;
const TAU = Math.PI * 2;
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smooth = (from: number, to: number, value: number) => {
  const point = clamp((value - from) / (to - from));
  return point * point * (3 - 2 * point);
};

function randomGenerator(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (1664525 * value + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function drawStars(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number, lookX: number, lookY: number, stars: { x: number; y: number; z: number; size: number; warm: boolean }[]) {
  const reach = Math.min(width, height) * .6;
  const centerX = width * .5 + lookX * width * .025;
  const centerY = height * .47 + lookY * height * .025;
  const distance = progress * 4.3;
  const streak = 2 + smooth(0, .18, progress) * 9 + smooth(.37, .58, progress) * 11;
  for (const star of stars) {
    const depth = ((star.z - distance * (.55 + star.size * .12)) % 1 + 1) % 1;
    const perspective = 1 / (.1 + depth * 1.35);
    const x = centerX + star.x * reach * perspective;
    const y = centerY + star.y * reach * perspective;
    if (x < -20 || x > width + 20 || y < -20 || y > height + 20) continue;
    const alpha = (.24 + (1 - depth) * .52) * (star.warm ? .9 : 1);
    const tail = streak * (1 - depth) * Math.max(.4, star.size);
    ctx.beginPath();
    ctx.moveTo(x - (x - centerX) * tail / Math.max(20, reach), y - (y - centerY) * tail / Math.max(20, reach));
    ctx.lineTo(x, y);
    ctx.lineWidth = Math.min(2, .35 + star.size * perspective * .27);
    ctx.strokeStyle = star.warm ? `rgba(244,215,165,${alpha})` : `rgba(205,225,255,${alpha})`;
    ctx.stroke();
  }
}

function drawGalaxy(ctx: CanvasRenderingContext2D, galaxy: HTMLImageElement | null, width: number, height: number, progress: number, lookX: number, lookY: number) {
  const fade = (1 - smooth(.43, .55, progress)) * smooth(0, .08, progress);
  if (fade < .003 || !galaxy) return;
  const grow = Math.pow(smooth(0, .63, progress), 1.75);
  const size = Math.min(width, height) * (.35 + grow * 3.9);
  const x = width * (.53 - progress * .045) + lookX * width * .035;
  const y = height * (.43 + progress * .025) + lookY * height * .035;
  ctx.save();
  ctx.globalAlpha = fade;
  ctx.translate(x, y);
  ctx.rotate(progress * .38);
  ctx.drawImage(galaxy, -size / 2, -size / 2, size, size);
  ctx.restore();
}

type SolarBody = { name: string; orbit: number; angle: number; radius: number; colors: [string, string, string] };

const solarBodies: SolarBody[] = [
  { name: 'NEPTUNE', orbit: 3.2, angle: -1.9, radius: .052, colors: ['#b6d9ff', '#2f66c1', '#10245a'] },
  { name: 'URANUS', orbit: 2.85, angle: -.3, radius: .07, colors: ['#d7ffff', '#7fcdd4', '#235578'] },
  { name: 'SATURN', orbit: 2.4, angle: -2.15, radius: .095, colors: ['#fff1bb', '#c8a66b', '#55412c'] },
  { name: 'JUPITER', orbit: 1.98, angle: .32, radius: .145, colors: ['#f7e7c7', '#b7835d', '#49392e'] },
  { name: 'MARS', orbit: 1.35, angle: -.88, radius: .035, colors: ['#ffbea0', '#ad4939', '#3f2026'] },
  { name: 'VENUS', orbit: .78, angle: 2.22, radius: .04, colors: ['#f9e8c4', '#c8a674', '#514433'] },
  { name: 'MERCURY', orbit: .52, angle: -.45, radius: .025, colors: ['#e5ddd0', '#8f8985', '#333b44'] },
];

function drawPlanet(ctx: CanvasRenderingContext2D, body: SolarBody, x: number, y: number, radius: number) {
  if (radius < 1 || x + radius < -80 || x - radius > ctx.canvas.width || y + radius < -80 || y - radius > ctx.canvas.height) return;
  ctx.save();
  if (body.name === 'SATURN') {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-.26);
    for (const [width, color] of [[radius * .31, 'rgba(190,166,125,.32)'], [radius * .14, 'rgba(226,207,162,.72)'], [radius * .055, 'rgba(116,104,84,.72)']] as const) {
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.82, radius * .58, 0, Math.PI, TAU);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.clip();
  const light = ctx.createRadialGradient(x - radius * .38, y - radius * .34, radius * .04, x + radius * .18, y + radius * .1, radius * 1.4);
  light.addColorStop(0, body.colors[0]);
  light.addColorStop(.48, body.colors[1]);
  light.addColorStop(1, body.colors[2]);
  ctx.fillStyle = light;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  if (body.name === 'JUPITER' || body.name === 'SATURN') {
    for (let band = -5; band <= 5; band++) {
      const bandY = y + radius * (band * .19 + Math.sin(band * 2.1) * .025);
      const bandHeight = radius * (.045 + ((band + 6) % 3) * .022);
      ctx.beginPath();
      ctx.moveTo(x - radius * 1.4, bandY);
      ctx.bezierCurveTo(x - radius * .5, bandY - radius * .065, x + radius * .45, bandY + radius * .08, x + radius * 1.4, bandY);
      ctx.lineWidth = bandHeight;
      ctx.strokeStyle = band % 2 ? 'rgba(84,51,44,.36)' : 'rgba(255,242,213,.3)';
      ctx.stroke();
    }
    if (body.name === 'JUPITER') {
      ctx.beginPath();
      ctx.ellipse(x + radius * .4, y + radius * .18, radius * .23, radius * .085, -.13, 0, TAU);
      ctx.fillStyle = 'rgba(167,75,58,.72)';
      ctx.fill();
    }
  }
  ctx.restore();
  if (body.name === 'SATURN') {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-.26);
    for (const [width, color] of [[radius * .31, 'rgba(172,147,113,.38)'], [radius * .13, 'rgba(247,230,183,.83)'], [radius * .05, 'rgba(92,82,67,.7)']] as const) {
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.82, radius * .58, 0, 0, Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    }
    ctx.restore();
  }
}

function solarFrame(width: number, height: number, progress: number, lookX: number, lookY: number) {
  const approach = smooth(.43, .82, progress);
  const scale = Math.min(width, height) * (.075 + approach * 1.05);
  const x = width * (.57 - approach * .78) + lookX * width * .025;
  const y = height * (.45 + approach * .075) + lookY * height * .025;
  return { approach, scale, x, y };
}

function drawSolarSystem(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number, lookX: number, lookY: number) {
  const visibility = smooth(.43, .52, progress) * (1 - smooth(.75, .85, progress));
  if (visibility < .003) return;
  const { approach, scale, x, y } = solarFrame(width, height, progress, lookX, lookY);
  const sunRadius = Math.min(width, height) * (.018 + approach * .14);
  ctx.save();
  ctx.globalAlpha = visibility;

  // The orbital plane grows and slides past the cockpit as the camera moves forward.
  for (const orbit of [.52, .78, 1.1, 1.35, 1.98, 2.4, 2.85, 3.2]) {
    ctx.beginPath();
    ctx.ellipse(x, y, scale * orbit, scale * orbit * .34, -.16, 0, TAU);
    ctx.strokeStyle = `rgba(154,187,212,${.21 - approach * .1})`;
    ctx.lineWidth = Math.max(.6, 1.1 - approach * .35);
    ctx.stroke();
  }
  for (let index = 0; index < 165; index++) {
    const angle = index * 2.39996;
    const orbit = 1.56 + ((index * 37) % 29) / 190;
    const ax = x + Math.cos(angle) * scale * orbit;
    const ay = y + Math.sin(angle) * scale * orbit * .34;
    if (ax < 0 || ax > width || ay < 0 || ay > height) continue;
    ctx.beginPath();
    ctx.arc(ax, ay, Math.min(2.4, .35 + approach * 2.1 * ((index % 5) / 5 + .5)), 0, TAU);
    ctx.fillStyle = `rgba(204,192,171,${.2 + (index % 4) * .1})`;
    ctx.fill();
  }

  const glow = ctx.createRadialGradient(x, y, sunRadius * .35, x, y, sunRadius * 4.8);
  glow.addColorStop(0, 'rgba(255,239,173,.91)');
  glow.addColorStop(.12, 'rgba(255,168,59,.56)');
  glow.addColorStop(.38, 'rgba(194,92,29,.16)');
  glow.addColorStop(1, 'rgba(194,92,29,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(x - sunRadius * 5, y - sunRadius * 5, sunRadius * 10, sunRadius * 10);
  ctx.beginPath();
  ctx.arc(x, y, sunRadius, 0, TAU);
  const solarSurface = ctx.createRadialGradient(x - sunRadius * .28, y - sunRadius * .3, sunRadius * .05, x, y, sunRadius);
  solarSurface.addColorStop(0, '#fff7cf');
  solarSurface.addColorStop(.46, '#ffd768');
  solarSurface.addColorStop(.82, '#ee8b25');
  solarSurface.addColorStop(1, '#a74317');
  ctx.fillStyle = solarSurface;
  ctx.shadowColor = '#f5a94b';
  ctx.shadowBlur = sunRadius * .55;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, sunRadius * .96, 0, TAU);
  ctx.clip();
  for (let band = -4; band <= 4; band++) {
    const lineY = y + band * sunRadius * .24;
    ctx.beginPath();
    ctx.moveTo(x - sunRadius, lineY + sunRadius * .08);
    ctx.bezierCurveTo(x - sunRadius * .32, lineY - sunRadius * .16, x + sunRadius * .31, lineY + sunRadius * .14, x + sunRadius, lineY - sunRadius * .06);
    ctx.strokeStyle = band % 2 ? 'rgba(255,250,204,.24)' : 'rgba(176,61,14,.18)';
    ctx.lineWidth = Math.max(1, sunRadius * .045);
    ctx.stroke();
  }
  ctx.restore();
  for (const body of solarBodies) {
    const angle = body.angle + approach * .07;
    const px = x + Math.cos(angle) * scale * body.orbit;
    const py = y + Math.sin(angle) * scale * body.orbit * .34;
    drawPlanet(ctx, body, px, py, Math.max(1, scale * body.radius));
  }
  ctx.restore();
}

function drawEarth(ctx: CanvasRenderingContext2D, earth: HTMLCanvasElement | null, width: number, height: number, progress: number, lookX: number, lookY: number) {
  const visibility = smooth(.43, .52, progress);
  if (visibility < .002) return;
  const { approach, scale, x: sunX, y: sunY } = solarFrame(width, height, progress, lookX, lookY);
  const orbitAngle = .15;
  const orbitRadius = scale * 1.1;
  const orbitMinorRadius = orbitRadius * .34;
  const orbitX = sunX + orbitRadius * Math.cos(orbitAngle) * Math.cos(-.16) - orbitMinorRadius * Math.sin(orbitAngle) * Math.sin(-.16);
  const orbitY = sunY + orbitRadius * Math.cos(orbitAngle) * Math.sin(-.16) + orbitMinorRadius * Math.sin(orbitAngle) * Math.cos(-.16);
  const approachBlend = smooth(.65, .85, progress);
  const targetX = width * .5 + lookX * width * .018;
  const targetY = height * .485 + lookY * height * .018;
  const x = orbitX * (1 - approachBlend) + targetX * approachBlend;
  const y = orbitY * (1 - approachBlend) + targetY * approachBlend;
  const zoom = Math.pow(clamp((progress - .64) / .36), 2.4);
  const radius = Math.min(width, height) * (.007 + approach * .048 + zoom * .88);
  ctx.save();
  ctx.globalAlpha = visibility;
  const halo = ctx.createRadialGradient(x, y, radius * .72, x, y, radius * 1.45);
  halo.addColorStop(0, 'rgba(69,142,218,0)');
  halo.addColorStop(.57, 'rgba(70,149,230,.18)');
  halo.addColorStop(.7, 'rgba(101,186,255,.11)');
  halo.addColorStop(1, 'rgba(83,154,226,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(x - radius * 1.5, y - radius * 1.5, radius * 3, radius * 3);
  if (earth) {
    ctx.drawImage(earth, x - radius, y - radius, radius * 2, radius * 2);
  } else {
    const fallback = ctx.createRadialGradient(x - radius * .3, y - radius * .35, 0, x, y, radius);
    fallback.addColorStop(0, '#9ed3e8');
    fallback.addColorStop(.45, '#316f9c');
    fallback.addColorStop(1, '#081b3a');
    ctx.fillStyle = fallback;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(x, y, radius + 1, 0, TAU);
  ctx.strokeStyle = 'rgba(135,208,255,.55)';
  ctx.lineWidth = Math.max(1, radius * .004);
  ctx.shadowBlur = Math.min(32, radius * .08);
  ctx.shadowColor = '#6bc9ff';
  ctx.stroke();
  if (width > 700 && progress < .78) {
    const marker = smooth(.47, .53, progress) * (1 - smooth(.69, .78, progress));
    ctx.globalAlpha = marker * .82;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(x + radius + 7, y - radius * .24);
    ctx.lineTo(x + radius + 20, y - radius * .24 - 11);
    ctx.lineTo(x + radius + 52, y - radius * .24 - 11);
    ctx.strokeStyle = 'rgba(156,216,249,.72)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#bedcf0';
    ctx.font = '600 10px "JetBrains Mono", monospace';
    ctx.fillText('EARTH / TARGET', x + radius + 56, y - radius * .24 - 7);
  }
  ctx.restore();
}

export default function LaunchFlight({ onComplete, onSkip }: LaunchFlightProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [route, setRoute] = useState<RouteLabel>('DEEP SPACE');
  const completeRef = useRef(onComplete);
  useEffect(() => { completeRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;
    let frameId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let lookX = 0;
    let lookY = 0;
    let targetX = 0;
    let targetY = 0;
    let earth: HTMLCanvasElement | null = null;
    let galaxy: HTMLImageElement | null = null;
    const galaxyImage = new Image();
    galaxyImage.onload = () => { galaxy = galaxyImage; };
    galaxyImage.src = '/flight/galaxy-v2.png';
    const rand = randomGenerator(15507);
    const stars = Array.from({ length: width < 768 ? 280 : 530 }, () => ({
      x: rand() * 2 - 1,
      y: rand() * 2 - 1,
      z: rand(),
      size: .5 + rand() * 1.7,
      warm: rand() > .92,
    }));
    let active = true;
    getEarthTexture().then((texture) => { if (active) earth = texture; }).catch(() => {});

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const pointer = (event: PointerEvent) => {
      targetX = (event.clientX / width - .5) * 2;
      targetY = (event.clientY / height - .5) * 2;
    };
    resize();
    const start = performance.now();
    let lastRoute: RouteLabel = 'DEEP SPACE';
    const draw = (now: number) => {
      const progress = clamp((now - start) / DURATION);
      lookX += (targetX - lookX) * .035;
      lookY += (targetY - lookY) * .035;
      ctx.fillStyle = '#02050b';
      ctx.fillRect(0, 0, width, height);
      const backdrop = ctx.createRadialGradient(width * .5, height * .43, 0, width * .5, height * .43, Math.max(width, height) * .72);
      backdrop.addColorStop(0, progress < .6 ? '#101729' : '#0a1b31');
      backdrop.addColorStop(.55, '#070d1a');
      backdrop.addColorStop(1, '#02050b');
      ctx.fillStyle = backdrop;
      ctx.fillRect(0, 0, width, height);

      drawGalaxy(ctx, galaxy, width, height, progress, lookX, lookY);
      drawStars(ctx, width, height, progress, lookX, lookY, stars);
      drawSolarSystem(ctx, width, height, progress, lookX, lookY);
      drawEarth(ctx, earth, width, height, progress, lookX, lookY);

      const routeNow: RouteLabel = progress < .09 ? 'DEEP SPACE' : progress < .49 ? 'MILKY WAY' : progress < .77 ? 'SOLAR SYSTEM' : 'EARTH';
      if (routeNow !== lastRoute) {
        lastRoute = routeNow;
        setRoute(routeNow);
      }
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
      if (progress >= 1) {
        completeRef.current();
        return;
      }
      frameId = requestAnimationFrame(draw);
    };
    frameId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', pointer, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      galaxyImage.onload = null;
      active = false;
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', pointer);
    };
  }, []);

  return (
    <div className="pov-flight">
      <canvas ref={canvasRef} className="pov-flight-canvas" aria-hidden="true" />
      <div className="pov-flight-vignette" aria-hidden="true" />
      <div className="pov-flight-canopy" aria-hidden="true">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="none">
          <defs>
            <linearGradient id="canopy-metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#243140" /><stop offset=".46" stopColor="#090f19" /><stop offset="1" stopColor="#020408" /></linearGradient>
            <linearGradient id="console-metal" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#111d2b" /><stop offset="1" stopColor="#020407" /></linearGradient>
          </defs>
          <path d="M0 0H1440V92Q1070 44 720 55Q370 44 0 92Z" fill="url(#canopy-metal)" stroke="#344556" strokeOpacity=".42" strokeWidth="2" />
          <path d="M0 0V900H126L184 778Q65 440 108 92Z" fill="url(#canopy-metal)" stroke="#62788c" strokeOpacity=".28" strokeWidth="2" />
          <path d="M1440 0V900H1314L1256 778Q1375 440 1332 92Z" fill="url(#canopy-metal)" stroke="#62788c" strokeOpacity=".28" strokeWidth="2" />
          <path d="M0 761Q230 742 411 804L505 849H935L1029 804Q1210 742 1440 761V900H0Z" fill="url(#console-metal)" stroke="#526a80" strokeOpacity=".5" strokeWidth="2" />
          <path d="M126 900 183 778 270 803 236 900M1314 900 1257 778 1170 803 1204 900" fill="#111b27" stroke="#466077" strokeOpacity=".46" />
          <path d="M505 849H935L900 900H540Z" fill="#090f19" stroke="#68859b" strokeOpacity=".42" />
          <path d="M550 856H890M584 871H856" stroke="#a6c7d5" strokeOpacity=".22" />
          <path d="M113 94Q720 14 1327 94" fill="none" stroke="#8ba4b8" strokeOpacity=".28" strokeWidth="2" />
          <path d="M151 99Q110 480 191 750M1289 99Q1330 480 1249 750" fill="none" stroke="#65819a" strokeOpacity=".2" strokeWidth="2" />
        </svg>
      </div>
      <div className="pov-flight-topline">
        <div className="pov-flight-brand"><span className="pov-flight-brand-mark">◇</span><span>AYUSH RAJ <small>/ EXPEDITION 01</small></span></div>
        <button type="button" className="pov-flight-skip" onClick={onSkip}>Skip flight <span aria-hidden="true">↗</span></button>
      </div>
      <div className="pov-flight-reticle" aria-hidden="true"><span /><i /></div>
      <div className="pov-flight-readout" aria-live="polite" aria-atomic="true">
        <span className="pov-flight-readout-kicker">FORWARD VIEW / CONTINUOUS FLIGHT</span>
        <strong>{route}</strong>
        <span className="pov-flight-readout-detail">{route === 'DEEP SPACE' ? 'SETTING COURSE' : route === 'MILKY WAY' ? 'ENTERING THE GALAXY' : route === 'SOLAR SYSTEM' ? 'THREADING THE ORBITS' : 'FINAL APPROACH'}</span>
      </div>
      <div className="pov-flight-right-readout" aria-hidden="true"><span>01 / 01</span><i />VISUAL ROUTE<br />AUTOPILOT ENGAGED</div>
      <div className="pov-flight-progress-track" aria-label="Flight progress"><div ref={progressRef} /></div>
      <div className="pov-flight-console" aria-hidden="true">
        <div className="pov-flight-console-left"><span className="pov-flight-console-lights"><i /><i /><i /></span><span>FLIGHT SYSTEMS<br />NOMINAL</span></div>
        <div className="pov-flight-console-center"><span>◇</span><span>AYUSH&apos;S UNIVERSE</span></div>
        <div className="pov-flight-console-right">DEEP SPACE <i /> MILKY WAY <i /> SOLAR SYSTEM <i /> EARTH</div>
      </div>
    </div>
  );
}
