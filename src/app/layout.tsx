import type { Metadata } from 'next';
import './globals.css';
import './experience.css';
import './launch-flight.css';
import './hero-landscape.css';

// ========================================
// ROOT LAYOUT — SEO, Fonts, Meta
// Per tech-info section 39
// ========================================

export const metadata: Metadata = {
  icons: { icon: '/mark.svg' },
  title: 'Ayush Raj — Software Engineer & AI Builder',
  description:
    'Ayush Raj is a software engineer and AI builder focused on backend systems, AI products, automation, and product development. Building at the intersection of software, AI, and real-world problems.',
  keywords: [
    'Ayush Raj',
    'Software Engineer',
    'AI Builder',
    'Product Builder',
    'Backend Engineer',
    'DakNode',
    'HyperFlow',
    'AI Products',
    'Portfolio',
  ],
  authors: [{ name: 'Ayush Raj' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Ayush Raj — Software Engineer & AI Builder',
    description:
      'Software engineer and AI builder focused on backend systems, AI products, automation, and product development.',
    siteName: 'Ayush Raj',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayush Raj — Software Engineer & AI Builder',
    description:
      'Software engineer and AI builder focused on backend systems, AI products, automation, and product development.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

import CustomCursor from '@/components/CustomCursor';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#050508" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <a href="#main" className="skip-to-content">Skip to content</a>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
