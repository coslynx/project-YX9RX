const { SlashCommandBuilder } = require('discord.js');
const { player } = require('../../utils/player');
const { queue } = require('../../utils/queue');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops the music player and clears the queue.'),
  async execute(interaction) {
    const guildId = interaction.guild.id;

    if (!player.isPlaying(guildId)) {
      return interaction.reply({
        content: 'The player is not playing.',
        ephemeral: true,
      });
    }

    player.stop(guildId);
    queue.clear(guildId);
    await interaction.reply('Stopped the music player and cleared the queue.');
  },
};