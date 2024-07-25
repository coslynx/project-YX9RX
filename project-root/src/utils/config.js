require('dotenv').config();

const { SlashCommandBuilder } = require('discord.js');
const { logger } = require('./logger');

const commands = [
  require('../commands/music/play.js'),
  require('../commands/music/queue.js'),
  require('../commands/music/skip.js'),
  require('../commands/music/stop.js'),
  require('../commands/music/pause.js'),
  require('../commands/music/resume.js'),
  require('../commands/music/volume.js'),
  require('../commands/music/nowplaying.js'),
  require('../commands/util/help.js'),
  require('../commands/util/ping.js'),
  require('../commands/moderation/leave.js'),
];

module.exports = {
  token: process.env.DISCORD_BOT_TOKEN,
  rateLimit: 3000, // 3 seconds
  commands,
};