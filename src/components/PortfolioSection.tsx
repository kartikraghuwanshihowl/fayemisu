import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FolderModal from './FolderModal';

interface Folder {
  id: string;
  name: string;
  preview: string;
  itemCount: number;
  type: 'photo' | 'video' | 'mixed';
}

const portfolioFolders: Folder[] = [
  {
    id: 'photos',
    name: 'Photos',
    preview: '/assets/sample-portrait.jpg',
    itemCount: 42,
    type: 'photo',
  },
  {
    id: 'videos',
    name: 'Videos',
    preview: '/assets/sample-landscape.jpg',
    itemCount: 28,
    type: 'video',
  },
  {
    id: 'landscapes',
    name: 'Landscapes',
    preview: '/assets/sample-landscape.jpg',
    itemCount: 18,
    type: 'photo',
  },
  {
    id: 'films',
    name: 'Short Films',
    preview: '/assets/sample-landscape.jpg',
    itemCount: 12,
    type: 'video',
  },
  {
    id: 'experimental',
    name: 'Experimental',
    preview: '/assets/portfolio-hero.jpg',
    itemCount: 16,
    type: 'mixed',
  },
];

export default function PortfolioSection() {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  const getFolderIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return '📸';
      case 'video':
        return '🎬';
      default:
        return '📁';
    }
  };

  return (
    <section id="portfolio" className="min-h-screen py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-6 dither-reveal animate-fade-in">
            Portfolio
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            A curated collection of visual stories, each folder containing moments captured with precision and artistry.
          </p>
        </motion.div>

        {/* Folder Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {portfolioFolders.map((folder, index) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              className="folder-card group cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedFolder(folder)}
            >
              {/* Folder Preview */}
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={folder.preview}
                  alt={folder.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 left-3 text-2xl">
                  {getFolderIcon(folder.type)}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {folder.itemCount} items
                </div>
              </div>

              {/* Folder Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                  {folder.name}
                </h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {folder.type === 'mixed' ? 'Photos & Videos' : folder.type}
                </p>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Folder Modal */}
      <AnimatePresence>
        {selectedFolder && (
          <FolderModal
            folder={selectedFolder}
            onClose={() => setSelectedFolder(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}