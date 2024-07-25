const { SlashCommandBuilder } = require('discord.js');
const { player } = require('../../utils/player');
const { queue } = require('../../utils/queue');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current song.'),
  async execute(interaction) {
    const guildId = interaction.guild.id;

    if (!player.isPlaying(guildId)) {
      return interaction.reply({
        content: 'There is no song currently playing.',
        ephemeral: true,
      });
    }

    const success = player.skip(guildId);

    if (success) {
      await interaction.reply('Skipped the current song.');
    } else {
      await interaction.reply('There are no more songs in the queue.');
    }
  },
};