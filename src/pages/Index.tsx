import { useEffect, useState } from 'react';
import { useScrollSpy, useScrollY } from '@/hooks/useScrollSpy';
import ThreeScene from '@/components/ThreeScene';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import PortfolioSection from '@/components/PortfolioSection';
import MusicSection from '@/components/MusicSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  const scrollY = useScrollY();
  const activeSection = useScrollSpy(['home', 'portfolio', 'music', 'about', 'contact']);
  const [currentModel, setCurrentModel] = useState('/assets/models/scene.gltf');
  const [isPlaying, setIsPlaying] = useState(false);

  // Determine if we're in portfolio section for 3D model positioning
  const inPortfolio = activeSection === 'portfolio';

  // Change model based on section - exclude music section as it has its own vinyl model
  useEffect(() => {
    switch (activeSection) {
      case 'home':
        setCurrentModel('/models/untitled.glb');
        break;
      case 'portfolio':
        setCurrentModel('/assets/models/nikon.gltf');
        break;
      case 'music':
        setCurrentModel(''); // No global model for music section
        break;
      default:
        setCurrentModel('/models/untitled.glb');
    }
  }, [activeSection]);

  const handleNavigate = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-background text-foreground">
      {/* 3D Background Scene */}
      <ThreeScene
        scrollY={scrollY}
        inPortfolio={inPortfolio}
        currentModel={currentModel}
        isPlaying={isPlaying}
      />

      {/* Header */}
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection />
        <PortfolioSection />
        <MusicSection onPlayStateChange={setIsPlaying} />
        <AboutSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-background border-t border-border py-12 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
        <div className="container mx-auto px-6 text-center relative">
          <p className="text-muted-foreground">
            © 2024 Kartik. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
