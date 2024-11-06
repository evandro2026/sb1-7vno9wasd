export const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const youtubePlayerConfig = {
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
  },
};