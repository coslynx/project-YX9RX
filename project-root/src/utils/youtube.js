const { logger } = require('./logger');
const ytsr = require('ytsr');
const ytdl = require('ytdl-core');
const fetch = require('node-fetch');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

module.exports = {
  /**
   * Searches for a YouTube video based on the provided query.
   *
   * @param {string} query The search query.
   * @returns {Promise<Object>} A promise that resolves with the video information or null if not found.
   */
  searchVideo: async (query) => {
    try {
      const searchResults = await ytsr(query, { limit: 1 });
      if (searchResults.items.length > 0) {
        const video = searchResults.items[0];
        return {
          title: video.title,
          url: video.url,
          duration: video.duration,
          thumbnail: video.thumbnail,
        };
      } else {
        logger.warn(`Video not found on YouTube: ${query}`);
        return null;
      }
    } catch (error) {
      logger.error(`Error searching YouTube: ${error.message}`);
      return null;
    }
  },

  /**
   * Retrieves information about a YouTube video from its URL.
   *
   * @param {string} videoUrl The URL of the YouTube video.
   * @returns {Promise<Object>} A promise that resolves with the video information or null if not found.
   */
  getVideoInfo: async (videoUrl) => {
    try {
      const videoId = videoUrl.split('v=')[1] || videoUrl.split('be/')[1];
      const response = await fetch(
        `${YOUTUBE_API_URL}/videos?part=snippet%2CcontentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      if (data.items.length > 0) {
        const video = data.items[0];
        return {
          title: video.snippet.title,
          url: video.id,
          duration: video.contentDetails.duration,
          thumbnail: video.snippet.thumbnails.default.url,
        };
      } else {
        logger.warn(`Video not found on YouTube: ${videoUrl}`);
        return null;
      }
    } catch (error) {
      logger.error(`Error fetching video information from YouTube: ${error.message}`);
      return null;
    }
  },

  /**
   * Gets the video stream for a given YouTube URL.
   *
   * @param {string} videoUrl The URL of the YouTube video.
   * @returns {Promise<Stream>} A promise that resolves with the video stream.
   */
  getVideoStream: async (videoUrl) => {
    try {
      const stream = ytdl(videoUrl, { filter: 'audioonly' });
      return stream;
    } catch (error) {
      logger.error(`Error getting video stream from YouTube: ${error.message}`);
      return null;
    }
  },
};