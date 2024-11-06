import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, X, Clock, Music2, Plus } from 'lucide-react';
import { usePlaylistStore } from '../store/playlistStore';
import { usePlayerStore } from '../store/playerStore';
import { toast } from 'react-hot-toast';
import { AddTrackModal } from '../components/AddTrackModal';
import { Track } from '../types/music';

export function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAddTrackModalOpen, setIsAddTrackModalOpen] = useState(false);
  const { playlists = [], deletePlaylist, addTrackToPlaylist } = usePlaylistStore();
  const playlist = playlists.find(p => p.id === id);
  const { setTrack, currentTrack, isPlaying, pause, play } = usePlayerStore();

  if (!playlist) {
    return <div className="p-8">Playlist not found</div>;
  }

  const handlePlay = (track: Track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      setTrack(track);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deletePlaylist(id);
      toast.success('Playlist deleted successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete playlist');
    }
  };

  const handlePlayAll = () => {
    if (playlist.tracks.length > 0) {
      setTrack(playlist.tracks[0]);
    }
  };

  const handleAddTrack = async (track: Omit<Track, 'id'>) => {
    if (!id) return;
    
    try {
      await addTrackToPlaylist(id, track);
      toast.success('Track added successfully');
    } catch (error) {
      toast.error('Failed to add track');
    }
  };

  return (
    <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 min-h-full">
      <div className="px-6 py-4">
        <div className="flex items-end gap-6 mb-6">
          <div className="relative group">
            <img 
              src={playlist.cover} 
              alt={playlist.name}
              className="w-52 h-52 shadow-lg object-cover"
            />
            <button
              onClick={handleDelete}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white invisible group-hover:visible hover:bg-black/80 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-zinc-400 uppercase mb-2">Playlist</p>
            <h1 className="text-5xl font-bold mb-6">{playlist.name}</h1>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Music2 className="w-4 h-4" />
              <span>{playlist.tracks.length} songs</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handlePlayAll}
            disabled={playlist.tracks.length === 0}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-green-400 hover:bg-green-500 text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-8 h-8 pl-1" />
          </button>
          <button
            onClick={() => setIsAddTrackModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <Plus className="w-4 h-4" />
            Add Track
          </button>
        </div>

        <div className="mt-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-700 text-sm text-zinc-400">
                <th className="pb-3 w-12">#</th>
                <th className="pb-3">Title</th>
                <th className="pb-3">Artist</th>
                <th className="pb-3 text-right pr-8">
                  <Clock className="w-4 h-4" />
                </th>
              </tr>
            </thead>
            <tbody>
              {playlist.tracks.map((track, index) => {
                const isCurrentTrack = currentTrack?.id === track.id;
                return (
                  <tr 
                    key={track.id}
                    className={`group hover:bg-white/10 cursor-pointer ${isCurrentTrack ? 'text-green-400' : ''}`}
                    onClick={() => handlePlay(track)}
                  >
                    <td className="py-3 w-12">
                      {isCurrentTrack && isPlaying ? (
                        <div className="w-4 h-4 flex items-center justify-center">
                          <span className="block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        </div>
                      ) : (
                        <>
                          <span className="group-hover:hidden">{index + 1}</span>
                          <Play className="w-4 h-4 hidden group-hover:block" />
                        </>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={track.albumCover} 
                          alt={track.title}
                          className="w-10 h-10 object-cover"
                        />
                        <div className="flex flex-col">
                          <span className={`font-medium ${isCurrentTrack ? 'text-green-400' : 'text-white'}`}>
                            {track.title}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">{track.artist}</td>
                    <td className="py-3 text-right pr-8">{track.duration}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AddTrackModal
        isOpen={isAddTrackModalOpen}
        onClose={() => setIsAddTrackModalOpen(false)}
        onAddTrack={handleAddTrack}
      />
    </div>
  );
}