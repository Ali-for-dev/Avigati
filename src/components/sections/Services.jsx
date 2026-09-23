// src/components/sections/Services.jsx
import { useRef } from 'react';
import { useLang } from '../../context/LangContext';
import { useReveal } from '../../hooks/useReveal';
import './Services.css';

const SRV_BG = {
  avi: `repeating-linear-gradient(-5deg,transparent,transparent 12px,rgba(201,168,76,.12) 12px,rgba(201,168,76,.12) 13px)`,
  atc: `radial-gradient(ellipse at 80% 50%,rgba(0,255,120,.07) 0%,transparent 60%)`,
  tel: `repeating-linear-gradient(90deg,transparent,transparent 28px,rgba(100,160,255,.09) 28px,rgba(100,160,255,.09) 29px)`,
};

function ServiceRow({ num, name, desc, tags, bg, delay = 0 }) {
  const ref = useReveal(delay);
  return (
    <div className="srv-row js-reveal" ref={ref} tabIndex={0}>
      <span className="srv-num">{num}</span>
      <div className="srv-body">
        <h3>{name}</h3>
        <p>{desc}</p>
        <ul className="srv-tags">
          {tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      </div>
      <span className="srv-arrow" aria-hidden="true">→</span>
      <div className="srv-bg" style={{ background: bg }} aria-hidden="true" />
    </div>
  );
}

export default function Services() {
  const { t } = useLang();
  const headRef = useReveal(0);

  const rows = [
    { num: '01', name: t.srv1_name, desc: t.srv1_desc, tags: t.srv1_tags, bg: SRV_BG.avi },
    { num: '02', name: t.srv2_name, desc: t.srv2_desc, tags: t.srv2_tags, bg: SRV_BG.atc },
    { num: '03', name: t.srv3_name, desc: t.srv3_desc, tags: t.srv3_tags, bg: SRV_BG.tel },
  ];

  return (
    <section id="services" className="section">
      <header className="sec-head" ref={headRef}>
        <p className="eyebrow">{t.eyebrow_expertise}</p>
        <h2>{t.services_title}</h2>
      </header>
      <div className="services-list">
        {rows.map((r, i) => (
          <ServiceRow key={r.num} {...r} delay={i * 0.08} />
        ))}
      </div>
    </section>
  );
}
