import { useId } from 'react';

interface RocketMarkProps {
  className?: string;
}

export default function RocketMark({ className }: RocketMarkProps) {
  const id = useId().replace(/:/g, '');
  const hull = `${id}-hull`;
  const fin = `${id}-fin`;
  const glass = `${id}-glass`;
  const flame = `${id}-flame`;

  return (
    <svg className={className} viewBox="0 0 64 116" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={hull} x1="16" y1="45" x2="48" y2="45" gradientUnits="userSpaceOnUse">
          <stop stopColor="#533a61" />
          <stop offset="0.22" stopColor="#c7a5d4" />
          <stop offset="0.43" stopColor="#f2e9ec" />
          <stop offset="0.68" stopColor="#8395aa" />
          <stop offset="1" stopColor="#553858" />
        </linearGradient>
        <linearGradient id={fin} x1="5" y1="70" x2="58" y2="94" gradientUnits="userSpaceOnUse">
          <stop stopColor="#51325d" />
          <stop offset="0.46" stopColor="#d7b2d5" />
          <stop offset="1" stopColor="#634366" />
        </linearGradient>
        <radialGradient id={glass} cx="0" cy="0" r="1" gradientTransform="translate(29 30) rotate(64) scale(19 13)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7477d1" />
          <stop offset="0.38" stopColor="#27356f" />
          <stop offset="1" stopColor="#10152e" />
        </radialGradient>
        <linearGradient id={flame} x1="32" y1="91" x2="32" y2="114" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff4c4" />
          <stop offset="0.45" stopColor="#e5bb6b" />
          <stop offset="1" stopColor="#667dd3" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path className="rocket-mark-flame-glow" d="M24 91c-5 9 1 19 8 25 7-6 13-16 8-25H24Z" fill="#6e8de8" opacity="0.4" />
      <path className="rocket-mark-flame" d="M27 91c-3 7 1 17 5 23 4-6 8-16 5-23H27Z" fill={`url(#${flame})`} />
      <path className="rocket-mark-flame-core" d="M30 93c-1 5 0 10 2 14 2-4 3-9 2-14h-4Z" fill="#fff5d4" />
      <path d="M21 58 8 78 6 97l16-12 6-13-7-14Z" fill={`url(#${fin})`} stroke="#d9afd6" strokeWidth="1.3" />
      <path d="m43 58 13 20 2 19-16-12-6-13 7-14Z" fill={`url(#${fin})`} stroke="#d9afd6" strokeWidth="1.3" />
      <path d="M32 4C22 13 18 29 19 50l2 24 8 13h6l8-13 2-24C46 29 42 13 32 4Z" fill={`url(#${hull})`} stroke="#e7c4df" strokeWidth="1.6" />
      <path d="M32 4C25 13 22 27 22 48l1 25 6 10" stroke="#fff5f3" strokeOpacity="0.68" strokeWidth="1.1" />
      <path d="M40 20c3 11 3 25 2 36l-2 19-5 8" stroke="#311e3f" strokeOpacity="0.7" strokeWidth="2" />
      <path d="M23 54c6 2 12 2 18 0M22 67c6 3 14 3 20 0" stroke="#372743" strokeOpacity="0.65" strokeWidth="1.1" />
      <ellipse cx="32" cy="34" rx="7.8" ry="12.2" fill={`url(#${glass})`} stroke="#d7c9ea" strokeWidth="1.4" />
      <path d="M28 25c-3 4-4 9-3 14" stroke="#b9b9ff" strokeOpacity="0.8" strokeWidth="1.1" strokeLinecap="round" />
      <path d="m29 81-3 14 6-5 6 5-3-14h-6Z" fill="#695575" stroke="#d7b1d0" strokeWidth="1.1" />
      <path d="M27 88h10l-1 7h-8l-1-7Z" fill="#e3c577" stroke="#fff0b2" strokeWidth="1" />
      <path d="M30 90h4" stroke="#fff8d0" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
