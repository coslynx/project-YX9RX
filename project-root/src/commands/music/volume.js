const { SlashCommandBuilder } = require('discord.js');
const { player } = require('../../utils/player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Adjusts the music player\'s volume.')
    .addIntegerOption(option =>
      option.setName('volume')
        .setDescription('The desired volume (0-100)')
        .setRequired(true)
    ),
  async execute(interaction) {
    const volume = interaction.options.getInteger('volume');

    if (volume < 0 || volume > 100) {
      return interaction.reply({
        content: 'Please enter a valid volume between 0 and 100.',
        ephemeral: true,
      });
    }

    player.setVolume(interaction.guild.id, volume / 100);

    await interaction.reply(`Volume set to ${volume}%`);
  },
};