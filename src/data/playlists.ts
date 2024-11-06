import { Playlist } from '../types/music';

export const playlists: Playlist[] = [
  {
    id: '1',
    name: 'Rock Classics',
    cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&auto=format&fit=crop&q=60',
    tracks: [
      {
        id: '1',
        title: 'Sweet Child O Mine',
        artist: 'Guns N Roses',
        youtubeId: '1w7OgIMMRc4',
        duration: '5:56',
        albumCover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&auto=format&fit=crop&q=60'
      },
      {
        id: '2',
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        youtubeId: 'fJ9rUzIMcZQ',
        duration: '5:59',
        albumCover: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: '2',
    name: 'Pop Hits',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
    tracks: [
      {
        id: '3',
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        youtubeId: 'JGwWNGJdvx8',
        duration: '4:23',
        albumCover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60'
      },
      {
        id: '4',
        title: 'Stay With Me',
        artist: 'Sam Smith',
        youtubeId: 'pB-5XG-DbAA',
        duration: '3:29',
        albumCover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=60'
      }
    ]
  }
];