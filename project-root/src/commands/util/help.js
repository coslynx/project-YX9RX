const { SlashCommandBuilder } = require('discord.js');
const { commands } = require('../../utils/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows all available commands.'),
  async execute(interaction) {
    const commandList = commands.map(command => `\`/${command.name}\` - ${command.description}`).join('\n');

    await interaction.reply({
      content: `Here are all the available commands:\n\n${commandList}`,
      ephemeral: true,
    });
  },
};