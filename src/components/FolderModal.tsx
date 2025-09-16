import { motion } from 'framer-motion';
import { useState } from 'react';

interface Folder {
  id: string;
  name: string;
  preview: string;
  itemCount: number;
  type: 'photo' | 'video' | 'mixed';
}

interface FolderModalProps {
  folder: Folder;
  onClose: () => void;
}

// Mock media items
const generateMediaItems = (folderId: string, count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${folderId}-${i}`,
    src: `/api/placeholder/400/300`,
    type: Math.random() > 0.7 ? 'video' : 'photo',
    title: `${folderId} ${i + 1}`,
  }));
};

export default function FolderModal({ folder, onClose }: FolderModalProps) {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const mediaItems = generateMediaItems(folder.id, folder.itemCount);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 500 }}
        className="bg-card border border-border rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📁</span>
            <div>
              <h3 className="text-xl font-bold">{folder.name}</h3>
              <p className="text-sm text-muted-foreground">{folder.itemCount} items</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Media Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mediaItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative group cursor-pointer overflow-hidden rounded-lg"
                onClick={() => setSelectedMedia(item.id)}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Media type indicator */}
                {item.type === 'video' && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l7-5-7-5z" />
                    </svg>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Title on hover */}
                <div className="absolute bottom-2 left-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.title}
                </div>
              </motion.div>
            ))}
            
            {/* "Want to see more?" card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: mediaItems.length * 0.05 }}
              className="relative group cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center h-32"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">✨</div>
                <p className="text-sm font-medium text-primary">Want to see more?</p>
                <p className="text-xs text-muted-foreground">Click to explore</p>
              </div>
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}