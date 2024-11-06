import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Playlist } from '../types/music';

interface UseUserPlaylistsReturn {
  playlists: Playlist[];
  loading: boolean;
  error: string | null;
}

export function useUserPlaylists(): UseUserPlaylistsReturn {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPlaylists([]);
      setLoading(false);
      return;
    }

    const playlistsRef = ref(db, 'playlists');
    
    try {
      const unsubscribe = onValue(playlistsRef, (snapshot) => {
        try {
          const data = snapshot.val() || {};
          
          // Filter playlists for current user and format data
          const userPlaylists = Object.entries(data)
            .filter(([_, playlist]: [string, any]) => playlist.userId === user.uid)
            .map(([id, data]: [string, any]) => ({
              id,
              name: data.name,
              cover: data.cover,
              tracks: data.tracks ? Object.values(data.tracks) : [],
              userId: data.userId
            }));

          setPlaylists(userPlaylists);
          setError(null);
        } catch (err) {
          setError('Error loading playlists');
          console.error('Error processing playlists:', err);
        } finally {
          setLoading(false);
        }
      }, (err) => {
        setError('Failed to load playlists');
        setLoading(false);
        console.error('Firebase error:', err);
      });

      return () => unsubscribe();
    } catch (err) {
      setError('Failed to setup playlist listener');
      setLoading(false);
      console.error('Setup error:', err);
    }
  }, [user]);

  return { playlists, loading, error };
}