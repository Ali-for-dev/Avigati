// src/App.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Root layout.
//
// Hero section is a 300vh scroll stage — the hero content is sticky so it
// stays on screen while the user scrolls through the extra 200vh, which
// drives the HeroShadow animation (scroll-linked SVG translateY, no WebGL).
//
// Content sections (z-index 10) slide over the hero naturally.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';
import HeroShadow from './components/airplane/HeroShadow';
import Navbar from './components/Navbar';
import Services from './components/sections/Services';
import Projects from './components/sections/Projects';
import Testimonials from './components/sections/Testimonials';
import Contact from './components/sections/Contact';
import Footer from './components/Footer';
import { useLang } from './context/LangContext';
import './index.css';

// ── Animated counter on IntersectionObserver ──────────────────────────────────
function useCounter(ref, target, duration = 1800) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();

      let start = 0;
      const step = 16;
      const inc  = target / (duration / step);
      const timer = setInterval(() => {
        start = Math.min(start + inc, target);
        el.textContent = Math.floor(start);
        if (start >= target) clearInterval(timer);
      }, step);
    }, { threshold: 0.5 });

    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
}

// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  const { t } = useLang();

  // Stat counter refs
  const n1 = useRef(); useCounter(n1, 15);
  const n2 = useRef(); useCounter(n2, 200);
  const n3 = useRef(); useCounter(n3, 40);

  return (
    <>
      {/* ── Navbar (always on top) ── */}
      <Navbar />

      {/* ══════════════════════════════════════════════════════════════
          SCROLL STAGE  — 300vh
          ┌─────────────────────────────────────────────────────────┐
          │  Sticky hero (100vh)                                    │
          │    ├─ hero-grid         (decorative lines, z:2)         │
          │    ├─ HeroShadow SVG    (scroll-driven silhouette, z:3) │
          │    ├─ hero-text-layer   (title + CTA, z:5)              │
          │    └─ stats-bar         (bottom bar, z:5)               │
          └─────────────────────────────────────────────────────────┘
          While the user scrolls through the extra 200vh,
          the sticky hero stays pinned, HeroShadow rises smoothly.
      ══════════════════════════════════════════════════════════════ */}
      <div id="scroll-stage">
        <div id="hero-sticky">

          {/* Subtle technical grid — not bubbles */}
          <div className="hero-grid" aria-hidden="true" />

          {/* ── SVG airplane shadow (rises on scroll) ── */}
          <HeroShadow />

          {/* ── Hero text (always readable above the shadow) ── */}
          <div className="hero-text-layer">
            <div className="hero-left">
              <p className="hero-eyebrow">{t.hero_eyebrow}</p>

              {/* Hook headline — tells WHAT we do */}
              <h1
                className="hero-headline"
                dangerouslySetInnerHTML={{ __html: t.hero_headline }}
              />

              {/* Wordmark under the hook */}
              <p className="hero-wordmark" aria-label="Avigati">{t.hero_title}</p>

              <div className="hero-rule" />
              <p className="hero-sub">{t.hero_sub}</p>
              <div className="hero-actions">
                <a href="#services" className="btn-primary">
                  <span>{t.cta_services}</span>
                  <span>→</span>
                </a>
                <a href="#contact" className="btn-ghost">
                  <span>{t.cta_contact}</span>
                </a>
              </div>
            </div>
          </div>

          {/* ── Stats bar (bottom of hero) ── */}
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-val">
                <span className="stat-num" ref={n1}>0</span>
                <span className="stat-plus">+</span>
              </span>
              <span className="stat-label">{t.stat_years}</span>
            </div>
            <div className="stat-sep" />
            <div className="stat">
              <span className="stat-val">
                <span className="stat-num" ref={n2}>0</span>
                <span className="stat-plus">+</span>
              </span>
              <span className="stat-label">{t.stat_projects}</span>
            </div>
            <div className="stat-sep" />
            <div className="stat">
              <span className="stat-val">
                <span className="stat-num" ref={n3}>0</span>
                <span className="stat-plus">+</span>
              </span>
              <span className="stat-label">{t.stat_countries}</span>
            </div>
          </div>

          {/* ── Scroll cue ── */}
          <div className="scroll-cue" aria-hidden="true">
            <div className="scroll-track">
              <div className="scroll-thumb" />
            </div>
            <span>{t.scroll_hint}</span>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          CONTENT SECTIONS
          Solid dark backgrounds (z-index 10) scroll over the hero.
      ══════════════════════════════════════════════════════════════ */}
      <main style={{ position: 'relative', zIndex: 10 }}>
        <Services />
        <Projects />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
