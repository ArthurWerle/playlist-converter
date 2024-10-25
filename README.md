# Convert playlists from Spotify to Youtube Music


## built with Deno 2


-> make sure to add your .env file with
    ```
    SPOTIFY_CLIENT_ID=123
    SPOTIFY_CLIENT_SECRET=abc
    YT_MUSIC_AUTH=123
    ```

    `YT_MUSIC_AUTH` is a pain to get....
    - Go to music.youtube.com and make sure you're logged in
    - Open Developer Tools (F12 or right-click -> Inspect)
    - Go to the Network tab
    - Filter for 'browse' or 'next' requests
    - Click on any of these requests
    - In the request headers, look for the 'Authorization' header
    - The value will start with "SAPISIDHASH" - this is your YT_MUSIC_AUTH token

-> make sure to run using `deno run --allow-net --allow-env --allow-read main.ts`