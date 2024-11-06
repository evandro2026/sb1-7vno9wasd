import React from 'react';
import { Play, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Playlist } from '../types/music';
import { usePlayerStore } from '../store/playerStore';
import { usePlaylistStore } from '../store/playlistStore';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface PlaylistCardProps {
  playlist: Playlist;
  variant?: 'row' | 'grid';
}

export function PlaylistCard({ playlist, variant = 'row' }: PlaylistCardProps) {
  const { user } = useAuth();
  const { setTrack, currentTrack, isPlaying, pause, play } = usePlayerStore();
  const { deletePlaylist } = usePlaylistStore();

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (playlist.tracks.length === 0) return;

    const firstTrack = playlist.tracks[0];
    if (currentTrack?.id === firstTrack.id) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      setTrack(firstTrack);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user?.uid) {
      toast.error('You must be logged in to delete a playlist');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      try {
        await deletePlaylist(playlist.id, user.uid);
        toast.success('Playlist deleted successfully');
      } catch (error) {
        toast.error('Failed to delete playlist');
      }
    }
  };

  if (variant === 'grid') {
    return (
      <Link 
        to={`/playlists/${playlist.id}`}
        className="bg-white/5 p-3 rounded-md hover:bg-white/10 flex flex-col gap-2 group relative transition-colors"
      >
        <div className="relative aspect-square">
          <img 
            src={playlist.cover} 
            className="w-full h-full object-cover rounded-md" 
            alt={playlist.name}
          />
          {playlist.tracks.length > 0 && (
            <button 
              className="absolute right-2 bottom-2 w-12 h-12 flex items-center justify-center rounded-full bg-green-400 text-black ml-auto invisible group-hover:visible transition-all hover:bg-green-500"
              onClick={handlePlay}
            >
              <Play className="w-6 h-6 pl-1" />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white invisible group-hover:visible hover:bg-black/80 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <strong className="text-zinc-100 truncate">{playlist.name}</strong>
        <span className="text-sm text-zinc-400">{playlist.tracks.length} songs</span>
      </Link>
    );
  }

  return (
    <Link 
      to={`/playlists/${playlist.id}`}
      className="group relative bg-white/5 rounded overflow-hidden flex items-center gap-4 hover:bg-white/10 transition-colors"
    >
      <img 
        src={playlist.cover} 
        alt={playlist.name} 
        className="w-24 h-24 object-cover"
      />
      <strong className="text-zinc-100 truncate">{playlist.name}</strong>
      <div className="absolute right-4 flex items-center gap-2">
        {playlist.tracks.length > 0 && (
          <button 
            className="w-12 h-12 flex items-center justify-center rounded-full bg-green-400 text-black ml-auto invisible group-hover:visible hover:bg-green-500 transition-colors"
            onClick={handlePlay}
          >
            <Play className="w-6 h-6 pl-1" />
          </button>
        )}
        <button
          onClick={handleDelete}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white invisible group-hover:visible hover:bg-black/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </Link>
  );
}