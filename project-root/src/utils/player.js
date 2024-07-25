const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const { logger } = require('./logger');
const { queue } = require('./queue');
const { musicProvider } = require('./musicProvider');
const { lyrics } = require('./lyrics');
const ytdl = require('ytdl-core');
const prism = require('prism-media');
const { promisify } = require('util');
const { setTimeout } = require('timers');
const readdir = promisify(require('fs').readdir);
const fs = require('fs');
const ffmpeg = require('ffmpeg-static');

const players = new Map();

module.exports = {
  /**
   * Joins the specified voice channel.
   * 
   * @param {VoiceChannel} voiceChannel The voice channel to join.
   * @returns {Promise<void>} A promise that resolves when the bot has joined the voice channel.
   */
  joinVoiceChannel: async (voiceChannel) => {
    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      return connection;
    } catch (error) {
      logger.error(`Error joining voice channel: ${error.message}`);
    }
  },

  /**
   * Leaves the specified voice channel.
   * 
   * @param {VoiceChannel} voiceChannel The voice channel to leave.
   * @returns {Promise<void>} A promise that resolves when the bot has left the voice channel.
   */
  leaveVoiceChannel: async (voiceChannel) => {
    try {
      const connection = getVoiceConnection(voiceChannel.guild.id);
      if (connection) {
        connection.disconnect();
      }
    } catch (error) {
      logger.error(`Error leaving voice channel: ${error.message}`);
    }
  },

  /**
   * Plays the next song in the queue.
   * 
   * @param {string} guildId The ID of the Discord guild.
   * @returns {boolean} True if a song is playing, false otherwise.
   */
  play: async (guildId) => {
    const queueData = queue.getQueue(guildId);
    if (!queueData) {
      return false;
    }

    const currentSong = queueData.shift();
    queue.updateQueue(guildId, queueData);

    const player = players.get(guildId);
    if (player) {
      try {
        let stream;
        if (currentSong.url.startsWith('https://www.youtube.com')) {
          stream = await ytdl(currentSong.url, { filter: 'audioonly' });
        } else {
          stream = await ytdl(currentSong.url, { filter: 'audioonly' });
        }

        const resource = createAudioResource(stream, {
          inputType: stream.type === 'audio/mpeg' ? stream.type : 'pcm',
          inlineVolume: true,
        });

        resource.volume.setVolume(0.5); // Default volume

        const connection = getVoiceConnection(guildId);
        if (connection) {
          player.play(resource);

          // Update the current song in the queue
          queue.setCurrentSong(guildId, currentSong);

          // Display the currently playing song
          connection.state.subscription.player.on(AudioPlayerStatus.Playing, () => {
            queue.updateNowPlaying(guildId, currentSong);
          });

          // Handle player errors
          connection.state.subscription.player.on('error', (error) => {
            logger.error(`Error playing song: ${error.message}`);
            // Skip to the next song
            this.skip(guildId);
          });

          // Handle player finished
          connection.state.subscription.player.on(AudioPlayerStatus.Idle, async () => {
            // Handle player finished, and then play the next song
            const nextSong = queue.getCurrentSong(guildId);
            if (nextSong) {
              setTimeout(() => {
                this.play(guildId);
              }, 2000); // 2-second delay
            } else {
              logger.info(`No more songs in the queue.`);
              await this.leaveVoiceChannel(voiceChannel);
              return;
            }
          });
        }

        return true;
      } catch (error) {
        logger.error(`Error playing song: ${error.message}`);
        // Skip to the next song
        this.skip(guildId);
        return false;
      }
    } else {
      return false;
    }
  },

  /**
   * Stops the music player.
   * 
   * @param {string} guildId The ID of the Discord guild.
   * @returns {void}
   */
  stop: (guildId) => {
    const player = players.get(guildId);
    if (player) {
      player.stop();
      players.delete(guildId);
      queue.clear(guildId);
    }
  },

  /**
   * Pauses the music player.
   * 
   * @param {string} guildId The ID of the Discord guild.
   * @returns {void}
   */
  pause: (guildId) => {
    const player = players.get(guildId);
    if (player) {
      player.pause();
    }
  },

  /**
   * Resumes the music player.
   * 
   * @param {string} guildId The ID of the Discord guild.
   * @returns {void}
   */
  resume: (guildId) => {
    const player = players.get(guildId);
    if (player) {
      player.unpause();
    }
  },

  /**
   * Skips the current song in the queue.
   * 
   * @param {string} guildId The ID of the Discord guild.
   * @returns {boolean} True if a song was skipped, false otherwise.
   */
  skip: (guildId) => {
    const player = players.get(guildId);
    if (player) {
      player.stop();
      return true;
    }
    return false;
  },

  /**
   * Sets the volume of the music player.
   * 
   * @param {string} guildId The ID of the Discord guild.
   * @param {number} volume The volume level (0-1).
   * @returns {void}
   */
  setVolume: (guildId, volume) => {
    const player = players.get(guildId);
    if (player) {
      player.volume.setVolume(volume);
    }
  },

  /**
   * Checks if the music player is playing.
   * 
   * @param {string} guildId The ID of the Discord guild.
   * @returns {boolean} True if the music player is playing, false otherwise.
   */
  isPlaying: (guildId) => {
    const player = players.get(guildId);
    if (player) {
      return player.state.status === AudioPlayerStatus.Playing;
    }
    return false;
  },

  /**
   * Gets the current song being played.
   * 
   * @param {string} guildId The ID of the Discord guild.
   * @returns {Object} The current song object.
   */
  getCurrentSong: (guildId) => {
    return queue.getCurrentSong(guildId);
  },

  /**
   * Initializes the music player for a guild.
   * 
   * @param {string} guildId The ID of the Discord guild.
   * @returns {void}
   */
  initPlayer: (guildId) => {
    const player = createAudioPlayer();
    players.set(guildId, player);
  },
};