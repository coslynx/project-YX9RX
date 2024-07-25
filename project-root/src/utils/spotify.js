const { logger } = require('./logger');
const fetch = require('node-fetch');

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

const getAccessToken = async () => {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString(
            'base64'
          ),
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(
        `Spotify API request failed with status: ${response.status}`
      );
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    logger.error(`Error getting Spotify access token: ${error.message}`);
    return null;
  }
};

module.exports = {
  /**
   * Fetches track information from Spotify API.
   *
   * @param {string} trackUrl The URL of the Spotify track.
   * @returns {Promise<Object>} A promise that resolves with track information or null if not found.
   */
  getTrackInfo: async (trackUrl) => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        return null;
      }

      const response = await fetch(
        `${SPOTIFY_API_URL}/tracks/${trackUrl.split('/').pop()}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Spotify API request failed with status: ${response.status}`
        );
      }

      const data = await response.json();
      return {
        title: data.name,
        url: data.external_urls.spotify,
        duration: data.duration_ms,
        thumbnail: data.album.images[0].url,
      };
    } catch (error) {
      logger.error(`Error fetching track information from Spotify: ${error.message}`);
      return null;
    }
  },
};