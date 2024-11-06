import { create } from 'zustand';
import { ref, set, remove, onValue, push } from 'firebase/database';
import { db } from '../lib/firebase';
import { Playlist, Track } from '../types/music';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

interface PlaylistState {
  playlists: Playlist[];
  loading: boolean;
  error: string | null;
  fetchUserPlaylists: (username: string) => void;
  addPlaylist: (data: { name: string, tracks: Track[], username: string }) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  addTrackToPlaylist: (playlistId: string, track: Track) => Promise<void>;
}

export const usePlaylistStore = create<PlaylistState>((set) => ({
  playlists: [],
  loading: false,
  error: null,

  fetchUserPlaylists: (username: string) => {
    if (!username) return;

    set({ loading: true, error: null });
    
    // Reference the user's playlists directly
    const userPlaylistsRef = ref(db, `users/${username}/playlists`);
    
    const unsubscribe = onValue(userPlaylistsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (!data) {
          set({ playlists: [], loading: false });
          return;
        }

        const playlistArray = Object.entries(data).map(([id, playlist]: [string, any]) => ({
          id,
          name: playlist.name,
          cover: playlist.cover || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
          tracks: playlist.tracks ? Object.values(playlist.tracks) : [],
          username
        }));
        
        set({ playlists: playlistArray, loading: false });
      } catch (error) {
        console.error('Error loading playlists:', error);
        set({ 
          error: 'Failed to load playlists',
          loading: false 
        });
      }
    });

    return () => unsubscribe();
  },

  addPlaylist: async ({ name, tracks, username }) => {
    try {
      set({ loading: true });
      
      const playlistId = uuidv4();
      const userPlaylistRef = ref(db, `users/${username}/playlists/${playlistId}`);
      
      // Process tracks and ensure they have IDs
      const processedTracks = tracks.map(track => ({
        ...track,
        id: track.id || uuidv4()
      }));

      // Create tracks object with IDs as keys
      const tracksObject = processedTracks.reduce((acc, track) => ({
        ...acc,
        [track.id]: track
      }), {});

      // Set playlist data
      await set(userPlaylistRef, {
        name,
        cover: processedTracks[0]?.albumCover || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
        tracks: tracksObject,
        createdAt: new Date().toISOString()
      });

      set({ loading: false });
      toast.success('Playlist created successfully!');
    } catch (error) {
      console.error('Error creating playlist:', error);
      set({ loading: false });
      toast.error('Failed to create playlist');
      throw error;
    }
  },

  deletePlaylist: async (playlistId: string) => {
    try {
      const { user } = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user?.username) throw new Error('User not found');

      set({ loading: true });
      await remove(ref(db, `users/${user.username}/playlists/${playlistId}`));
      set({ loading: false });
      toast.success('Playlist deleted successfully');
    } catch (error) {
      console.error('Error deleting playlist:', error);
      set({ loading: false });
      toast.error('Failed to delete playlist');
      throw error;
    }
  },

  addTrackToPlaylist: async (playlistId: string, track: Track) => {
    try {
      const { user } = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user?.username) throw new Error('User not found');

      set({ loading: true });
      const trackId = track.id || uuidv4();
      await set(ref(db, `users/${user.username}/playlists/${playlistId}/tracks/${trackId}`), {
        ...track,
        id: trackId
      });
      set({ loading: false });
      toast.success('Track added successfully');
    } catch (error) {
      console.error('Error adding track:', error);
      set({ loading: false });
      toast.error('Failed to add track');
      throw error;
    }
  }
}));