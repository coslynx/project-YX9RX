const { logger } = require('./logger');
const lyricsFinder = require('lyrics-finder');
const genius = require('genius-lyrics-api');
const Genius = new genius.Client(process.env.GENIUS_API_KEY);

module.exports = async (songTitle, artistName) => {
  try {
    // Try finding lyrics using lyrics-finder
    let lyrics = await lyricsFinder(songTitle, artistName);
    if (lyrics) {
      return lyrics;
    }

    // If lyrics-finder fails, try using Genius API
    const geniusResults = await Genius.search(songTitle);
    if (geniusResults) {
      const song = geniusResults.hits[0].result;
      if (song) {
        lyrics = await Genius.lyrics(song.id);
        return lyrics;
      }
    }

    // If both lyrics-finder and Genius fail, return null
    return null;
  } catch (error) {
    logger.error(`Error fetching lyrics: ${error.message}`);
    return null;
  }
};