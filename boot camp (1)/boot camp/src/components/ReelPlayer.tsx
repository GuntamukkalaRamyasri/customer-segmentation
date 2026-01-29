import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark, Share2, MessageCircle, Play, Volume2, VolumeX } from 'lucide-react';
import { Reel } from '@/contexts/ReelsContext';

interface ReelPlayerProps {
  reel: Reel;
  isActive: boolean;
  onLike: () => void;
  onSave: () => void;
}

const ReelPlayer: React.FC<ReelPlayerProps> = ({ reel, isActive, onLike, onSave }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showVolumeIndicator, setShowVolumeIndicator] = useState(false);
  const lastTap = useRef<number>(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (isActive) {
        videoRef.current.play().catch(() => {
          // Autoplay was prevented, need user interaction
          setIsMuted(true);
          videoRef.current!.muted = true;
          videoRef.current!.play().catch(() => {});
        });
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    }
  }, [isActive, isMuted]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (videoRef.current) {
      videoRef.current.muted = newMutedState;
    }
    // Show volume indicator
    setShowVolumeIndicator(true);
    setTimeout(() => setShowVolumeIndicator(false), 1000);
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!reel.isLiked) {
        onLike();
        setShowHeartBurst(true);
        setTimeout(() => setShowHeartBurst(false), 600);
      }
    }
    lastTap.current = now;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="relative w-full h-full bg-background" onClick={handleDoubleTap}>
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        poster={reel.thumbnailUrl}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />

      {/* Heart burst animation on double tap */}
      <AnimatePresence>
        {showHeartBurst && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Heart className="w-32 h-32 text-like fill-like" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause indicator */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center">
              <Play className="w-10 h-10 text-foreground ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Volume indicator when toggling */}
      <AnimatePresence>
        {showVolumeIndicator && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
          >
            <div className="w-24 h-24 rounded-full glass flex items-center justify-center">
              {isMuted ? (
                <VolumeX className="w-12 h-12 text-foreground" />
              ) : (
                <Volume2 className="w-12 h-12 text-foreground" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click to play/pause overlay */}
      <div className="absolute inset-0" onClick={togglePlay} />

      {/* Sound toggle button - more prominent */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleMute}
        className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center z-10 transition-colors ${
          isMuted ? 'glass' : 'gradient-primary'
        }`}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-foreground" />
        ) : (
          <Volume2 className="w-6 h-6 text-primary-foreground" />
        )}
      </motion.button>

      {/* Recommended label */}
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1 rounded-full glass text-xs font-medium text-foreground">
          Recommended for you
        </span>
      </div>

      {/* Right side actions */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-10">
        {/* Creator avatar */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="relative"
        >
          <img
            src={reel.creator.avatar}
            alt={reel.creator.username}
            className="w-12 h-12 rounded-full border-2 border-primary object-cover"
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs font-bold">
            +
          </div>
        </motion.div>

        {/* Like button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={reel.isLiked ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`w-8 h-8 ${
                reel.isLiked ? 'text-like fill-like' : 'text-foreground'
              }`}
            />
          </motion.div>
          <span className="text-xs mt-1 text-foreground text-shadow">
            {formatNumber(reel.likes)}
          </span>
        </motion.button>

        {/* Comment button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center"
        >
          <MessageCircle className="w-8 h-8 text-foreground" />
          <span className="text-xs mt-1 text-foreground text-shadow">
            {formatNumber(Math.floor(reel.likes * 0.1))}
          </span>
        </motion.button>

        {/* Save button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onSave();
          }}
          className="flex flex-col items-center"
        >
          <Bookmark
            className={`w-8 h-8 ${
              reel.isSaved ? 'text-save fill-save' : 'text-foreground'
            }`}
          />
          <span className="text-xs mt-1 text-foreground text-shadow">Save</span>
        </motion.button>

        {/* Share button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center"
        >
          <Share2 className="w-8 h-8 text-foreground" />
          <span className="text-xs mt-1 text-foreground text-shadow">Share</span>
        </motion.button>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-20 left-4 right-20 z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-semibold text-foreground text-shadow">
            @{reel.creator.username}
          </span>
        </div>
        <p className="text-sm text-foreground text-shadow mb-2">{reel.caption}</p>
        <div className="flex flex-wrap gap-2">
          {reel.hashtags.map((tag) => (
            <span
              key={tag}
              className="text-sm text-primary font-medium text-shadow"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReelPlayer;
