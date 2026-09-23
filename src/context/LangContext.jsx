// src/context/LangContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { T } from '../data/translations';

const LangContext = createContext(null);

// Detect system preference on first load
function getInitialTheme() {
  const stored = localStorage.getItem('avigati-theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyThemeToDom(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

export function LangProvider({ children }) {
  const [lang,  setLang]  = useState(() => localStorage.getItem('avigati-lang') || 'fr');
  const [theme, setTheme] = useState(() => getInitialTheme());

  // Apply lang + dir
  const applyLang = (l) => {
    setLang(l);
    localStorage.setItem('avigati-lang', l);
    document.documentElement.lang = l;
    document.documentElement.dir  = l === 'ar' ? 'rtl' : 'ltr';
  };

  // Toggle dark / light
  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('avigati-theme', next);
      applyThemeToDom(next);
      return next;
    });
  };

  // Init on mount
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
    applyThemeToDom(theme);
  }, []);                               // eslint-disable-line react-hooks/exhaustive-deps

  const t = T[lang] || T.fr;

  return (
    <LangContext.Provider value={{ lang, applyLang, t, theme, toggleTheme }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
