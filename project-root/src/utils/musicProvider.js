const { logger } = require('./logger');
const { queue } = require('./queue');
const { player } = require('./player');
const { youtube } = require('./youtube');
const { spotify } = require('./spotify');
const { soundcloud } = require('./soundcloud');

module.exports = {
  /**
   * Plays a song from YouTube, Spotify, or SoundCloud.
   *
   * @param {string} guildId The ID of the Discord guild.
   * @param {string} songQuery The song name or URL to play.
   * @returns {Promise<boolean>} A promise that resolves to true if the song was queued successfully, false otherwise.
   */
  play: async (guildId, songQuery) => {
    try {
      let songInfo;

      // Check if the song query is a valid URL
      if (songQuery.startsWith('https://')) {
        if (songQuery.includes('youtube.com')) {
          songInfo = await youtube.getVideoInfo(songQuery);
        } else if (songQuery.includes('spotify.com')) {
          songInfo = await spotify.getTrackInfo(songQuery);
        } else if (songQuery.includes('soundcloud.com')) {
          songInfo = await soundcloud.getTrackInfo(songQuery);
        } else {
          logger.warn(`Invalid song URL: ${songQuery}`);
          return false;
        }
      } else {
        // Search for a song on YouTube if it's not a URL
        songInfo = await youtube.searchVideo(songQuery);
      }

      if (songInfo) {
        // Add the song to the queue
        queue.add(guildId, {
          title: songInfo.title,
          url: songInfo.url,
          duration: songInfo.duration,
          thumbnail: songInfo.thumbnail,
        });

        // Start the player if it's not already running
        if (!player.isPlaying(guildId)) {
          player.play(guildId);
        }

        logger.info(`Queued song: ${songInfo.title}`);
        return true;
      } else {
        logger.warn(`Could not find a song matching query: ${songQuery}`);
        return false;
      }
    } catch (error) {
      logger.error(`Error playing song: ${error.message}`);
      return false;
    }
  },
};