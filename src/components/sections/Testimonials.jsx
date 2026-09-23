// src/components/sections/Testimonials.jsx
import { useState, useEffect, useCallback } from 'react';
import { useLang } from '../../context/LangContext';
import { useReveal } from '../../hooks/useReveal';
import './Services.css';

export default function Testimonials() {
  const { t, lang } = useLang();
  const isRTL = lang === 'ar';
  const [cur, setCur] = useState(0);
  const total = t.testimonials.length;
  const headRef  = useReveal(0);
  const stageRef = useReveal(0.1);

  const go = useCallback((idx) => {
    setCur(((idx % total) + total) % total);
  }, [total]);

  // Reset to first slide when language changes
  useEffect(() => { setCur(0); }, [lang]);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => go(cur + 1), 7000);
    return () => clearInterval(timer);
  }, [cur, go]);

  // In RTL: ← means "next" (forward in reading direction), → means "prev"
  const prevArrow = isRTL ? '→' : '←';
  const nextArrow = isRTL ? '←' : '→';

  return (
    <section id="testimonials" className="section">
      <header className="sec-head" ref={headRef}>
        <p className="eyebrow">{t.eyebrow_test}</p>
        <h2>{t.test_title}</h2>
      </header>

      <div className={`test-stage ${isRTL ? 'rtl' : ''}`} ref={stageRef}>
        <div className="test-track">
          {t.testimonials.map((test, i) => (
            <div key={i} className={`test-slide ${i === cur ? 'active' : ''}`}>
              <blockquote>
                {/* Use Arabic-style quotation marks in AR, standard in others */}
                <p>{isRTL ? `«${test.quote}»` : `"${test.quote}"`}</p>
              </blockquote>
              <cite>
                <strong>{test.name}</strong>
                <span>{test.role}</span>
              </cite>
            </div>
          ))}
        </div>

        <div className="test-controls">
          <button
            className="test-btn"
            onClick={() => go(cur - 1)}
            aria-label={isRTL ? 'التالي' : 'Previous'}
          >
            {prevArrow}
          </button>

          <div className="test-bar">
            <div
              className="test-fill"
              style={{
                width: `${((cur + 1) / total) * 100}%`,
                // In RTL the bar fills from the right
                ...(isRTL ? { right: 0, left: 'auto' } : {}),
              }}
            />
          </div>

          <span className="test-count">
            <span className="cur">{String(cur + 1).padStart(2, '0')}</span>
            {' / '}
            {String(total).padStart(2, '0')}
          </span>

          <button
            className="test-btn"
            onClick={() => go(cur + 1)}
            aria-label={isRTL ? 'السابق' : 'Next'}
          >
            {nextArrow}
          </button>
        </div>
      </div>
    </section>
  );
}
