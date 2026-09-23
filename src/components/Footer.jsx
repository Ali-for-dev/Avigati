// src/components/Footer.jsx
import { useLang } from '../context/LangContext';
import './Footer.css';

export default function Footer() {
  const { t } = useLang();

  const links = [
    { href: '#services',     key: 'nav_services' },
    { href: '#projects',     key: 'nav_projects' },
    { href: '#testimonials', key: 'nav_test' },
    { href: '#contact',      key: 'nav_contact' },
  ];

  return (
    <footer id="footer">
      <div className="footer-wrap">
        <div className="footer-brand">
          <span className="footer-logo">AVIGATI<span className="logo-dot" /></span>
          <p>{t.footer_tag}</p>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          {links.map(({ href, key }) => (
            <a key={key} href={href}>{t[key]}</a>
          ))}
        </nav>
        <div className="footer-legal">
          <span>{t.footer_copy}</span>
          <div className="legal-links">
            <a href="#">{t.footer_legal}</a>
            <a href="#">{t.footer_privacy}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
