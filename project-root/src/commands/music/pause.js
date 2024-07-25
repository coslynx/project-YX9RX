const { SlashCommandBuilder } = require('discord.js');
const { player } = require('../../utils/player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the music player.'),
  async execute(interaction) {
    const guildId = interaction.guild.id;

    if (!player.isPlaying(guildId)) {
      return interaction.reply({
        content: 'The player is not playing.',
        ephemeral: true,
      });
    }

    player.pause(guildId);
    await interaction.reply('Paused the music player.');
  },
};