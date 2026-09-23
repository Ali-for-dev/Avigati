// src/hooks/useReveal.js
// IntersectionObserver-based reveal hook.
// Returns a ref to attach to any element; adds .visible class when in view.
import { useRef, useEffect } from 'react';

export function useReveal(delay = 0) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return ref;
}
