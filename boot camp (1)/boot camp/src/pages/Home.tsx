import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReelPlayer from '@/components/ReelPlayer';
import { useReels } from '@/contexts/ReelsContext';

const Home: React.FC = () => {
  const { reels, toggleLike, toggleSave } = useReels();
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const endY = e.changedTouches[0].clientY;
    const diff = startY.current - endY;
    const threshold = 50;

    if (diff > threshold && currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (diff < -threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
    
    isDragging.current = false;
  }, [currentIndex, reels.length]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.deltaY > 0 && currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex, reels.length]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-background overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute inset-0"
        >
          {reels[currentIndex] && (
            <ReelPlayer
              reel={reels[currentIndex]}
              isActive={true}
              onLike={() => toggleLike(reels[currentIndex].id)}
              onSave={() => toggleSave(reels[currentIndex].id)}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 flex gap-1 z-20">
        {reels.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-primary'
                : 'w-2 bg-foreground/30'
            }`}
          />
        ))}
      </div>

      {/* Swipe hint for first time */}
      {currentIndex === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex flex-col items-center text-foreground/60"
          >
            <span className="text-xs">Swipe up for more</span>
            <svg
              className="w-6 h-6 mt-1 rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
