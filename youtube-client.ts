import { YouTubeMusicTrack } from "./types.ts";

export class YouTubeMusicClient {
    private headers: Record<string, string>;
  
    constructor(headers: Record<string, string>) {
      this.headers = headers;
    }
  
    async searchTrack(
      query: string,
    ): Promise<YouTubeMusicTrack | null> {
      const params = new URLSearchParams({
        q: query,
        type: "song",
        limit: "1",
      });
  
      const response = await fetch(
        `https://music.youtube.com/youtubei/v1/search?${params}`,
        {
          method: "POST",
          headers: this.headers,
          body: JSON.stringify({
            context: {
              client: {
                clientName: "WEB_REMIX",
                clientVersion: "1.20240201",
              },
            },
            query,
          }),
        },
      );
  
      if (!response.ok) {
        throw new Error(`Failed to search track: ${response.statusText}`);
      }
  
      const data = await response.json();
      const tracks = data.contents?.tabbedSearchResultsRenderer?.tabs[0]
        ?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]
        ?.musicShelfRenderer?.contents;
  
      if (!tracks?.length) return null;
  
      return {
        videoId: tracks[0].videoId,
        title: tracks[0].title.runs[0].text,
        artists: tracks[0].artists.map((artist: any) => ({
          name: artist.text,
        })),
      };
    }
  
    async createPlaylist(
      name: string,
      description: string,
      videoIds: string[],
    ): Promise<string> {
      const response = await fetch(
        "https://music.youtube.com/youtubei/v1/playlist/create",
        {
          method: "POST",
          headers: this.headers,
          body: JSON.stringify({
            context: {
              client: {
                clientName: "WEB_REMIX",
                clientVersion: "1.20240201",
              },
            },
            title: name,
            description: description,
            videoIds: videoIds,
          }),
        },
      );
  
      if (!response.ok) {
        throw new Error(`Failed to create playlist: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.playlistId;
    }
  }
  