import { create } from 'zustand';
import { Track } from '../types/music';

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  setTrack: (track: Track) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  pause: () => void;
  play: () => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 70,
  setTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume }),
  pause: () => set({ isPlaying: false }),
  play: () => set({ isPlaying: true }),
  reset: () => set({ currentTrack: null, isPlaying: false }),
}));