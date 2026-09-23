// src/components/sections/Contact.jsx
import { useState } from 'react';
import { useLang } from '../../context/LangContext';
import { useReveal } from '../../hooks/useReveal';
import './Services.css';

export default function Contact() {
  const { t, lang } = useLang();
  const isRTL = lang === 'ar';
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const infoRef = useReveal(0);
  const formRef = useReveal(0.1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) { e.target.reportValidity(); return; }
    setLoading(true);
    setTimeout(() => { setSent(true); }, 1100);
  };

  // In RTL the arrow on the submit button points left
  const sendArrow = loading ? '…' : (isRTL ? '←' : '→');

  return (
    <section id="contact" className="section">
      <div className={`contact-grid ${isRTL ? 'rtl' : ''}`}>

        {/* ── Contact info ── */}
        <div className="contact-info" ref={infoRef}>
          <p className="eyebrow">{t.eyebrow_contact}</p>
          <h2>{t.contact_title}</h2>
          <p>{t.contact_body}</p>
          <dl className="contact-deets">
            <div className="deet">
              <dt>{t.lbl_email}</dt>
              <dd>
                <a href="mailto:avigati@outlook.com">avigati@outlook.com</a>
              </dd>
            </div>
            <div className="deet">
              <dt>{t.lbl_phone}</dt>
              <dd>
                <a href="tel:+33123456789">+33 1 23 45 67 89</a>
              </dd>
            </div>
            <div className="deet">
              <dt>{t.lbl_hq}</dt>
              <dd>
                <strong style={{
                  display: 'block',
                  color: '#F0F5FF',
                  fontWeight: 600,
                  marginBottom: 4,
                }}>
                  {t.hq_name}
                </strong>
                <span style={{ whiteSpace: 'pre-line', lineHeight: 1.75 }}>
                  {t.hq_loc}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* ── Form ── */}
        <form
          className="contact-form"
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          style={{ display: sent ? 'none' : undefined }}
        >
          <div className="form-duo">
            <div className="field">
              <label htmlFor="fName">{t.f_name}</label>
              <input
                id="fName" type="text" name="name"
                required autoComplete="name"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="field">
              <label htmlFor="fCompany">{t.f_company}</label>
              <input
                id="fCompany" type="text" name="company"
                autoComplete="organization"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="fEmail">{t.f_email}</label>
            {/* Email is always LTR regardless of UI direction */}
            <input
              id="fEmail" type="email" name="email"
              required autoComplete="email"
              dir="ltr"
              style={isRTL ? { textAlign: 'right' } : {}}
            />
          </div>

          <div className="field">
            <label htmlFor="fDomain">{t.f_domain}</label>
            <select id="fDomain" name="domain" dir={isRTL ? 'rtl' : 'ltr'}>
              <option value="">{t.f_select}</option>
              <option value="aviation">{t.f_avi}</option>
              <option value="atc">{t.f_atc}</option>
              <option value="telecom">{t.f_tel}</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="fMsg">{t.f_msg}</label>
            <textarea
              id="fMsg" name="message" rows={4}
              required
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Submit button — arrow flips in RTL */}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              opacity:    loading ? 0.55 : 1,
              /* In RTL, align button to the right naturally */
              alignSelf:  isRTL ? 'flex-end' : 'flex-start',
              flexDirection: isRTL ? 'row-reverse' : 'row',
            }}
          >
            <span>{t.f_send}</span>
            <span>{sendArrow}</span>
          </button>
        </form>

        {/* ── Success message ── */}
        {sent && (
          <div className="form-ok show">
            <span className="ok-mark">✓</span>
            <p>{t.f_ok}</p>
          </div>
        )}
      </div>
    </section>
  );
}
