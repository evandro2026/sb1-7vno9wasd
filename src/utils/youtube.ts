import { extractYouTubeId } from './youtubeUtils';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export async function getYoutubeVideoDetails(url: string) {
  if (!url) {
    throw new Error('URL is required');
  }

  const videoId = extractYouTubeId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key is not configured');
  }

  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch video details: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.items?.length) {
      throw new Error('Video not found or is unavailable');
    }

    const { snippet, contentDetails } = data.items[0];
    if (!snippet || !contentDetails) {
      throw new Error('Invalid video data received from YouTube');
    }

    return {
      title: snippet.title,
      artist: snippet.channelTitle,
      youtubeId: videoId,
      duration: formatDuration(contentDetails.duration),
      albumCover: snippet.thumbnails.maxres?.url || 
                 snippet.thumbnails.high?.url || 
                 snippet.thumbnails.default?.url,
    };
  } catch (error) {
    console.error('YouTube API error:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch video details');
  }
}

function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';

  const [, hours, minutes, seconds] = match;
  const h = hours ? parseInt(hours) : 0;
  const m = minutes ? parseInt(minutes) : 0;
  const s = seconds ? parseInt(seconds) : 0;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  
  return `${m}:${String(s).padStart(2, '0')}`;
}