const { InteractionType } = require('discord.js');
const { player } = require('../utils/player');
const { queue } = require('../utils/queue');
const { errorHandler } = require('../utils/errorHandler');

module.exports = {
  name: 'interactionCreate',
  once: false,
  async execute(interaction, client) {
    // If the interaction is not a chat input command, return
    if (!interaction.isChatInputCommand()) return;

    // Get the command from the client's command collection
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      // Execute the command
      await command.execute(interaction);
    } catch (error) {
      // Handle any errors during command execution
      errorHandler(error, interaction);
    }
  },
};