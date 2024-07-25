const { SlashCommandBuilder } = require('discord.js');
const { player } = require('../../utils/player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resumes the music player.'),
  async execute(interaction) {
    const guildId = interaction.guild.id;

    if (!player.isPlaying(guildId)) {
      return interaction.reply({
        content: 'The player is not paused.',
        ephemeral: true,
      });
    }

    player.resume(guildId);
    await interaction.reply('Resumed the music player.');
  },
};