import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Reel {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  hashtags: string[];
  category: string;
  creator: {
    id: string;
    username: string;
    avatar: string;
  };
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  views: number;
}

interface ReelsContextType {
  reels: Reel[];
  savedReels: Reel[];
  toggleLike: (reelId: string) => void;
  toggleSave: (reelId: string) => void;
  addReel: (reel: Omit<Reel, 'id' | 'likes' | 'isLiked' | 'isSaved' | 'views' | 'creator'>) => void;
}

const ReelsContext = createContext<ReelsContextType | undefined>(undefined);

// Mock data with sample videos
const mockReels: Reel[] = [
  {
    id: '1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=600&fit=crop',
    caption: 'Amazing sunset vibes 🌅 Nature never disappoints!',
    hashtags: ['sunset', 'nature', 'vibes', 'beautiful'],
    category: 'Nature',
    creator: {
      id: '1',
      username: 'naturelover',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    likes: 12500,
    isLiked: false,
    isSaved: false,
    views: 45000,
  },
  {
    id: '2',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=400&h=600&fit=crop',
    caption: 'City lights hit different at night ✨ #nightlife',
    hashtags: ['city', 'nightlife', 'urban', 'lights'],
    category: 'Urban',
    creator: {
      id: '2',
      username: 'cityexplorer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    likes: 8900,
    isLiked: false,
    isSaved: false,
    views: 32000,
  },
  {
    id: '3',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=400&h=600&fit=crop',
    caption: 'Weekend adventures are the best 🎉 Living life to the fullest!',
    hashtags: ['weekend', 'adventure', 'fun', 'lifestyle'],
    category: 'Lifestyle',
    creator: {
      id: '3',
      username: 'adventurer',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop',
    },
    likes: 15600,
    isLiked: false,
    isSaved: false,
    views: 67000,
  },
  {
    id: '4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?w=400&h=600&fit=crop',
    caption: 'Tech innovation at its finest 🚀 The future is now!',
    hashtags: ['tech', 'innovation', 'future', 'gadgets'],
    category: 'Technology',
    creator: {
      id: '4',
      username: 'techguru',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    },
    likes: 22100,
    isLiked: false,
    isSaved: false,
    views: 89000,
  },
  {
    id: '5',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1682686581660-3693f0c588d2?w=400&h=600&fit=crop',
    caption: 'Cooking magic in the kitchen 🍳 Recipe in bio!',
    hashtags: ['cooking', 'food', 'recipe', 'yummy'],
    category: 'Food',
    creator: {
      id: '5',
      username: 'chefjoy',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
    likes: 18700,
    isLiked: false,
    isSaved: false,
    views: 54000,
  },
];

export const ReelsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reels, setReels] = useState<Reel[]>(mockReels);

  const toggleLike = (reelId: string) => {
    setReels(prev =>
      prev.map(reel =>
        reel.id === reelId
          ? {
              ...reel,
              isLiked: !reel.isLiked,
              likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1,
            }
          : reel
      )
    );
  };

  const toggleSave = (reelId: string) => {
    setReels(prev =>
      prev.map(reel =>
        reel.id === reelId ? { ...reel, isSaved: !reel.isSaved } : reel
      )
    );
  };

  const addReel = (newReel: Omit<Reel, 'id' | 'likes' | 'isLiked' | 'isSaved' | 'views' | 'creator'>) => {
    const reel: Reel = {
      ...newReel,
      id: Date.now().toString(),
      likes: 0,
      isLiked: false,
      isSaved: false,
      views: 0,
      creator: {
        id: 'current',
        username: 'you',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      },
    };
    setReels(prev => [reel, ...prev]);
  };

  const savedReels = reels.filter(reel => reel.isSaved);

  return (
    <ReelsContext.Provider value={{ reels, savedReels, toggleLike, toggleSave, addReel }}>
      {children}
    </ReelsContext.Provider>
  );
};

export const useReels = () => {
  const context = useContext(ReelsContext);
  if (context === undefined) {
    throw new Error('useReels must be used within a ReelsProvider');
  }
  return context;
};
