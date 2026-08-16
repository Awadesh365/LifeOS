import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface HeroSceneProps {
  reducedMotion: boolean;
}

function OrbitalSystem({ reducedMotion }: HeroSceneProps) {
  const system = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const stars = useMemo(() => {
    const positions = new Float32Array(180 * 3);
    for (let index = 0; index < 180; index += 1) {
      const radius = 3.2 + Math.random() * 3.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (!system.current || !core.current || reducedMotion) return;
    system.current.rotation.y += delta * 0.09;
    system.current.rotation.x = THREE.MathUtils.lerp(
      system.current.rotation.x,
      state.pointer.y * 0.12,
      0.035,
    );
    system.current.rotation.z = THREE.MathUtils.lerp(
      system.current.rotation.z,
      -state.pointer.x * 0.08,
      0.035,
    );
    core.current.rotation.x += delta * 0.13;
    core.current.rotation.y -= delta * 0.18;
  });

  return (
    <group ref={system} rotation={[0.15, -0.35, -0.08]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#8fa4bd" size={0.027} transparent opacity={0.55} sizeAttenuation />
      </points>

      <mesh ref={core}>
        <icosahedronGeometry args={[1.12, 5]} />
        <meshPhysicalMaterial
          color="#e45a5a"
          emissive="#641f29"
          emissiveIntensity={0.42}
          metalness={0.42}
          roughness={0.22}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
        />
      </mesh>

      <mesh scale={1.23}>
        <icosahedronGeometry args={[1.12, 2]} />
        <meshBasicMaterial color="#ff9797" wireframe transparent opacity={0.1} />
      </mesh>

      <mesh rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[2.05, 0.012, 8, 180]} />
        <meshBasicMaterial color="#91a2b8" transparent opacity={0.42} />
      </mesh>
      <mesh rotation={[1.15, -0.65, 0.55]}>
        <torusGeometry args={[2.68, 0.009, 8, 180]} />
        <meshBasicMaterial color="#60748c" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[0.45, 0.35, 1.1]}>
        <torusGeometry args={[3.18, 0.007, 8, 180]} />
        <meshBasicMaterial color="#60748c" transparent opacity={0.2} />
      </mesh>

      {[
        { position: [1.72, 0.65, 0.95] as const, color: '#f5c86b', size: 0.18 },
        { position: [-2.08, -0.35, 0.6] as const, color: '#79b89b', size: 0.22 },
        { position: [0.2, -2.43, -1.05] as const, color: '#7ba7d9', size: 0.14 },
        { position: [-0.8, 2.75, -0.25] as const, color: '#df8fb8', size: 0.12 },
      ].map((node) => (
        <group position={node.position} key={node.color}>
          <mesh>
            <sphereGeometry args={[node.size, 28, 28]} />
            <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.22} />
          </mesh>
          <pointLight color={node.color} intensity={1.1} distance={1.8} />
        </group>
      ))}
    </group>
  );
}

function SceneFallback() {
  return (
    <div className="home-scene-fallback" role="img" aria-label="LifeOS orbital system">
      <span />
      <i />
      <i />
    </div>
  );
}

export default function HeroScene({ reducedMotion }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.4], fov: 38, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      frameloop={reducedMotion ? 'demand' : 'always'}
      fallback={<SceneFallback />}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      performance={{ min: 0.5 }}
    >
      <ambientLight intensity={0.6} color="#d9e5f3" />
      <directionalLight position={[4, 5, 6]} intensity={3.2} color="#fff5ef" />
      <pointLight position={[-4, -2, 3]} intensity={12} distance={10} color="#e55555" />
      <OrbitalSystem reducedMotion={reducedMotion} />
    </Canvas>
  );
}
