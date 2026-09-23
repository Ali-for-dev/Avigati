// src/components/airplane/AirplaneShadow.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Cinematic airplane shadow.
// Draws a REAL top-down airplane silhouette on canvas (fuselage, swept wings,
// engines, stabilisers) then applies a heavy CSS blur for a soft atmospheric
// look. The mesh is a large plane angled toward the camera, driven by scroll.
// ─────────────────────────────────────────────────────────────────────────────
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Draw a recognisable top-down airplane silhouette ──────────────────────────
function buildSilhouetteTexture() {
  // Step 1 — sharp silhouette at high resolution
  const W = 1024, H = 1024;
  const sharp = document.createElement('canvas');
  sharp.width = W;
  sharp.height = H;
  const s = sharp.getContext('2d');

  const cx = W / 2;
  const cy = H / 2;

  // dark navy fill (not pure black — more atmospheric)
  s.fillStyle = 'rgba(0, 4, 30, 1)';

  // ── FUSELAGE ──────────────────────────────────────────────────────────────
  s.beginPath();
  s.moveTo(cx, cy - 330);                           // nose tip
  s.bezierCurveTo(cx - 17, cy - 295, cx - 21, cy - 240, cx - 21, cy - 100);
  s.lineTo(cx - 21, cy + 140);
  s.bezierCurveTo(cx - 21, cy + 240, cx - 12, cy + 310, cx, cy + 360);
  s.bezierCurveTo(cx + 12, cy + 310, cx + 21, cy + 240, cx + 21, cy + 140);
  s.lineTo(cx + 21, cy - 100);
  s.bezierCurveTo(cx + 21, cy - 240, cx + 17, cy - 295, cx, cy - 330);
  s.closePath();
  s.fill();

  // ── LEFT MAIN WING (swept back) ───────────────────────────────────────────
  s.beginPath();
  s.moveTo(cx - 21, cy - 60);    // root leading edge
  s.lineTo(cx - 420, cy + 110);  // tip leading edge
  s.lineTo(cx - 430, cy + 150);  // tip trailing edge
  s.lineTo(cx - 21, cy + 38);    // root trailing edge
  s.closePath();
  s.fill();

  // ── RIGHT MAIN WING ───────────────────────────────────────────────────────
  s.beginPath();
  s.moveTo(cx + 21, cy - 60);
  s.lineTo(cx + 420, cy + 110);
  s.lineTo(cx + 430, cy + 150);
  s.lineTo(cx + 21, cy + 38);
  s.closePath();
  s.fill();

  // ── LEFT ENGINE NACELLE ───────────────────────────────────────────────────
  s.beginPath();
  s.ellipse(cx - 165, cy + 28, 16, 46, -0.18, 0, Math.PI * 2);
  s.fill();

  // ── RIGHT ENGINE NACELLE ──────────────────────────────────────────────────
  s.beginPath();
  s.ellipse(cx + 165, cy + 28, 16, 46, 0.18, 0, Math.PI * 2);
  s.fill();

  // ── LEFT HORIZONTAL STABILISER ────────────────────────────────────────────
  s.beginPath();
  s.moveTo(cx - 21, cy + 225);
  s.lineTo(cx - 140, cy + 285);
  s.lineTo(cx - 136, cy + 315);
  s.lineTo(cx - 21, cy + 270);
  s.closePath();
  s.fill();

  // ── RIGHT HORIZONTAL STABILISER ──────────────────────────────────────────
  s.beginPath();
  s.moveTo(cx + 21, cy + 225);
  s.lineTo(cx + 140, cy + 285);
  s.lineTo(cx + 136, cy + 315);
  s.lineTo(cx + 21, cy + 270);
  s.closePath();
  s.fill();

  // ── WINGLETS (small angled tips) ─────────────────────────────────────────
  s.beginPath();
  s.ellipse(cx - 428, cy + 130, 8, 22, -0.3, 0, Math.PI * 2);
  s.fill();
  s.beginPath();
  s.ellipse(cx + 428, cy + 130, 8, 22, 0.3, 0, Math.PI * 2);
  s.fill();

  // Step 2 — apply atmospheric blur to the silhouette
  const blurred = document.createElement('canvas');
  blurred.width = W;
  blurred.height = H;
  const b = blurred.getContext('2d');

  // Draw the sharp silhouette with a heavy blur
  b.filter = 'blur(20px)';
  b.drawImage(sharp, 0, 0);

  // Step 3 — composite a sharp core on top (less blurred) for definition
  b.filter = 'blur(8px)';
  b.globalAlpha = 0.55;
  b.drawImage(sharp, 0, 0);
  b.globalAlpha = 1.0;

  return new THREE.CanvasTexture(blurred);
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AirplaneShadow({ scrollProgress }) {
  const meshRef = useRef();
  const matRef  = useRef();

  // Build once
  const texture = useMemo(() => buildSilhouetteTexture(), []);

  useFrame(() => {
    if (!meshRef.current || !matRef.current) return;
    const p = scrollProgress.current;

    // ── Y position: shadow starts well below viewport, rises upward ──
    // The shadow leads the airplane slightly (appears first)
    const y = -11 + p * 18;

    // ── Scale: shadow grows as the "plane" approaches overhead ───────
    const scale = 0.7 + p * 1.8;

    // ── Opacity curve ────────────────────────────────────────────────
    //   0 → 0.06 : barely peeking at bottom
    //   0.06 → 0.60 : builds up dramatically
    //   0.60 → 1.0  : gently fades as plane dominates
    let opacity;
    if (p < 0.06) {
      opacity = (p / 0.06) * 0.06;
    } else if (p < 0.6) {
      opacity = 0.06 + ((p - 0.06) / 0.54) * 0.44;
    } else {
      opacity = 0.50 - ((p - 0.6) / 0.4) * 0.18;
    }

    meshRef.current.position.y = y;
    meshRef.current.position.z = -2 + p * 5;
    meshRef.current.scale.setScalar(scale);
    matRef.current.opacity = Math.max(0, opacity);
  });

  return (
    <mesh
      ref={meshRef}
      // Tilt toward camera so the silhouette is clearly visible
      rotation={[-Math.PI * 0.42, 0, 0]}
      position={[0, -11, -2]}
    >
      {/* Large enough to feel enormous relative to the viewport */}
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial
        ref={matRef}
        map={texture}
        transparent
        opacity={0}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}
