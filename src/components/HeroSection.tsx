import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center">
      {/* Dot grid overlay */}
      <div className="absolute inset-0 dot-grid opacity-30" />
      
      <div className="container mx-auto px-4 sm:px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="max-w-4xl mx-auto flex flex-col items-center justify-center w-full"
        >
          {/* Main headline with dither effect */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 dither-reveal animate-fade-in text-center px-4"
          >
            visual
            <br />
            <span className="text-primary">diary</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in text-center px-4"
          >
            Creating with instinct and perception by experimenting and exploring creativity.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4"
          >
            <a href="#portfolio" className="btn-cinematic bg-primary text-primary-foreground hover:bg-primary-glow px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium w-full sm:w-auto text-center">
              Explore Portfolio
            </a>
            
            <a href="#music" className="btn-cinematic bg-primary text-primary-foreground hover:bg-primary-glow px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium w-full sm:w-auto text-center">
              Listen to Music
            </a>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}