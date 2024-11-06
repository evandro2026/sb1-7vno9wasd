import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { getYoutubeVideoDetails } from '../utils/youtube';
import { Track } from '../types/music';
import { toast } from 'react-hot-toast';

interface AddTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTrack: (track: Omit<Track, 'id'>) => Promise<void>;
}

export function AddTrackModal({ isOpen, onClose, onAddTrack }: AddTrackModalProps) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!youtubeUrl.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    setIsLoading(true);

    try {
      const videoDetails = await getYoutubeVideoDetails(youtubeUrl);
      await onAddTrack(videoDetails);
      setYoutubeUrl('');
      onClose();
    } catch (error) {
      console.error('Error adding track:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add track');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-6 w-[500px] max-w-[90vw]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Track</h2>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              YouTube URL
            </label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full bg-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://youtube.com/watch?v=..."
              required
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-zinc-400">
              Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-500 hover:bg-green-400 text-black font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Track'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}