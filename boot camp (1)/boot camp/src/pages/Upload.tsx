import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, Video, X, Hash, Tag, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReels } from '@/contexts/ReelsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const categories = [
  'Entertainment',
  'Education',
  'Lifestyle',
  'Technology',
  'Food',
  'Travel',
  'Music',
  'Sports',
  'Nature',
  'Comedy',
];

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { addReel } = useReels();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [category, setCategory] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a video');
      return;
    }

    if (!caption.trim()) {
      toast.error('Please add a caption');
      return;
    }

    setIsUploading(true);

    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const hashtagArray = hashtags
      .split(/[,#\s]+/)
      .filter((tag) => tag.trim())
      .map((tag) => tag.trim().toLowerCase());

    addReel({
      videoUrl: preview!,
      thumbnailUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=600&fit=crop',
      caption,
      hashtags: hashtagArray,
      category: category || 'Entertainment',
    });

    toast.success('Reel uploaded successfully!');
    navigate('/');
    setIsUploading(false);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-4 px-4 bg-background">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Upload Reel</h1>

        {/* Upload area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !selectedFile && fileInputRef.current?.click()}
          className={`relative aspect-[9/16] rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
            isDragging
              ? 'border-primary bg-primary/10'
              : selectedFile
              ? 'border-transparent'
              : 'border-border hover:border-primary/50'
          }`}
        >
          {preview ? (
            <>
              <video
                src={preview}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center z-10"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <motion.div
                animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                className="w-20 h-20 rounded-full glass flex items-center justify-center mb-4"
              >
                {isDragging ? (
                  <UploadIcon className="w-10 h-10 text-primary" />
                ) : (
                  <Video className="w-10 h-10 text-muted-foreground" />
                )}
              </motion.div>
              <p className="text-foreground font-medium mb-2">
                {isDragging ? 'Drop your video here' : 'Drag & drop your video'}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse files
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />

        {/* Form */}
        <div className="mt-6 space-y-4">
          {/* Caption */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Caption</label>
            <Textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="bg-muted border-0 rounded-xl resize-none text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Hashtags</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Add hashtags (separated by spaces or commas)"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="pl-12 h-14 bg-muted border-0 rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Category</label>
            <div className="relative">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="w-full h-14 bg-muted rounded-xl px-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-muted-foreground" />
                  <span className={category ? 'text-foreground' : 'text-muted-foreground'}>
                    {category || 'Select a category'}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    showCategories ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showCategories && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border border-border overflow-hidden z-10"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        setShowCategories(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors ${
                        category === cat ? 'text-primary bg-muted' : 'text-foreground'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Upload button */}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full h-14 rounded-xl gradient-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                />
                Uploading...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <UploadIcon className="w-5 h-5" />
                Upload Reel
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
