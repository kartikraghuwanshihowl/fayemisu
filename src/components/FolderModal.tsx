import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';

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

const photoItems = [
  { id: 'copppy', src: '/assets/copppy.JPG', type: 'photo', title: 'copppy' },
  { id: 'DSCN000fe5', src: '/assets/DSCN000fe5.JPG', type: 'photo', title: 'DSCN000fe5' },
  { id: 'DSCN0002', src: '/assets/DSCN0002.JPG', type: 'photo', title: 'DSCN0002' },
  { id: 'DSCN0003', src: '/assets/DSCN0003.JPG', type: 'photo', title: 'DSCN0003' },
  { id: 'DSCN0004', src: '/assets/DSCN0004.JPG', type: 'photo', title: 'DSCN0004' },
  { id: 'DSCN0004fr', src: '/assets/DSCN0004fr.JPG', type: 'photo', title: 'DSCN0004fr' },
  { id: 'DSCN0007fr', src: '/assets/DSCN0007fr.JPG', type: 'photo', title: 'DSCN0007fr' },
  { id: 'DSCN0010', src: '/assets/DSCN0010.JPG', type: 'photo', title: 'DSCN0010' },
  { id: 'DSCN0011', src: '/assets/DSCN0011.JPG', type: 'photo', title: 'DSCN0011' },
  { id: 'DSCN0030', src: '/assets/DSCN0030.JPG', type: 'photo', title: 'DSCN0030' },
  { id: 'DSCN0033', src: '/assets/DSCN0033.JPG', type: 'photo', title: 'DSCN0033' },
  { id: 'DSCN0034', src: '/assets/DSCN0034.JPG', type: 'photo', title: 'DSCN0034' },
  { id: 'DSCN0053', src: '/assets/DSCN0053.JPG', type: 'photo', title: 'DSCN0053' },
  { id: 'DSCN0054', src: '/assets/DSCN0054.JPG', type: 'photo', title: 'DSCN0054' },
  { id: 'DSCN0055', src: '/assets/DSCN0055.JPG', type: 'photo', title: 'DSCN0055' },
  { id: 'DSCN0057', src: '/assets/DSCN0057.JPG', type: 'photo', title: 'DSCN0057' },
  { id: 'DSCN0058', src: '/assets/DSCN0058.JPG', type: 'photo', title: 'DSCN0058' },
  { id: 'DSCN0062', src: '/assets/DSCN0062.JPG', type: 'photo', title: 'DSCN0062' },
  { id: 'DSCN0063', src: '/assets/DSCN0063.JPG', type: 'photo', title: 'DSCN0063' },
  { id: 'DSCN0065', src: '/assets/DSCN0065.JPG', type: 'photo', title: 'DSCN0065' },
  { id: 'DSCN0070', src: '/assets/DSCN0070.JPG', type: 'photo', title: 'DSCN0070' },
  { id: 'DSCN0071', src: '/assets/DSCN0071.JPG', type: 'photo', title: 'DSCN0071' },
  { id: 'DSCN0073', src: '/assets/DSCN0073.JPG', type: 'photo', title: 'DSCN0073' },
];

const videoItems = [
  { id: '0929-1', src: '/assets/0929 (1)(1).mp4', type: 'video', title: '0929 (1)(1)' },
  { id: '0929-2', src: '/assets/0929 (1)(2).mp4', type: 'video', title: '0929 (1)(2)' },
  { id: '0929-3', src: '/assets/0929 (1)(3).mp4', type: 'video', title: '0929 (1)(3)' },
  { id: '0929-4', src: '/assets/0929 (1)(4).mp4', type: 'video', title: '0929 (1)(4)' },
  { id: '0929-5', src: '/assets/0929 (1)(5).mp4', type: 'video', title: '0929 (1)(5)' },
  { id: '0929-main', src: '/assets/0929.mp4', type: 'video', title: '0929' },
];

