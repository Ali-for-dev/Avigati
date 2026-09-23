// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { useLang } from '../context/LangContext';
import './Navbar.css';

export default function Navbar() {
  const { lang, applyLang, t, theme, toggleTheme } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { href: '#services',     key: 'nav_services' },
    { href: '#projects',     key: 'nav_projects' },
    { href: '#testimonials', key: 'nav_test' },
    { href: '#contact',      key: 'nav_contact' },
  ];

  const isDark = theme === 'dark';

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <a
            href="/"
            className="nav-logo"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            AVIGATI<span className="logo-dot" />
          </a>

          <ul className="nav-links">
            {navLinks.map(({ href, key }) => (
              <li key={key}>
                <a href={href}>{t[key]}</a>
              </li>
            ))}
          </ul>

          <div className="nav-right">
            {/* ── Language switcher ── */}
            <div className="lang-sw">
              {['fr', 'en', 'ar'].map((l, i) => (
                <span key={l}>
                  {i > 0 && <span className="lang-sep">·</span>}
                  <button
                    className={`lang-btn ${lang === l ? 'active' : ''}`}
                    onClick={() => applyLang(l)}
                  >
                    {l.toUpperCase()}
                  </button>
                </span>
              ))}
            </div>

            {/* ── Theme toggle ── */}
            <button
              className="theme-btn"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Mode clair' : 'Mode sombre'}
            >
              {isDark ? '☀' : '☾'}
            </button>

            {/* ── Mobile hamburger ── */}
            <button
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
            >
              <span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`mob-overlay ${menuOpen ? 'open' : ''}`}>
        <nav className="mob-nav">
          {navLinks.map(({ href, key }) => (
            <a key={key} href={href} className="mob-link" onClick={closeMenu}>
              {t[key]}
            </a>
          ))}
        </nav>
        <div className="mob-bottom">
          <div className="mob-lang">
            {['fr', 'en', 'ar'].map((l) => (
              <button
                key={l}
                className={`lang-btn ${lang === l ? 'active' : ''}`}
                onClick={() => { applyLang(l); closeMenu(); }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            className="theme-btn"
            onClick={() => { toggleTheme(); closeMenu(); }}
            aria-label="Toggle theme"
          >
            {isDark ? '☀' : '☾'}
          </button>
        </div>
      </div>
    </>
  );
}
