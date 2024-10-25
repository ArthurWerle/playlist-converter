import { encodeBase64 } from "./deps.ts";
import { SpotifyConfig, SpotifyPlaylist, SpotifyTrack } from "./types.ts";

export class SpotifyClient {
    private accessToken: string | null = null;
    private config: SpotifyConfig;
  
    constructor(config: SpotifyConfig) {
      this.config = config;
    }
  
    private async getAccessToken(): Promise<string> {
      if (this.accessToken) return this.accessToken;
  
      const credentials = encodeBase64(
        `${this.config.clientId}:${this.config.clientSecret}`,
      );
  
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });
  
      const data = await response.json();
      this.accessToken = data.access_token;
      return this.accessToken || ``;
    }
  
    async getPlaylist(playlistId: string): Promise<SpotifyPlaylist> {
      const token = await this.getAccessToken();
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        },
      );
  
      if (!response.ok) {
        throw new Error(`Failed to fetch playlist: ${response.statusText}`);
      }
  
      return await response.json();
    }
  
    async getAllPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
      const tracks: SpotifyTrack[] = [];
      let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
      const token = await this.getAccessToken();
  
      while (url) {
        const response = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch tracks: ${response.statusText}`);
        }
  
        const data = await response.json();
        tracks.push(
          ...data.items
            .filter((item: { track: SpotifyTrack }) => item.track)
            .map((item: { track: SpotifyTrack }) => item.track),
        );
  
        url = data.next;
      }
  
      return tracks;
    }
  }