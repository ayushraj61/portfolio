'use client';

// ========================================
// FOOTER — Minimal
// Per tech-info section 33
// ========================================

export default function Footer() {
  return (
    <footer className="footer" aria-label="Site footer">
      <div className="container">
        <div className="footer-inner">
          <div>
            <p className="footer-brand">
              Ayush Raj · Software Engineer · AI Builder · Product Builder
            </p>
          </div>
          <p className="footer-tagline">Built with curiosity, code, and too many ideas.</p>
          <p className="footer-copy">© {new Date().getFullYear()} Ayush Raj</p>
        </div>
      </div>
    </footer>
  );
}
