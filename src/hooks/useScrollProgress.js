// src/hooks/useScrollProgress.js
// Returns a live scroll progress (0→1) normalized over the first N viewports.
// The 3D airplane animation uses the first `viewports` screen-heights of scroll.
import { useRef, useEffect } from 'react';

export function useScrollProgress(viewports = 3) {
  const rawProgress    = useRef(0);   // target (from scroll event)
  const smoothProgress = useRef(0);   // lerped value
  const rafId          = useRef(null);

  useEffect(() => {
    const maxScroll = window.innerHeight * viewports;

    const onScroll = () => {
      rawProgress.current = Math.min(window.scrollY / maxScroll, 1);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Lerp loop
    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      smoothProgress.current = lerp(smoothProgress.current, rawProgress.current, 0.06);
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [viewports]);

  return smoothProgress; // ref — read .current in R3F useFrame
}
