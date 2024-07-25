const { SlashCommandBuilder } = require('discord.js');
const { player } = require('../../utils/player');
const { queue } = require('../../utils/queue');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leaves the voice channel.'),
  async execute(interaction) {
    const guildId = interaction.guild.id;

    if (!player.isPlaying(guildId)) {
      return interaction.reply({
        content: 'The player is not currently playing.',
        ephemeral: true,
      });
    }

    player.stop(guildId);
    queue.clear(guildId);
    interaction.member.voice.disconnect();

    await interaction.reply('Left the voice channel.');
  },
};