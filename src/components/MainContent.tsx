import React, { useEffect } from 'react';
import { PlaylistCard } from './PlaylistCard';
import { usePlaylistStore } from '../store/playlistStore';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Music2 } from 'lucide-react';

export function MainContent() {
  const { user } = useAuth();
  const { playlists, loading, error, fetchUserPlaylists } = usePlaylistStore();

  useEffect(() => {
    if (user?.username) {
      fetchUserPlaylists(user.username);
    }
  }, [user?.username]); // Remove fetchUserPlaylists from dependencies

  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-2">Error loading playlists</p>
          <p className="text-sm text-zinc-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-zinc-900 to-black">
      <h1 className="text-3xl font-bold text-zinc-100 mb-6">Your Playlists</h1>

      {!playlists || playlists.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music2 className="w-8 h-8 text-zinc-400" />
          </div>
          <p className="text-zinc-400 text-lg">No playlists found</p>
          <p className="text-zinc-500 text-sm mt-2">Create a playlist to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard 
              key={playlist.id} 
              playlist={playlist}
              variant="grid"
            />
          ))}
        </div>
      )}
    </main>
  );
}