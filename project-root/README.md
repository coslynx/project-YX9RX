# Discord Music Bot

This project aims to create a Discord bot that allows users to play music directly within Discord servers, enhancing server interactions and providing an easy way for users to listen to music together.

## Features

* **Music Playback:** Play songs from YouTube, Spotify, and SoundCloud.
* **Queue Management:** Add, remove, and manage songs in the queue.
* **Control Commands:** Skip, pause, resume, and stop playback.
* **Volume Control:** Adjust the playback volume.
* **Now Playing:** Display the currently playing song.
* **Help Command:** Provide information about available commands.
* **Moderation:**  Admins can restrict music commands to specific roles or channels.

## Tech Stack

* **Programming Language:** JavaScript (Node.js)
* **Framework:** Discord.js
* **Database:** SQLite3
* **Packages:**
  * discord.js
  * ytdl-core
  * node-fetch
  * dotenv
  * ytsr
  * spotify-web-api-node
  * soundcloud-api
  * genius-lyrics-api
  * lyrics-finder
  * promise-retry
  * moment
  * chalk
  * nodemon
  * ffmpeg-static
  * prism-media
* **APIs:**
  * Discord API
  * YouTube Data API v3
  * Spotify API
  * SoundCloud API
  * Genius API

## File Structure

```
project-root
├── src
│   ├── commands
│   │   ├── music
│   │   │   ├── play.js
│   │   │   ├── queue.js
│   │   │   ├── skip.js
│   │   │   ├── stop.js
│   │   │   ├── pause.js
│   │   │   ├── resume.js
│   │   │   ├── volume.js
│   │   │   └── nowplaying.js
│   │   ├── util
│   │   │   ├── help.js
│   │   │   └── ping.js
│   │   └── moderation
│   │       └── leave.js
│   ├── events
│   │   ├── ready.js
│   │   ├── messageCreate.js
│   │   ├── voiceStateUpdate.js
│   │   └── interactionCreate.js
│   ├── utils
│   │   ├── logger.js
│   │   ├── config.js
│   │   ├── database.js
│   │   ├── player.js
│   │   ├── musicProvider.js
│   │   ├── youtube.js
│   │   ├── spotify.js
│   │   ├── soundcloud.js
│   │   ├── lastfm.js
│   │   ├── lyrics.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   └── index.js
├── .env
└── README.md
```

## Installation

1. Clone this repository.
2. Install dependencies: `npm install`
3. Create a `.env` file in the project root and add your bot token: `DISCORD_BOT_TOKEN=your_bot_token`
4. Run the bot: `npm start`

## Usage

* **Join a voice channel:** The bot needs to be in a voice channel to play music.
* **Use commands:** Use the following commands to control the bot:
    * **!play [song name/URL]** - Plays a song from YouTube, Spotify, or SoundCloud.
    * **!queue** - Displays the current music queue.
    * **!skip** - Skips the current song.
    * **!stop** - Stops playback and clears the queue.
    * **!pause** - Pauses playback.
    * **!resume** - Resumes playback.
    * **!volume [volume]** - Adjusts the playback volume (0-100).
    * **!nowplaying** - Displays the currently playing song.
    * **!help** - Displays a list of available commands.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.