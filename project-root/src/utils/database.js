const sqlite3 = require('sqlite3').verbose();
const { logger } = require('./logger');

let db;

/**
 * Connects to the SQLite database.
 * 
 * @returns {Promise<void>} A promise that resolves when the database connection is established.
 */
const connectToDatabase = async () => {
  try {
    db = new sqlite3.Database('./database.sqlite');
    logger.info('Database connected!');

    // Create the music queue table if it doesn't exist
    await new Promise((resolve, reject) => {
      db.run(
        `CREATE TABLE IF NOT EXISTS music_queue (
          guildId TEXT PRIMARY KEY,
          queue TEXT
        )`,
        (err) => {
          if (err) {
            logger.error(`Error creating music queue table: ${err.message}`);
            reject(err);
          } else {
            logger.info('Music queue table created!');
            resolve();
          }
        }
      );
    });
  } catch (error) {
    logger.error(`Error connecting to database: ${error.message}`);
  }
};

/**
 * Gets the music queue for the specified guild.
 * 
 * @param {string} guildId The ID of the Discord guild.
 * @returns {Promise<Array<Object>>} A promise that resolves with the music queue data.
 */
const getQueue = async (guildId) => {
  try {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT queue FROM music_queue WHERE guildId = ?`,
        [guildId],
        (err, row) => {
          if (err) {
            logger.error(`Error getting music queue: ${err.message}`);
            reject(err);
          } else if (row) {
            resolve(JSON.parse(row.queue));
          } else {
            resolve([]);
          }
        }
      );
    });
  } catch (error) {
    logger.error(`Error getting music queue: ${error.message}`);
    return [];
  }
};

/**
 * Adds a song to the music queue for the specified guild.
 * 
 * @param {string} guildId The ID of the Discord guild.
 * @param {Object} song The song object to add to the queue.
 * @returns {Promise<void>} A promise that resolves when the song has been added to the queue.
 */
const add = async (guildId, song) => {
  try {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT queue FROM music_queue WHERE guildId = ?`,
        [guildId],
        (err, row) => {
          if (err) {
            logger.error(`Error getting music queue: ${err.message}`);
            reject(err);
          } else if (row) {
            const queueData = JSON.parse(row.queue);
            queueData.push(song);
            db.run(
              `UPDATE music_queue SET queue = ? WHERE guildId = ?`,
              [JSON.stringify(queueData), guildId],
              (err) => {
                if (err) {
                  logger.error(
                    `Error updating music queue: ${err.message}`
                  );
                  reject(err);
                } else {
                  resolve();
                }
              }
            );
          } else {
            db.run(
              `INSERT INTO music_queue (guildId, queue) VALUES (?, ?)`,
              [guildId, JSON.stringify([song])],
              (err) => {
                if (err) {
                  logger.error(
                    `Error inserting music queue: ${err.message}`
                  );
                  reject(err);
                } else {
                  resolve();
                }
              }
            );
          }
        }
      );
    });
  } catch (error) {
    logger.error(`Error adding song to queue: ${error.message}`);
  }
};

/**
 * Updates the music queue for the specified guild.
 * 
 * @param {string} guildId The ID of the Discord guild.
 * @param {Array<Object>} queueData The new queue data.
 * @returns {Promise<void>} A promise that resolves when the queue has been updated.
 */
const updateQueue = async (guildId, queueData) => {
  try {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE music_queue SET queue = ? WHERE guildId = ?`,
        [JSON.stringify(queueData), guildId],
        (err) => {
          if (err) {
            logger.error(`Error updating music queue: ${err.message}`);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  } catch (error) {
    logger.error(`Error updating music queue: ${error.message}`);
  }
};

/**
 * Clears the music queue for the specified guild.
 * 
 * @param {string} guildId The ID of the Discord guild.
 * @returns {Promise<void>} A promise that resolves when the queue has been cleared.
 */
const clear = async (guildId) => {
  try {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM music_queue WHERE guildId = ?`,
        [guildId],
        (err) => {
          if (err) {
            logger.error(`Error clearing music queue: ${err.message}`);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  } catch (error) {
    logger.error(`Error clearing music queue: ${error.message}`);
  }
};

/**
 * Sets the current song for the specified guild.
 * 
 * @param {string} guildId The ID of the Discord guild.
 * @param {Object} currentSong The current song object.
 * @returns {Promise<void>} A promise that resolves when the current song has been set.
 */
const setCurrentSong = async (guildId, currentSong) => {
  try {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE music_queue SET currentSong = ? WHERE guildId = ?`,
        [JSON.stringify(currentSong), guildId],
        (err) => {
          if (err) {
            logger.error(`Error setting current song: ${err.message}`);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  } catch (error) {
    logger.error(`Error setting current song: ${error.message}`);
  }
};

/**
 * Gets the current song for the specified guild.
 * 
 * @param {string} guildId The ID of the Discord guild.
 * @returns {Promise<Object>} A promise that resolves with the current song object.
 */
const getCurrentSong = async (guildId) => {
  try {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT currentSong FROM music_queue WHERE guildId = ?`,
        [guildId],
        (err, row) => {
          if (err) {
            logger.error(`Error getting current song: ${err.message}`);
            reject(err);
          } else if (row) {
            resolve(JSON.parse(row.currentSong));
          } else {
            resolve(null);
          }
        }
      );
    });
  } catch (error) {
    logger.error(`Error getting current song: ${error.message}`);
    return null;
  }
};

/**
 * Updates the now playing information for the specified guild.
 * 
 * @param {string} guildId The ID of the Discord guild.
 * @param {Object} currentSong The current song object.
 * @returns {Promise<void>} A promise that resolves when the now playing information has been updated.
 */
const updateNowPlaying = async (guildId, currentSong) => {
  try {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE music_queue SET nowPlaying = ? WHERE guildId = ?`,
        [JSON.stringify(currentSong), guildId],
        (err) => {
          if (err) {
            logger.error(`Error updating now playing: ${err.message}`);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  } catch (error) {
    logger.error(`Error updating now playing: ${error.message}`);
  }
};

module.exports = {
  connectToDatabase,
  getQueue,
  add,
  updateQueue,
  clear,
  setCurrentSong,
  getCurrentSong,
  updateNowPlaying,
};