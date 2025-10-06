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
  const vinylSpeed = useRef(0);

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

    // Real vinyl record physics - 33⅓ RPM ≈ 0.0349 radians per frame at 60fps
    const targetRPM = 0.0349; // 33⅓ RPM equivalent
    const targetSpeed = isPlaying ? targetRPM : 0;
    
    // Smooth acceleration when starting, quicker deceleration when stopping
    const acceleration = isPlaying ? 0.0018 : 0.004; // Slightly faster spin-up, faster spin-down
    
    // Gradually change speed using easing
    vinylSpeed.current = THREE.MathUtils.lerp(vinylSpeed.current, targetSpeed, acceleration);
    
    // Subtle micro jitter for organic feel (only when playing and at speed)
    const isAtSpeed = Math.abs(vinylSpeed.current - targetRPM) < 0.002;
    const microJitter = (isPlaying && isAtSpeed) ? (Math.random() - 0.5) * 0.00008 : 0;
    
    // Apply rotation ONLY on Y-axis - lock X and Z to 0 at all times
    meshRef.current.rotation.y += vinylSpeed.current + microJitter;
    meshRef.current.rotation.x = 0; // Always flat
    meshRef.current.rotation.z = 0; // Always flat
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
    <group ref={meshRef} scale={10.0} position={[0, 0, 0]}>
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
  const [currentUri, setCurrentUri] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const spotifyApiRef = useRef<any>(null);
  const spotifyControllerRef = useRef<any>(null);
  // Stable host managed by React; we mount Spotify into a child element that React does NOT own
  const spotifyHostRef = useRef<HTMLDivElement | null>(null);
  const spotifyMountRef = useRef<HTMLDivElement | null>(null);
  const controllerReadyRef = useRef(false);

  // Load Spotify IFrame API once
  useEffect(() => {
    const existing = document.querySelector('script[src="https://open.spotify.com/embed/iframe-api/v1"]') as HTMLScriptElement | null;
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://open.spotify.com/embed/iframe-api/v1';
      script.async = true;
      script.onload = () => {
        console.log('Spotify API script loaded');
      };
      script.onerror = () => {
        console.error('Failed to load Spotify API script');
        setError('Failed to load Spotify player');
      };
      document.body.appendChild(script);
    }

    // @ts-ignore - Spotify attaches this callback globally
    (window as any).onSpotifyIframeApiReady = (IFrameAPI: any) => {
      console.log('Spotify API ready');
      spotifyApiRef.current = IFrameAPI;
      setError(null);
      // If a URI is already chosen, render immediately
      if (currentUri && spotifyHostRef.current) {
        renderSpotify(currentUri);
      }
    };
  }, []);

  // Render or update Spotify player when URI changes
  useEffect(() => {
    if (currentUri && spotifyApiRef.current && spotifyHostRef.current) {
      console.log('Rendering Spotify player for URI:', currentUri);
      renderSpotify(currentUri);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUri]);

  const renderSpotify = (uri: string) => {
    if (!spotifyApiRef.current || !spotifyHostRef.current) {
      console.warn('Spotify API or container not ready');
      return;
    }

    setIsLoading(true);
    setError(null);
    controllerReadyRef.current = false;

    // Recreate a fresh mount node INSIDE a stable host node React controls
    try {
      if (spotifyMountRef.current && spotifyMountRef.current.parentNode === spotifyHostRef.current) {
        spotifyHostRef.current.removeChild(spotifyMountRef.current);
      }
    } catch {}
    const mountEl = document.createElement('div');
    mountEl.style.width = '100%';
    mountEl.style.height = '152px';
    spotifyHostRef.current.appendChild(mountEl);
    spotifyMountRef.current = mountEl;

    try {
      spotifyApiRef.current.createController(
        mountEl,
        { 
          uri,
          width: '100%',
          height: '152',
          theme: 'dark'
        },
        (controller: any) => {
          console.log('Spotify controller created for:', uri);
          spotifyControllerRef.current = controller;
          controllerReadyRef.current = true;

          // Listen for playback state updates from Spotify and keep UI in sync
          try {
            controller.addListener?.('playback_update', (event: any) => {
              console.log('Playback update:', event);
              const isPaused = event?.data?.isPaused ?? event?.data?.is_paused;
              if (typeof isPaused === 'boolean') {
                console.log('Setting isPlaying to:', !isPaused);
                setIsPlaying(!isPaused);
                onPlayStateChange?.(!isPaused);
              }
            });

            controller.addListener?.('playback_state_changed', (event: any) => {
              console.log('Playback state changed:', event);
              const isPaused = event?.data?.isPaused ?? event?.data?.is_paused;
              if (typeof isPaused === 'boolean') {
                console.log('Setting isPlaying to:', !isPaused);
                setIsPlaying(!isPaused);
                onPlayStateChange?.(!isPaused);
              }
            });

            controller.addListener?.('ready', () => {
              console.log('Controller ready, attempting to sync state');
              setIsLoading(false);
              // Controller is ready, attempt to sync initial state
              try {
                if (isPlaying) {
                  console.log('Auto-playing after controller ready');
                  controller.play();
                } else {
                  controller.pause();
                }
              } catch (e) {
                console.warn('Failed to sync initial playback state:', e);
              }
            });

            controller.addListener?.('initialization_error', (event: any) => {
              console.error('Spotify controller initialization error:', event);
              setError('Failed to initialize Spotify player');
              setIsLoading(false);
            });

          } catch (e) {
            console.warn('Failed to add Spotify listeners:', e);
            setError('Failed to set up Spotify player listeners');
            setIsLoading(false);
          }
        }
      );
    } catch (e) {
      console.error('Failed to create Spotify controller:', e);
      setError('Failed to create Spotify player');
      setIsLoading(false);
    }
  };

  const playlists = [
    {
      name: 'womp womp',
      artist: 'Kartik',
      cover: '/assets/womp.jpg',
      spotifyUrl: 'https://open.spotify.com/playlist/5uFOAitxMHf3sINYaV1s8l?si=h6kYxPvCShOae8mVZlkgiw',
      uri: 'spotify:playlist:5uFOAitxMHf3sINYaV1s8l'
    },
    {
      name: 'cope up',
      artist: '',
      cover: '/assets/howl.jpg',
      spotifyUrl: 'https://open.spotify.com/playlist/5ScyGPT9yln8qiBVXidF6J?si=jfgfXDr5TJ6Ly6w5V7_vQw',
      uri: 'spotify:playlist:5ScyGPT9yln8qiBVXidF6J'
    },
  ];

  return (
    <section id="music" className="min-h-screen pt-10 md:pt-16 pb-20 relative bg-background">
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
            I love sharing my playlists because music is a big love of mine, especially with favorite artists like Sweet Trip, TV Girl, Panchiko, Mazzy Star, and anything in the shoegaze scene.
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
              style={{ background: 'transparent', pointerEvents: 'none' }}
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
                      // If no playlist selected yet, auto-select the first one
                      if (!currentUri) {
                        const first = playlists[0];
                        setCurrentTrack(first.name);
                        setCurrentUri(first.uri);
                        setIsPlaying(true);
                        onPlayStateChange?.(true);
                        return;
                      }

                      const newPlayState = !isPlaying;
                      const controller = spotifyControllerRef.current;
                      
                      if (controller && controllerReadyRef.current) {
                        try {
                          console.log('Attempting to', newPlayState ? 'play' : 'pause');
                          if (newPlayState) {
                            controller.play();
                          } else {
                            controller.pause();
                          }
                          // Update UI state immediately for better UX
                          setIsPlaying(newPlayState);
                          onPlayStateChange?.(newPlayState);
                        } catch (e) {
                          console.warn('Failed to control playback:', e);
                          setError('Failed to control playback');
                        }
                      } else {
                        console.warn('Controller not ready, just updating UI state');
                        // No controller available, just toggle UI state
                        setIsPlaying(newPlayState);
                        onPlayStateChange?.(newPlayState);
                      }
                    }}
                    disabled={isLoading}
                    className={`w-12 h-12 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                      isLoading
                        ? 'border-muted-foreground opacity-50 cursor-not-allowed'
                        : isPlaying
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

              {/* Spotify IFrame API Container */}
              <div className="mt-4">
                {error && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
                {isLoading && (
                  <div className="mb-4 p-3 bg-muted/50 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">Loading Spotify player...</p>
                  </div>
                )}
                {/* Host element owned by React; we create/destroy a child mount node for Spotify */}
                <div ref={spotifyHostRef} />
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
                    console.log('Selecting playlist:', playlist.name, 'URI:', playlist.uri);
                    setCurrentTrack(playlist.name);
                    setCurrentUri(playlist.uri);
                    // Set playing state immediately for better UX
                    setIsPlaying(true);
                    onPlayStateChange?.(true);
                    setError(null);
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
                      {playlist.artist && <p className="text-sm text-muted-foreground">{playlist.artist}</p>}
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