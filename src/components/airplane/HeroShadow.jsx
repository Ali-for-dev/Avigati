// src/components/airplane/HeroShadow.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Real Airbus A320 top-down silhouette (GPL v3 — RexKramer1/AircraftShapesSVG)
// Path is a genuine closed SVG path — filled solid = proper flat shadow look.
//
// Scroll behaviour:
//   progress 0   → below viewport, barely visible
//   progress 0.1 → clearly present, scale growing
//   progress 0.5 → full presence, centred in hero
//   progress 1   → rising above viewport, fading but not gone
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react';

// ── Real A320 silhouette path — genuine aircraft geometry ─────────────────────
// Source: RexKramer1/AircraftShapesSVG  (GPL v3)
// viewBox: -23 -21 80 80
// The path is a single closed outline of the full aircraft top view.
// With fill applied it becomes a perfect shadow silhouette.
const A320_PATH = `
  m 17.10525,0.06681738
  -0.902035,0.73499118 -0.968852,2.50565184 -0.167044,1.4365737
  -0.03341,7.0826419 -0.26727,1.302939 -2.605878,1.236122
  0.06682,-0.935443 -0.0167,-1.670435 -0.133635,-0.267269
  -1.670435,-0.01671 -0.200452,0.200452 -0.0167,2.238382
  0.167043,0.918739 0.233861,0.367496
  -9.92238106,5.128234 -0.36749561,0.434313 -0.25056518,0.684878
  0.01670434,1.369756 0.13363476,0.0167 0.0668174,-0.701583
  4.49346885,-1.403165 0.1837478,0.551244 0.1670434,1e-6
  0.066818,-0.584652 3.2239386,-1.119191 0.1837478,0.517835
  0.1670433,-1e-6 0.1336344,-0.618061 1.7038432,-0.534539
  1.403165,0.0167 0.08352,0.467722 0.167043,0.01671
  0.08352,-0.484427 2.655991,0.01671
  0.03341,9.153982 0.283974,1.954408 0.434313,2.021224
  -0.183748,0.317383 -4.426651,2.856445 -0.26727,0.400904
  0.01671,1.035669 5.328686,-1.18601 0.317383,1.152601
  0.417609,0.885331 0.267269,0.01669 0.379656,-0.846045
  0.30033,-1.204534 5.433805,1.198658 -0.01671,-1.002261
  -0.250565,-0.451016 -4.476765,-2.873148 -0.183748,-0.367495
  0.3842,-1.987818 0.317383,-1.920999 -0.0167,-9.18739
  2.65599,-0.03341 0.15034,0.551243 h 0.150339
  l 0.100226,-0.50113 1.286234,-0.05011 1.787365,0.551243
  0.06682,0.584652 0.217157,-3e-6 0.11693,-0.467721
  3.240644,1.00226 0.100227,0.668174 0.23386,0.0167
  0.133635,-0.567947 4.526878,1.38646 0.100224,0.65147
  0.150339,-0.0167 -0.06681,-1.503392 -0.317384,-0.651469
  -0.400904,-0.3842 -9.822155,-4.994599
  c 0.07965,-0.247814 0.334087,-0.367497 0.334087,-0.367497
  l 0.03341,-3.006782 -0.267269,-0.300678 -1.570209,0.03341
  -0.200452,0.23386 10e-7,1.904296 0.150339,0.734991
  -2.622582,-1.386461 -0.334087,-1.336347 0.0167,-7.0826429
  -0.283974,-1.2862345 -0.835217,-2.62258215
  z
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }

// ─────────────────────────────────────────────────────────────────────────────

export default function HeroShadow() {
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let target  = 0;
    let current = 0;
    let raf;

    // 300vh scroll stage → 200vh of animation (2× innerHeight)
    const getMax = () => window.innerHeight * 2;

    const onScroll = () => {
      target = clamp(window.scrollY / getMax(), 0, 1);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    const tick = () => {
      current = lerp(current, target, 0.058);
      const p = current;

      // ── Vertical: +90vh → −80vh ─────────────────────────────────────────
      const ty = 90 - p * 170;

      // ── Scale: 0.82 → 1.06 ──────────────────────────────────────────────
      const sc = 0.82 + p * 0.24;

      // ── Opacity — clearly visible during scroll ───────────────────────────
      //   0    → 0.08 : instant fade-in as soon as user scrolls
      //   0.08 → 0.70 : ramps up to 0.58 (well defined silhouette)
      //   0.70 → 1.0  : gentle fade to 0.18 (stays visible at top)
      let op;
      if (p < 0.08) {
        op = (p / 0.08) * 0.18;                          // 0 → 0.18
      } else if (p < 0.70) {
        op = 0.18 + ((p - 0.08) / 0.62) * 0.40;         // 0.18 → 0.58
      } else {
        op = 0.58 - ((p - 0.70) / 0.30) * 0.40;         // 0.58 → 0.18
      }

      wrap.style.transform =
        `translate(-50%, calc(-50% + ${ty.toFixed(2)}vh)) scale(${sc.toFixed(4)})`;
      wrap.style.opacity = Math.max(0, op).toFixed(4);

      // Adapt shadow colour to current theme — read live so it reacts instantly
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const svg = wrap.querySelector('path');
      if (svg) svg.setAttribute('fill', isLight ? '#002266' : '#FFFFFF');

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position:      'absolute',
        left:          '50%',
        top:           '50%',
        transform:     'translate(-50%, calc(-50% + 90vh)) scale(0.82)',
        width:         'clamp(700px, 115vw, 1500px)',
        opacity:       0,
        zIndex:        2,
        pointerEvents: 'none',
        willChange:    'transform, opacity',
        filter:        'blur(1.2px)',
      }}
    >
      <svg
        viewBox="-23 -21 80 80"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        {/*
          Real A320 silhouette — filled solid.
          fill="none" → solid silhouette shadow effect.
          No stroke — clean flat shadow, no outline.
        */}
        <path
          d={A320_PATH}
          fill="#FFFFFF"
          stroke="none"
        />
      </svg>
    </div>
  );
}
