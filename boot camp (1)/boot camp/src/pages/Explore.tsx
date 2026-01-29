import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Film, BookOpen, Heart, Cpu, UtensilsCrossed, Plane, Music, Trophy, TreePine, Laugh, ArrowLeft, Play, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useReels, Reel } from '@/contexts/ReelsContext';
import ReelPlayer from '@/components/ReelPlayer';

const categories = [
  { name: 'Trending', icon: TrendingUp, color: 'from-pink-500 to-rose-500' },
  { name: 'Entertainment', icon: Film, color: 'from-violet-500 to-purple-500' },
  { name: 'Education', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
  { name: 'Lifestyle', icon: Heart, color: 'from-emerald-500 to-teal-500' },
  { name: 'Technology', icon: Cpu, color: 'from-orange-500 to-amber-500' },
  { name: 'Food', icon: UtensilsCrossed, color: 'from-red-500 to-pink-500' },
  { name: 'Travel', icon: Plane, color: 'from-sky-500 to-blue-500' },
  { name: 'Music', icon: Music, color: 'from-fuchsia-500 to-pink-500' },
  { name: 'Sports', icon: Trophy, color: 'from-yellow-500 to-orange-500' },
  { name: 'Nature', icon: TreePine, color: 'from-green-500 to-emerald-500' },
  { name: 'Comedy', icon: Laugh, color: 'from-purple-500 to-indigo-500' },
  { name: 'Urban', icon: Film, color: 'from-slate-500 to-gray-600' },
];

const Explore: React.FC = () => {
  const { reels, toggleLike, toggleSave } = useReels();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter reels by category
  const filteredReels = selectedCategory === 'Trending'
    ? reels.slice().sort((a, b) => b.views - a.views) // Sort by views for trending
    : reels.filter(reel => 
        reel.category.toLowerCase() === selectedCategory?.toLowerCase()
      );

  // Search filter
  const searchedReels = searchQuery
    ? reels.filter(reel =>
        reel.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reel.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        reel.creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reel.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const getCategoryInfo = (name: string) => categories.find(c => c.name === name);

  return (
    <div className="min-h-screen pb-24 pt-4 px-4 bg-background">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        {selectedCategory ? (
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className="w-10 h-10 rounded-full glass flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-2xl font-bold text-foreground">{selectedCategory}</h1>
          </div>
        ) : (
          <h1 className="text-2xl font-bold text-foreground mb-6">Explore</h1>
        )}

        {/* Search - only show when no category selected */}
        {!selectedCategory && (
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search reels, creators, hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-muted border-0 rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {/* Search Results */}
        {searchQuery && !selectedCategory && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Search Results ({searchedReels.length})
            </h2>
            {searchedReels.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No reels found for "{searchQuery}"
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {searchedReels.map((reel, index) => (
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
        )}

        {/* Category View - Show filtered reels */}
        {selectedCategory && (
          <div>
            {filteredReels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 rounded-full glass flex items-center justify-center mb-4">
                  {(() => {
                    const cat = getCategoryInfo(selectedCategory);
                    const Icon = cat?.icon || Film;
                    return <Icon className="w-10 h-10 text-muted-foreground" />;
                  })()}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No reels yet</h3>
                <p className="text-muted-foreground text-center">
                  Be the first to upload a {selectedCategory} reel!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {filteredReels.map((reel, index) => (
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
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center gap-1 text-xs text-foreground text-shadow">
                        <Play className="w-3 h-3" />
                        {(reel.views / 1000).toFixed(1)}K
                      </div>
                    </div>
                    {/* Category badge */}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-full glass text-[10px] font-medium text-foreground">
                        {reel.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Categories Grid - only show when no category selected and no search */}
        {!selectedCategory && !searchQuery && (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category, index) => {
              const reelsCount = category.name === 'Trending' 
                ? reels.length 
                : reels.filter(r => r.category.toLowerCase() === category.name.toLowerCase()).length;
              
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`aspect-square rounded-2xl bg-gradient-to-br ${category.color} p-5 cursor-pointer hover:scale-105 transition-transform relative overflow-hidden`}
                >
                  <category.icon className="w-8 h-8 text-white mb-3" />
                  <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                  <p className="text-sm text-white/80 mt-1">{reelsCount} reels</p>
                  
                  {/* Decorative circle */}
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
                </motion.div>
              );
            })}
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

export default Explore;
