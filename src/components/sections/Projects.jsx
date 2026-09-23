// src/components/sections/Projects.jsx
import { useRef, useEffect } from 'react';
import { useLang } from '../../context/LangContext';
import { useReveal } from '../../hooks/useReveal';
import './Services.css';

// Photo backgrounds — will show once images are generated
// Fallback: CSS gradient if image fails to load
const PHOTOS = [
  '/proj_aviation.jpg',
  '/proj_atc.jpg',
  '/proj_telecom.jpg',
  '/proj_maint.jpg',
];

const FALLBACK_BG = [
  `linear-gradient(155deg,#0a1832 0%,#091528 60%,#040c1a 100%)`,
  `radial-gradient(ellipse at 30% 60%,rgba(0,55,28,.9) 0%,#040c0a 70%)`,
  `linear-gradient(135deg,#10082a 0%,#060412 100%)`,
  `linear-gradient(135deg,#0a1020 0%,#060c18 100%)`,
];

function ProjectCard({ project, index, isLarge }) {
  const ref   = useRef(null);
  const bgRef = useRef(null);

  // Reveal animation
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const delay = index * 0.1;
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  // Try loading photo, fallback to gradient
  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;
    const img = new Image();
    img.onload = () => {
      bg.style.backgroundImage = `url(${PHOTOS[index]})`;
      bg.style.backgroundSize  = 'cover';
      bg.style.backgroundPosition = 'center';
    };
    img.onerror = () => {
      bg.style.background = FALLBACK_BG[index];
    };
    img.src = PHOTOS[index];
  }, [index]);

  return (
    <article className={`proj-card ${isLarge ? 'large' : ''}`} ref={ref}>
      {/* Overlay: dark gradient so the photo doesn't clash with text */}
      <div
        ref={bgRef}
        className="proj-bg"
        style={{ background: FALLBACK_BG[index] }}
      />
      {/* Dark scrim on top of photo for legibility */}
      <div className="proj-scrim" />
      <div className="proj-info">
        <span className="proj-sector">{project.sector}</span>
        <h3>{project.title}</h3>
        <p>{project.desc}</p>
      </div>
    </article>
  );
}

export default function Projects() {
  const { t } = useLang();
  const headRef = useReveal(0);

  return (
    <section id="projects" className="section">
      <header className="sec-head" ref={headRef}>
        <p className="eyebrow">{t.eyebrow_refs}</p>
        <h2>{t.projects_title}</h2>
      </header>
      <div className="proj-mosaic">
        {t.projects.map((proj, i) => (
          <ProjectCard key={i} project={proj} index={i} isLarge={i === 0} />
        ))}
      </div>
    </section>
  );
}
