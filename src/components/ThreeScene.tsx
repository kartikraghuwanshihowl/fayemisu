import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
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
  const { gl } = useThree();

  useEffect(() => {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath('/basis/');
    try { ktx2Loader.detectSupport(gl); } catch {}

    loader.setDRACOLoader(dracoLoader);
    loader.setKTX2Loader(ktx2Loader);

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
          Math.PI / 2,
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
      <Canvas gl={{ toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        
        {/* Lighting setup */}
        <ambientLight intensity={0.3} />
        <hemisphereLight args={["#ffffff", "#222222", 0.6]} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
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
        />
        
        {/* Subtle fog for depth */}
        <fog attach="fog" args={['#000000', 8, 20]} />
      </Canvas>
    </div>
  );
}