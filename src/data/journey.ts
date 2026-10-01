export const journeyStops = [
  { id: 'hero', label: 'Earth', heading: 'Ayush Raj', shortLabel: 'Origin' },
  { id: 'about', label: 'About Station', heading: 'About me', shortLabel: 'About' },
  { id: 'building', label: 'DakNode Station', heading: "What I'm building now", shortLabel: 'Current build' },
  { id: 'work', label: 'Product Station', heading: "Things I've built", shortLabel: 'Projects' },
  { id: 'tech-depth', label: 'Tech Station', heading: 'What I work with', shortLabel: 'Tools' },
  { id: 'how-i-build', label: 'Method Station', heading: 'How I build', shortLabel: 'Approach' },
  { id: 'journey', label: 'Horizon Station', heading: 'From writing code to building systems', shortLabel: 'Journey' },
  { id: 'contact', label: 'The Unknown', heading: 'Build something useful', shortLabel: 'Contact' },
] as const;

export function scrollToStop(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    block: 'start',
  });
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}
