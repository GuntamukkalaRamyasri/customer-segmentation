import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, X, Play } from 'lucide-react';
import { useReels, Reel } from '@/contexts/ReelsContext';
import ReelPlayer from '@/components/ReelPlayer';

const Saved: React.FC = () => {
  const { savedReels, toggleLike, toggleSave } = useReels();
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);

  return (
    <div className="min-h-screen pb-24 pt-4 px-4 bg-background">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Saved Reels</h1>

        {savedReels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center mb-4">
              <Bookmark className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No saved reels yet</h3>
            <p className="text-muted-foreground text-center">
              Save your favorite reels to watch them later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {savedReels.map((reel, index) => (
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedReel(reel)}
                className="aspect-[9/16] relative rounded-lg overflow-hidden cursor-pointer group"
              >
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.caption}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-background/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-10 h-10 text-foreground" />
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-xs text-foreground text-shadow">
                  <Play className="w-3 h-3" />
                  {(reel.views / 1000).toFixed(1)}K
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen reel player */}
      <AnimatePresence>
        {selectedReel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background"
          >
            <button
              onClick={() => setSelectedReel(null)}
              className="absolute top-4 left-4 w-10 h-10 rounded-full glass flex items-center justify-center z-10"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
            <ReelPlayer
              reel={selectedReel}
              isActive={true}
              onLike={() => toggleLike(selectedReel.id)}
              onSave={() => toggleSave(selectedReel.id)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Saved;
