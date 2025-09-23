import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function VinylModel({ isPlaying }: { isPlaying: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const [gltf, setGltf] = useState<any>(null);
  const rotationSpeed = useRef(0);

  useEffect(() => {
    const loader = new GLTFLoader();
    
    loader.load(
      '/models/vinyl.glb',
      (loadedGltf) => {
        console.log('Vinyl model loaded successfully');
        setGltf(loadedGltf);
      },
      (progress) => {
        console.log('Loading vinyl progress:', (progress.loaded / progress.total) * 100 + '%');
      },
      (error) => {
        console.error('Error loading vinyl model:', error);
      }
    );
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Floating animation
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;

    // Vinyl rotation based on play state
    if (isPlaying) {
      rotationSpeed.current = THREE.MathUtils.lerp(rotationSpeed.current, 0.05, 0.1);
    } else {
      rotationSpeed.current = THREE.MathUtils.lerp(rotationSpeed.current, 0, 0.05);
    }

    meshRef.current.rotation.y += rotationSpeed.current;
  });

  if (!gltf) {
    console.log('Vinyl GLTF not loaded yet');
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    );
  }

  console.log('Rendering vinyl model');
  return (
    <group ref={meshRef} scale={6.0}>
      <primitive object={gltf.scene} />
    </group>
  );
}

interface MusicSectionProps {
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export default function MusicSection({ onPlayStateChange }: MusicSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('');

  const playlists = [
    {
      name: 'Cinematic Sessions',
      artist: 'Kartik',
      cover: '/assets/sample-portrait.jpg',
      spotifyUrl: 'https://open.spotify.com/playlist/5uFOAitxMHf3sINYaV1s8l?si=SUbGWuJGTwSjS9_6_y6VQg',
    },
    {
      name: 'Behind the Lens',
      artist: 'Original Soundtrack',
      cover: '/assets/sample-landscape.jpg',
      spotifyUrl: 'https://open.spotify.com/playlist/5ScyGPT9yln8qiBVXidF6J?si=PCIz2LlCSDau3fdF9mKbig',
    },
  ];

  return (
    <section id="music" className="min-h-screen py-20 relative bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-6 dither-reveal">
            My <span className="text-accent">Playlist</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            I love sharing some of my playlists because music is a huge passion of mine, with favorite artists like Sweet Trip, TV Girl, Panchiko, Mazzy Star, and anything in the shoegaze genre.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* 3D Vinyl */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative h-96 w-full rounded-lg overflow-visible flex items-center justify-center"
            style={{ minHeight: '500px', minWidth: '500px' }}
          >
            <Canvas 
              gl={{ 
                toneMapping: THREE.ACESFilmicToneMapping, 
                outputColorSpace: THREE.SRGBColorSpace,
                alpha: true,
                antialias: true 
              }} 
              camera={{ position: [0, 0, 5], fov: 45 }}
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} intensity={1.2} />
              <pointLight position={[-10, -10, -10]} intensity={0.7} color="#ff0000" />
              <Environment preset="studio" />
              <VinylModel isPlaying={isPlaying} />
            </Canvas>
            
            {/* Vinyl glow effect when playing */}
            {isPlaying && (
              <div className="absolute inset-0 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
            )}
          </motion.div>

          {/* Music Controls & Playlists */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Audio Player Control */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Audio Player</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {currentTrack || 'Select a playlist to start'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isPlaying ? 'Now Playing' : 'Paused'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newPlayState = !isPlaying;
                      setIsPlaying(newPlayState);
                      onPlayStateChange?.(newPlayState);
                    }}
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                      isPlaying
                        ? 'border-accent bg-accent text-accent-foreground'
                        : 'border-muted-foreground hover:border-accent'
                    }`}
                  >
                    {isPlaying ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 5v10l7-5-7-5z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-muted rounded-full h-1">
                  <motion.div
                    className="bg-accent h-1 rounded-full"
                    animate={{ width: isPlaying ? '100%' : '0%' }}
                    transition={{ duration: isPlaying ? 180 : 0, ease: 'linear' }}
                  />
                </div>
              </div>
            </div>

            {/* Spotify Playlists */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Featured Playlists</h3>
              {playlists.map((playlist, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-lg p-4 hover:bg-secondary transition-colors cursor-pointer group"
                  onClick={() => {
                    setCurrentTrack(playlist.name);
                    setIsPlaying(true);
                    onPlayStateChange?.(true);
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={playlist.cover}
                      alt={playlist.name}
                      className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium group-hover:text-accent transition-colors">
                        {playlist.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">{playlist.artist}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a
                        href={playlist.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-accent transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.301.421-1.02.599-1.559.3z"/>
                        </svg>
                      </a>
                      <button className="text-muted-foreground hover:text-accent transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-4a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}