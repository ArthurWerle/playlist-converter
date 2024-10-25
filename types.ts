export interface SpotifyConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  }
  
  export interface SpotifyTrack {
    name: string;
    artists: Array<{ name: string }>;
    album: { name: string };
    duration_ms: number;
  }
  
  export interface SpotifyPlaylist {
    name: string;
    tracks: {
      items: Array<{ track: SpotifyTrack }>;
      next: string | null;
    };
  }
  
  export interface YouTubeMusicTrack {
    videoId: string;
    title: string;
    artists: Array<{ name: string }>;
  }
  
  export interface YouTubeMusicPlaylist {
    playlistId: string;
    tracks: string[];
  }