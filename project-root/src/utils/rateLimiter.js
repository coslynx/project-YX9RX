const { Collection } = require('discord.js');
const { rateLimit } = require('./config');

const rateLimits = new Collection();

module.exports = (message) => {
  const guildId = message.guild.id;

  // Create a new rate limit entry for the guild if it doesn't exist
  if (!rateLimits.has(guildId)) {
    rateLimits.set(guildId, new Collection());
  }

  const guildRateLimits = rateLimits.get(guildId);

  // Check if the user has exceeded the rate limit
  if (guildRateLimits.has(message.author.id)) {
    const lastCommandTime = guildRateLimits.get(message.author.id);
    const timeSinceLastCommand = Date.now() - lastCommandTime;

    // Check if the time since the last command is less than the rate limit
    if (timeSinceLastCommand < rateLimit) {
      return true;
    }
  }

  // Update the last command time for the user
  guildRateLimits.set(message.author.id, Date.now());

  return false;
};