// Explicit items for the Experimental folder
const experimentalItems = [
  { id: 'Screenshot-20', src: '/assets/Screenshot (20).png', type: 'photo', title: 'Screenshot (20)' },
  { id: '000', src: '/assets/000.JPG', type: 'photo', title: '000' },
  { id: '2', src: '/assets/2.JPG', type: 'photo', title: '2' },
  { id: '344', src: '/assets/344.JPG', type: 'photo', title: '344' },
  { id: '1122-2-0', src: '/assets/1122.2.0.JPG', type: 'photo', title: '1122.2.0' },
  { id: '1122', src: '/assets/1122.JPG', type: 'photo', title: '1122' },
  { id: '6666', src: '/assets/6666.JPG', type: 'photo', title: '6666' },
  { id: 'DSCN0008', src: '/assets/DSCN0008.JPG', type: 'photo', title: 'DSCN0008' },
  { id: 'DSCN0009', src: '/assets/DSCN0009.JPG', type: 'photo', title: 'DSCN0009' },
  { id: 'DSCN0010', src: '/assets/DSCN0010.JPG', type: 'photo', title: 'DSCN0010' },
  { id: 'DSCN0015', src: '/assets/DSCN0015.JPG', type: 'photo', title: 'DSCN0015' },
  { id: 'DSCN0017', src: '/assets/DSCN0017.JPG', type: 'photo', title: 'DSCN0017' },
  { id: 'DSCN0018', src: '/assets/DSCN0018.JPG', type: 'photo', title: 'DSCN0018' },
  { id: 'DSCN0021', src: '/assets/DSCN0021.JPG', type: 'photo', title: 'DSCN0021' },
  { id: 'DSCN0023', src: '/assets/DSCN0023.JPG', type: 'photo', title: 'DSCN0023' },
  { id: 'DSCN0024', src: '/assets/DSCN0024.JPG', type: 'photo', title: 'DSCN0024' },
  { id: 'DSCN0027', src: '/assets/DSCN0027.JPG', type: 'photo', title: 'DSCN0027' },
  { id: 'DSCN0030', src: '/assets/DSCN0030.JPG', type: 'photo', title: 'DSCN0030' },
  { id: 'DSCN0032', src: '/assets/DSCN0032.JPG', type: 'photo', title: 'DSCN0032' },
  { id: 'FSCN0020', src: '/assets/FSCN0020.JPG', type: 'photo', title: 'FSCN0020' },
  { id: 'rfr', src: '/assets/rfr.JPG', type: 'photo', title: 'rfr' },
  { id: 'Screenshot-21', src: '/assets/Screenshot (21).png', type: 'photo', title: 'Screenshot (21)' },
  { id: 'Screenshot-22', src: '/assets/Screenshot (22).png', type: 'photo', title: 'Screenshot (22)' },
  { id: 'Screenshot-23', src: '/assets/Screenshot (23).png', type: 'photo', title: 'Screenshot (23)' },
  { id: 'Screenshot-24', src: '/assets/Screenshot (24).png', type: 'photo', title: 'Screenshot (24)' },
  { id: 'yoo', src: '/assets/yoo.JPG', type: 'photo', title: 'yoo' },
];

const generateMediaItems = (folderId: string, count: number) => {
  if (folderId === 'photos') {
    return photoItems;
  }
  if (folderId === 'videos') {
    return videoItems;
  }
  if (folderId === 'experimental') {
    return experimentalItems;
  }
  return Array.from({ length: count }, (_, i) => ({
    id: `${folderId}-${i}`,
    src: `/api/placeholder/400/300`,
    type: Math.random() > 0.7 ? 'video' : 'photo',
    title: `${folderId} ${i + 1}`,
  }));
};

export default function FolderModal({ folder, onClose }: FolderModalProps) {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const mediaItems = generateMediaItems(folder.id, folder.itemCount);
  const visibleItems = mediaItems.slice(0, visibleCount);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 12);
  }, []);

  const handleMediaClick = useCallback((itemId: string) => {
    setSelectedMedia(itemId);
  }, []);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const triedFallback = img.dataset.fallback === '1';
    if (!triedFallback && img.src.includes('/assets/')) {
      img.dataset.fallback = '1';
      img.src = img.src.replace('/assets/', '/newassets/');
      return;
    }
    if (!triedFallback && img.src.includes('/newassets/')) {
      img.dataset.fallback = '1';
      img.src = '/placeholder.svg';
      return;
    }
    img.src = '/placeholder.svg';
  }, []);

  const selectedItem = mediaItems.find(item => item.id === selectedMedia);

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" style={{ contain: 'layout' }}>
            {visibleItems.map((item, index) => (
              <div
                key={item.id}
                className="relative group cursor-pointer overflow-hidden rounded-lg"
                onClick={() => handleMediaClick(item.id)}
              >
                {item.type === 'video' ? (
                  <video
                    src={item.src}
                    className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105"
                    style={{ willChange: 'transform' }}
                    muted
                    preload="metadata"
                    poster=""
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105"
                    style={{ willChange: 'transform' }}
                    onError={handleImageError}
                  />
                )}
                
                {/* Media type indicator */}
                {item.type === 'video' && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l7-5-7-5z" />
                    </svg>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                
                {/* Title on hover */}
                <div className="absolute bottom-2 left-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {item.title}
                </div>
              </div>
            ))}
            
            {visibleCount < mediaItems.length && (
              <button
                className="col-span-full flex items-center justify-center py-4 bg-card border border-border rounded-lg hover:bg-accent/10 transition-colors"
                onClick={handleLoadMore}
              >
                <span className="text-lg mr-2">➕</span>
                Load More
              </button>
            )}
            
            {visibleCount >= mediaItems.length && (
              <a
                href="https://drive.google.com/drive/folders/1aiScSBEvzbjV8ZD2bCqDkbdn0PMpVU2s?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center h-32"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">✨</div>
                  <p className="text-sm font-medium text-primary">wanna see more?</p>
                  <p className="text-xs text-muted-foreground">click here</p>
                </div>
                <div className="absolute inset-0 bg-primary/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedMedia && selectedItem && selectedItem.type === 'video' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Player Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-lg font-semibold">{selectedItem.title}</h3>
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Video Player */}
              <div className="p-4">
                <video
                  src={selectedItem.src}
                  controls
                  className="w-full h-auto max-h-[70vh] rounded-lg"
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
