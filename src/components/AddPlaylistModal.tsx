import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { usePlaylistStore } from '../store/playlistStore';
import { getYoutubeVideoDetails } from '../utils/youtube';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface AddPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPlaylistModal({ isOpen, onClose }: AddPlaylistModalProps) {
  const [playlistName, setPlaylistName] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { addPlaylist } = usePlaylistStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.username) {
      toast.error('You must be logged in to create a playlist');
      return;
    }

    if (!playlistName.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }

    if (!youtubeUrl.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    setIsLoading(true);

    try {
      const videoDetails = await getYoutubeVideoDetails(youtubeUrl);
      
      await addPlaylist({
        name: playlistName.trim(),
        tracks: [{
          id: uuidv4(),
          title: videoDetails.title,
          artist: videoDetails.artist,
          youtubeId: videoDetails.youtubeId,
          duration: videoDetails.duration,
          albumCover: videoDetails.albumCover
        }],
        username: user.username
      });

      setPlaylistName('');
      setYoutubeUrl('');
      onClose();
    } catch (error) {
      console.error('Error creating playlist:', error);
      const message = error instanceof Error ? error.message : 'Failed to create playlist';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg p-6 w-[500px] max-w-[90vw]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Playlist</h2>
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
            <label className="block text-sm font-medium mb-2">Playlist Name</label>
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full bg-zinc-800 rounded px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="My Awesome Playlist"
              required
              maxLength={50}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">YouTube URL</label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full bg-zinc-800 rounded px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="https://youtube.com/watch?v=..."
              required
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-zinc-400">
              Enter a YouTube video URL (e.g., https://youtube.com/watch?v=dQw4w9WgXcQ)
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
                  Creating...
                </>
              ) : (
                'Create Playlist'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}