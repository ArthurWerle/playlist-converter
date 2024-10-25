import { SpotifyClient } from "./spotify-client.ts"
import { SpotifyConfig } from "./types.ts"
import { YouTubeMusicClient } from "./youtube-client.ts"

export class PlaylistConverter {
    private spotifyClient: SpotifyClient;
    private ytMusicClient: YouTubeMusicClient;
  
    constructor(
      spotifyConfig: SpotifyConfig,
      ytMusicHeaders: Record<string, string>,
    ) {
      this.spotifyClient = new SpotifyClient(spotifyConfig);
      this.ytMusicClient = new YouTubeMusicClient(ytMusicHeaders);
    }
  
    async convertPlaylist(
      spotifyPlaylistId: string,
      newPlaylistName?: string,
    ): Promise<string> {
      // Get Spotify playlist details
      const playlist = await this.spotifyClient.getPlaylist(spotifyPlaylistId);
      const playlistName = newPlaylistName || `${playlist.name} (from Spotify)`;
  
      console.log(`Fetching tracks from Spotify playlist: ${playlistName}`);
      const tracks = await this.spotifyClient.getAllPlaylistTracks(spotifyPlaylistId);
  
      // Find matching videos on YouTube Music
      console.log("Searching for tracks on YouTube Music...");
      const videoIds: string[] = [];
  
      for (const [i, track] of tracks.entries()) {
        const query = `${track.name} ${track.artists[0].name}`;
        console.log(
          `Processing track ${i + 1}/${tracks.length}: ${track.name}`,
        );
  
        try {
          const ytTrack = await this.ytMusicClient.searchTrack(query);
          if (ytTrack?.videoId) {
            videoIds.push(ytTrack.videoId);
          } else {
            console.log(
              `Could not find match for: ${track.name} by ${
                track.artists[0].name
              }`,
            );
          }
        } catch (error: any) {
          console.error(
            `Error searching for track ${track.name}: ${error.message}`,
          );
        }
  
        // Add a small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
  
      // Create new YouTube Music playlist
      console.log("Creating YouTube Music playlist...");
      const playlistId = await this.ytMusicClient.createPlaylist(
        playlistName,
        `Converted from Spotify playlist: ${playlist.name}`,
        videoIds,
      );
  
      console.log(
        `Conversion complete! Found ${videoIds.length}/${tracks.length} tracks.`,
      );
      return playlistId;
    }
  }