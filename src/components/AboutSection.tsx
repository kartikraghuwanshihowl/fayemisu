import { motion } from 'framer-motion';

export default function AboutSection() {
  const skills = [
    'Portrait Photography',
    'Landscape Photography',
    'Commercial Video',
    'Color Grading',
    'Audio Production',
    'Visual Storytelling',
  ];

  const equipment = [
    { name: 'Nikon D850', type: 'Camera' },
    { name: 'Canon C300 Mark III', type: 'Video' },
    { name: 'DJI Ronin 4D', type: 'Stabilizer' },
    { name: 'Profoto B10X', type: 'Lighting' },
  ];

  return (
    <section id="about" className="min-h-screen py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-6 dither-reveal">
            About <span className="text-primary">Kakashi</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A visual storyteller dedicated to capturing moments with precision, artistry, and cinematic vision.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Story & Philosophy */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4 text-accent">Visual Philosophy</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every frame tells a story. My approach combines technical precision with emotional depth, 
                creating images and films that resonate beyond the moment they capture.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Inspired by cinematic masters and driven by a passion for color accuracy, I bring 
                a meticulous eye to every project—from intimate portraits to sweeping landscapes.
              </p>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-accent">Expertise</h3>
              <div className="grid grid-cols-2 gap-3">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-border rounded-lg p-3 text-center hover:bg-secondary transition-colors"
                  >
                    <span className="text-sm font-medium">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { number: '500+', label: 'Projects' },
                { number: '50+', label: 'Clients' },
                { number: '5+', label: 'Years' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Equipment & Process */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Portrait */}
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-muted to-secondary rounded-lg overflow-hidden">
                <img
                  src="/assets/kakashi-profile.jpg"
                  alt="Kakashi Raghuwanshi"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-medium">Behind the camera</p>
                <p className="text-sm opacity-80">Crafting visual stories</p>
              </div>
            </div>

            {/* Equipment */}
            <div>
              <h3 className="text-2xl font-bold mb-4 text-accent">Professional Gear</h3>
              <div className="space-y-3">
                {equipment.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between bg-card border border-border rounded-lg p-4"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                    </div>
                    <div className="w-2 h-2 bg-accent rounded-full" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}