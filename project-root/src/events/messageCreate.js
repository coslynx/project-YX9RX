const { player } = require('../utils/player');
const { queue } = require('../utils/queue');
const { errorHandler } = require('../utils/errorHandler');
const { rateLimiter } = require('../utils/rateLimiter');

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(message, client) {
    if (message.author.bot) return;

    // Rate limiting
    if (rateLimiter(message)) {
      return message.reply('Please wait a few seconds before using this command again.');
    }

    // Parse command
    if (!message.content.startsWith('!')) return;
    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if (!command) return;

    try {
      await command.execute(message, args);
    } catch (error) {
      errorHandler(error, message);
    }
  },
};