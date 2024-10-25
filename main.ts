import { PlaylistConverter } from "./converter.ts";
import { load } from "./deps.ts";
import { SpotifyConfig } from "./types.ts";

async function main() {
  // TODO: load environment variables
  await load({ export: true });

  const spotifyConfig: SpotifyConfig = {
    clientId: Deno.env.get("SPOTIFY_CLIENT_ID") || "",  
    clientSecret: Deno.env.get("SPOTIFY_CLIENT_SECRET") || "",
    redirectUri: "http://localhost:8888/callback",
  };


  const ytMusicHeaders = {
    "Authorization": Deno.env.get("YT_MUSIC_AUTH") || "",
    "Content-Type": "application/json",
  };

  if (!spotifyConfig.clientId || !spotifyConfig.clientSecret || !ytMusicHeaders.Authorization) {
    console.error("Missing required environment variables!");
    Deno.exit(1);
  }

  const playlistId = prompt("Enter Spotify playlist ID: ");
  const newName = prompt("Enter new playlist name (or press Enter to use default): ");

  if (!playlistId) {
    console.error("Playlist ID is required!");
    Deno.exit(1);
  }

  const converter = new PlaylistConverter(spotifyConfig, ytMusicHeaders);
  
  try {
    const ytPlaylistId = await converter.convertPlaylist(
      playlistId as string,
      newName?.trim() || undefined,
    );
    console.log(`Success! New YouTube Music playlist ID: ${ytPlaylistId}`);
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
  }
}

if (import.meta.main) {
  main();
}