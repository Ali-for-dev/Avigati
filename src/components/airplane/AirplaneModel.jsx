// src/components/airplane/AirplaneModel.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Procedural 3D airplane built from Three.js primitives via React Three Fiber.
//
// ⚡ TO REPLACE WITH A GLB MODEL:
//   1. Add your GLB file to /public/models/airplane.glb
//   2. Import: import { useGLTF } from '@react-three/drei'
//   3. Replace the JSX below with:
//      const { scene } = useGLTF('/models/airplane.glb')
//      return <primitive object={scene} />
//   4. useGLTF.preload('/models/airplane.glb')
// ─────────────────────────────────────────────────────────────────────────────
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Shared materials
const matBody = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#CCDDF5'),
  metalness: 0.55,
  roughness: 0.28,
  envMapIntensity: 1.2,
});
const matGold = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#C9A84C'),
  metalness: 0.75,
  roughness: 0.18,
});
const matEngine = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#1A2240'),
  metalness: 0.9,
  roughness: 0.2,
});
const matGlass = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#88AADD'),
  metalness: 0.2,
  roughness: 0.05,
  transparent: true,
  opacity: 0.65,
});

// ── Sub-components ────────────────────────────────────────────────────────────

function Engine({ position }) {
  return (
    <group position={position}>
      {/* Nacelle body */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.19, 1.4, 16]} />
        <primitive object={matEngine} attach="material" />
      </mesh>
      {/* Gold intake ring */}
      <mesh position={[0.75, 0, 0]}>
        <torusGeometry args={[0.22, 0.035, 10, 24]} />
        <primitive object={matGold} attach="material" />
      </mesh>
      {/* Nozzle */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[-0.85, 0, 0]}>
        <cylinderGeometry args={[0.14, 0.2, 0.25, 14]} />
        <primitive object={matEngine} attach="material" />
      </mesh>
    </group>
  );
}

function Wing({ side = 1 }) {
  // side: 1 = left (positive Z), -1 = right
  return (
    <group scale={[1, 1, side]}>
      {/* Inner wing root */}
      <mesh position={[-0.15, -0.06, 1.4]} rotation={[0, -0.08, 0.04]}>
        <boxGeometry args={[2.4, 0.1, 1.8]} />
        <primitive object={matBody} attach="material" />
      </mesh>
      {/* Mid wing */}
      <mesh position={[-0.45, -0.07, 2.8]} rotation={[0, -0.18, 0.06]}>
        <boxGeometry args={[1.8, 0.075, 1.2]} />
        <primitive object={matBody} attach="material" />
      </mesh>
      {/* Outer wing tip */}
      <mesh position={[-0.75, -0.04, 3.7]} rotation={[0, -0.28, 0.08]}>
        <boxGeometry args={[1.0, 0.055, 0.65]} />
        <primitive object={matBody} attach="material" />
      </mesh>
      {/* Winglet */}
      <mesh position={[-0.9, 0.22, 4.05]} rotation={[0, -0.3, -0.5]}>
        <boxGeometry args={[0.45, 0.5, 0.06]} />
        <primitive object={matBody} attach="material" />
      </mesh>
      {/* Gold trailing edge stripe */}
      <mesh position={[-0.6, -0.05, 2.2]} rotation={[0, -0.12, 0]}>
        <boxGeometry args={[2.5, 0.025, 0.15]} />
        <primitive object={matGold} attach="material" />
      </mesh>
    </group>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AirplaneModel({ scrollProgress }) {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const p = scrollProgress.current;

    // Subtle idle breathing only when nearly stationary
    const idleAmt = Math.max(0, 1 - p * 8);
    const idleY   = Math.sin(clock.elapsedTime * 0.6) * 0.04 * idleAmt;
    const idleZ   = Math.sin(clock.elapsedTime * 0.4) * 0.012 * idleAmt;

    // ── Position: emerge from below ─────────────────────────────────
    // progress 0 → airplane almost completely hidden below viewport
    // progress 1 → airplane near center/slightly above
    const eased = easeInOutQuart(p);

    groupRef.current.position.y = -14 + eased * 19 + idleY;
    groupRef.current.position.z = -4  + eased * 6;     // move toward camera
    groupRef.current.position.x = idleZ;

    // ── Rotation ─────────────────────────────────────────────────────
    // Nose pitched slightly down at start (ground attitude), levels off
    groupRef.current.rotation.x = 0.08 - eased * 0.12;

    // Very subtle banking (Z roll) — cinematic, not exaggerated
    groupRef.current.rotation.z = Math.sin(p * Math.PI) * 0.04;

    // ── Scale: feel enormous as it approaches ─────────────────────────
    const s = 0.78 + eased * 0.62;
    groupRef.current.scale.setScalar(s);
  });

  return (
    // ⚡ Replace <group> contents with <primitive object={scene} /> for GLB
    <group ref={groupRef} position={[0, -14, -4]} rotation={[0.08, Math.PI, 0]}>

      {/* ── Fuselage ── */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.36, 0.3, 8.5, 22]} />
        <primitive object={matBody} attach="material" />
      </mesh>

      {/* Nose cone */}
      <mesh rotation={[0, 0, -Math.PI / 2]} position={[4.8, 0, 0]}>
        <coneGeometry args={[0.36, 1.5, 22]} />
        <primitive object={matBody} attach="material" />
      </mesh>

      {/* Cockpit windows */}
      <mesh position={[3.2, 0.32, 0]}>
        <sphereGeometry args={[0.29, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <primitive object={matGlass} attach="material" />
      </mesh>

      {/* Gold fuselage stripe */}
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[8.5, 0.04, 0.22]} />
        <primitive object={matGold} attach="material" />
      </mesh>

      {/* Belly fairing */}
      <mesh position={[0, -0.28, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.16, 5, 12]} />
        <primitive object={matEngine} attach="material" />
      </mesh>

      {/* ── Main Wings ── */}
      <Wing side={1} />
      <Wing side={-1} />

      {/* ── Horizontal Stabilisers ── */}
      {[1, -1].map((s) => (
        <mesh key={s} position={[-3.8, 0.0, s * 0.95]} rotation={[0, s * -0.1, 0.03]}>
          <boxGeometry args={[1.5, 0.07, 1.6]} />
          <primitive object={matBody} attach="material" />
        </mesh>
      ))}

      {/* ── Vertical Tail Fin ── */}
      <mesh position={[-3.5, 0.75, 0]}>
        <boxGeometry args={[1.6, 1.4, 0.09]} />
        <primitive object={matBody} attach="material" />
      </mesh>
      {/* Gold tail stripe */}
      <mesh position={[-3.7, 0.42, 0]}>
        <boxGeometry args={[0.7, 0.04, 0.12]} />
        <primitive object={matGold} attach="material" />
      </mesh>

      {/* ── Engine Pods (under wings) ── */}
      <Engine position={[0.5, -0.45, 1.6]} />
      <Engine position={[0.5, -0.45, -1.6]} />

    </group>
  );
}

// Smooth ease for cinematic feel
function easeInOutQuart(t) {
  return t < 0.5
    ? 8 * t * t * t * t
    : 1 - Math.pow(-2 * t + 2, 4) / 2;
}
