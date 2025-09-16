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
  const [currentModel, setCurrentModel] = useState('/models/scene.gltf');

  // Determine if we're in portfolio section for 3D model positioning
  const inPortfolio = activeSection === 'portfolio';

  // Change model based on section
  useEffect(() => {
    switch (activeSection) {
      case 'home':
        setCurrentModel('/models/scene.gltf');
        break;
      case 'portfolio':
        setCurrentModel('/models/nikon.gltf');
        break;
      case 'music':
        setCurrentModel('/models/camera.gltf');
        break;
      default:
        setCurrentModel('/models/scene.gltf');
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
      />

      {/* Header */}
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection />
        <PortfolioSection />
        <MusicSection />
        <AboutSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-card border-t border-border py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2024 Kakashi Raghuwanshi. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
