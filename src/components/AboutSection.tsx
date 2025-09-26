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
    { name: 'Nikon L620', type: 'Camera' },
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
            About <span className="text-primary">Kartik</span>
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
              <p className="text-muted-foreground leading-relaxed">
                Every frame has a story to tell. I like mixing precision with feeling, making images and films that stick with you long after you've seen them. Inspired by the greats of cinema and obsessed with color and mood, I pay attention to every little detail—whether it's a quiet portrait or a huge landscape. It's all about capturing moments that feel alive, honest, and a little bit timeless.
              </p>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-accent">Expertise</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-border rounded-lg p-4 text-center hover:bg-secondary transition-colors"
                  >
                    <span className="text-sm font-medium">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </div>

          </motion.div>

          {/* Equipment & Process */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Portrait removed as requested */}

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