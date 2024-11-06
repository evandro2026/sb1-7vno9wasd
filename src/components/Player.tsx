import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import YouTube from 'react-youtube';
import { usePlayerStore } from '../store/playerStore';
import { toast } from 'react-hot-toast';

export function Player() {
  const { currentTrack, isPlaying, volume, togglePlay, setVolume, pause } = usePlayerStore();
  const [player, setPlayer] = useState<any>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    if (player && isPlayerReady) {
      try {
        if (isPlaying) {
          player.playVideo();
        } else {
          player.pauseVideo();
        }
        player.setVolume(volume);
      } catch (error) {
        console.error('YouTube player error:', error);
        toast.error('Playback error occurred');
        pause();
      }
    }
  }, [isPlaying, volume, player, isPlayerReady, pause]);

  const onReady = (event: any) => {
    console.log('YouTube player ready');
    setPlayer(event.target);
    setIsPlayerReady(true);
    event.target.setVolume(volume);
    if (isPlaying) {
      event.target.playVideo();
    }
  };

  const onError = (error: any) => {
    console.error('YouTube Player Error:', error);
    toast.error('Failed to load video. Please try again.');
    pause();
  };

  const onStateChange = (event: any) => {
    if (!player) return;

    switch (event.data) {
      case YouTube.PlayerState.ENDED:
        pause();
        break;
      case YouTube.PlayerState.PLAYING:
        console.log('Video playing');
        break;
      case YouTube.PlayerState.PAUSED:
        console.log('Video paused');
        break;
      case YouTube.PlayerState.BUFFERING:
        console.log('Video buffering');
        break;
      case YouTube.PlayerState.CUED:
        if (isPlaying) {
          player.playVideo();
        }
        break;
      default:
        break;
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={currentTrack.albumCover} 
            alt={currentTrack.title} 
            className="w-16 h-16 rounded"
          />
          <div>
            <h3 className="text-sm font-medium text-zinc-100">{currentTrack.title}</h3>
            <p className="text-xs text-zinc-400">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-6">
            <SkipBack className="w-4 h-4 text-zinc-200 cursor-pointer" />
            <button 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white hover:scale-105 transition-transform"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-black" />
              ) : (
                <Play className="w-4 h-4 text-black pl-1" />
              )}
            </button>
            <SkipForward className="w-4 h-4 text-zinc-200 cursor-pointer" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-zinc-200" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 accent-white"
          />
        </div>

        <YouTube
          videoId={currentTrack.youtubeId}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 1,
              controls: 0,
              disablekb: 1,
              fs: 0,
              iv_load_policy: 3,
              modestbranding: 1,
              origin: window.location.origin,
              enablejsapi: 1,
              rel: 0,
              showinfo: 0
            }
          }}
          onReady={onReady}
          onError={onError}
          onStateChange={onStateChange}
          className="hidden"
        />
      </div>
    </div>
  );
}