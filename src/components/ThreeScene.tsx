import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  url: string;
  scrollY: number;
  inPortfolio: boolean;
  scale?: number;
}

function Model({ url, scrollY, inPortfolio, scale = 1 }: ModelProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [gltf, setGltf] = useState<any>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      url,
      (loadedGltf) => {
        setGltf(loadedGltf);
      },
      undefined,
      (error) => {
        console.error('Error loading GLTF:', error);
      }
    );
  }, [url]);

  useFrame((state) => {
    if (!meshRef.current) return;

    if (inPortfolio) {
      // Lock to facing right position
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        Math.PI * 0.25,
        0.08
      );
    } else {
      // Scroll-based rotation
      const targetRotation = scrollY * 0.002;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation,
        0.05
      );
    }

    // Gentle floating animation
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  if (!gltf) return null;

  return (
    <group ref={meshRef} scale={scale}>
      <primitive object={gltf.scene} />
    </group>
  );
}

interface ThreeSceneProps {
  scrollY: number;
  inPortfolio: boolean;
  currentModel: string;
}

export default function ThreeScene({ scrollY, inPortfolio, currentModel }: ThreeSceneProps) {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        
        {/* Lighting setup */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff0000" />
        
        {/* Environment for reflections */}
        <Environment preset="city" />
        
        {/* Main 3D Model */}
        <Model
          url={currentModel}
          scrollY={scrollY}
          inPortfolio={inPortfolio}
          scale={1.5}
        />
        
        {/* Subtle fog for depth */}
        <fog attach="fog" args={['#000000', 8, 20]} />
      </Canvas>
    </div>
  );
}