const { logger } = require('./logger');
const fetch = require('node-fetch');

const SOUNDCLOUD_CLIENT_ID = process.env.SOUNDCLOUD_CLIENT_ID;
const SOUNDCLOUD_CLIENT_SECRET = process.env.SOUNDCLOUD_CLIENT_SECRET;
const SOUNDCLOUD_API_URL = 'https://api.soundcloud.com';

module.exports = {
  /**
   * Fetches track information from SoundCloud API.
   *
   * @param {string} trackUrl The URL of the SoundCloud track.
   * @returns {Promise<Object>} A promise that resolves with track information or null if not found.
   */
  getTrackInfo: async (trackUrl) => {
    try {
      const response = await fetch(
        `${SOUNDCLOUD_API_URL}/resolve?url=${trackUrl}&client_id=${SOUNDCLOUD_CLIENT_ID}`
      );

      if (!response.ok) {
        throw new Error(`SoundCloud API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      if (data.kind === 'track') {
        return {
          title: data.title,
          url: data.permalink_url,
          duration: data.duration,
          thumbnail: data.artwork_url,
        };
      } else {
        logger.warn(`Track not found on SoundCloud: ${trackUrl}`);
        return null;
      }
    } catch (error) {
      logger.error(`Error fetching track information from SoundCloud: ${error.message}`);
      return null;
    }
  },
};