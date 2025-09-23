import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  url: string;
  scrollY: number;
  inPortfolio: boolean;
  scale?: number;
  isPlaying?: boolean;
}

function Model({ url, scrollY, inPortfolio, scale = 1, isPlaying = false }: ModelProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [gltf, setGltf] = useState<any>(null);
  const [normalizedScale, setNormalizedScale] = useState<number>(scale);

  useEffect(() => {
    const loader = new GLTFLoader();
    console.info('Loading GLTF:', url);
    loader.load(
      url,
      (loadedGltf) => {
        // Enable shadows and compute normalized scale
        loadedGltf.scene.traverse((obj: any) => {
          if (obj.isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });

        // Center and normalize to a consistent size so it is always visible
        const box = new THREE.Box3().setFromObject(loadedGltf.scene);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        // Recenter the model around origin
        loadedGltf.scene.position.sub(center);

        // Largest axis determines scale factor
        const maxAxis = Math.max(size.x, size.y, size.z) || 1;
        const targetSize = 2.0; // world units to fit nicely in the camera view
        const fitScale = (targetSize / maxAxis) * scale;
        setNormalizedScale(fitScale);

        setGltf(loadedGltf);
        console.info('GLTF loaded successfully:', url, { size, center, fitScale });
      },
      undefined,
      (error) => {
        console.error('Error loading GLTF:', error);
      }
    );
  }, [url, scale]);

  useFrame((state) => {
    if (!meshRef.current) return;

    if (inPortfolio) {
      // Lock to facing right position
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        Math.PI / 2,
        0.08
      );
    } else if (url.includes('vinyl') && isPlaying) {
      // Continuous rotation for vinyl when playing
      meshRef.current.rotation.y += 0.02;
    } else if (url.includes('vinyl') && !isPlaying) {
      // Gradual stop for vinyl when not playing
      const targetRotation = Math.round(meshRef.current.rotation.y / (Math.PI * 2)) * Math.PI * 2;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation,
        0.02
      );
    } else {
      // Scroll-based rotation for other models
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
    <group ref={meshRef} scale={normalizedScale}>
      <primitive object={gltf.scene} />
    </group>
  );
}

interface ThreeSceneProps {
  scrollY: number;
  inPortfolio: boolean;
  currentModel: string;
  isPlaying?: boolean;
}

export default function ThreeScene({ scrollY, inPortfolio, currentModel, isPlaying = false }: ThreeSceneProps) {
  // Don't render if no model is specified (e.g., in music section)
  if (!currentModel) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas gl={{ toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        
        {/* Lighting setup */}
        <ambientLight intensity={0.5} />
        <hemisphereLight args={["#ffffff", "#222222", 0.7]} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Environment for reflections */}
        <Environment preset="city" background={false} />
        
        {/* Main 3D Model */}
        <Model
          url={currentModel}
          scrollY={scrollY}
          inPortfolio={inPortfolio}
          scale={1.5}
          isPlaying={isPlaying}
        />
        
        {/* Subtle fog for depth */}
        <fog attach="fog" args={["#000000", 8, 20]} />
      </Canvas>
    </div>
  );
}
