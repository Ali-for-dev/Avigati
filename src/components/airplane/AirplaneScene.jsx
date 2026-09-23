// src/components/airplane/AirplaneScene.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Fixed-position React Three Fiber canvas that renders the airplane + shadow.
// Position: fixed over entire viewport. Pointer-events: none so HTML scrolls.
// ─────────────────────────────────────────────────────────────────────────────
import { Canvas } from '@react-three/fiber';
// Note: <fog> is a native Three.js primitive in R3F — no import needed
import AirplaneModel from './AirplaneModel';
import AirplaneShadow from './AirplaneShadow';

export default function AirplaneScene({ scrollProgress }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          outputColorSpace: 'srgb',
        }}
        camera={{ fov: 42, near: 0.1, far: 200, position: [0, 2, 18] }}
        dpr={[1, 2]}                // responsive pixel ratio
        style={{ background: 'transparent' }}
      >
        {/* Subtle atmospheric fog — adds depth without clogging the scene */}
        <fog attach="fog" args={['#07090F', 28, 80]} />

        {/* ── Lighting ── */}
        {/* Soft ambient — no harsh shadows */}
        <ambientLight intensity={0.3} color="#AABBDD" />

        {/* Warm key light (gold tones from front-right) */}
        <directionalLight
          intensity={2.8}
          color="#E8C878"
          position={[8, 12, 10]}
        />

        {/* Cool rim light from behind */}
        <directionalLight
          intensity={0.9}
          color="#4466BB"
          position={[-10, -3, -8]}
        />

        {/* Subtle fill from below */}
        <pointLight
          intensity={1.4}
          color="#C9A84C"
          position={[2, 5, 10]}
          distance={35}
        />

        {/* Hemisphere light gives ambient sky/ground color to materials */}
        {/* sky: deep blue, ground: near-black — premium cinematic look */}
        <hemisphereLight args={['#1A2A4A', '#040608', 0.6]} />

        {/* ── The shadow — this is the HERO effect ── */}
        <AirplaneShadow scrollProgress={scrollProgress} />

        {/* ── The airplane model ── */}
        <AirplaneModel scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
