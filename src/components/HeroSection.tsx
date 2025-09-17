import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center">
      {/* Dot grid overlay */}
      <div className="absolute inset-0 dot-grid opacity-30" />
      
      <div className="container mx-auto px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Main headline with dither effect */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="text-6xl md:text-8xl font-bold mb-6 dither-reveal animate-fade-in"
          >
            Visual
            <br />
            <span className="text-primary">Storyteller</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in"
          >
            Photographs & films. Crafted with intent.
            <br />
            Color-accurate prints & cinematic edits.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a href="#portfolio" className="btn-cinematic bg-primary text-primary-foreground hover:bg-primary-glow">
              Explore Portfolio
            </a>
            
            <a href="#music" className="btn-cinematic bg-primary text-primary-foreground hover:bg-primary-glow">
              Listen to Sessions
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex flex-col items-center text-muted-foreground">
              <span className="text-sm mb-2">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-px h-8 bg-accent"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}