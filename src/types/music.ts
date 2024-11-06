export interface Track {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  duration: string;
  albumCover: string;
}

export interface Playlist {
  id: string;
  name: string;
  cover: string;
  tracks: Track[];
  username: string;
}