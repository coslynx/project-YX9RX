const { logger } = require('./logger');
const fetch = require('node-fetch');

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_API_URL = 'http://ws.audioscrobbler.com/2.0/';

module.exports = {
  /**
   * Fetches the artist information from Last.fm API.
   *
   * @param {string} artistName The name of the artist to search for.
   * @returns {Promise<Object>} A promise that resolves with the artist information or null if not found.
   */
  getArtistInfo: async (artistName) => {
    try {
      const response = await fetch(
        `${LASTFM_API_URL}?method=artist.getinfo&artist=${artistName}&api_key=${LASTFM_API_KEY}&format=json`
      );

      if (!response.ok) {
        throw new Error(`Last.fm API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      if (data.artist) {
        return data.artist;
      } else {
        logger.warn(`Artist not found on Last.fm: ${artistName}`);
        return null;
      }
    } catch (error) {
      logger.error(`Error fetching artist information from Last.fm: ${error.message}`);
      return null;
    }
  },

  /**
   * Fetches the top tracks of an artist from Last.fm API.
   *
   * @param {string} artistName The name of the artist.
   * @returns {Promise<Array<Object>>} A promise that resolves with an array of top tracks or null if not found.
   */
  getTopTracks: async (artistName) => {
    try {
      const response = await fetch(
        `${LASTFM_API_URL}?method=artist.gettoptracks&artist=${artistName}&api_key=${LASTFM_API_KEY}&format=json`
      );

      if (!response.ok) {
        throw new Error(`Last.fm API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      if (data.toptracks && data.toptracks.track) {
        return data.toptracks.track;
      } else {
        logger.warn(`Top tracks not found for artist: ${artistName}`);
        return null;
      }
    } catch (error) {
      logger.error(`Error fetching top tracks from Last.fm: ${error.message}`);
      return null;
    }
  },
};