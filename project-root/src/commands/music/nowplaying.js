const { SlashCommandBuilder } = require('discord.js');
const { player } = require('../../utils/player');
const { queue } = require('../../utils/queue');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Displays the currently playing song.'),
  async execute(interaction) {
    const currentSong = queue.getCurrentSong(interaction.guild.id);

    if (!currentSong) {
      return interaction.reply({
        content: 'There is no song currently playing.',
        ephemeral: true,
      });
    }

    const nowPlayingEmbed = new EmbedBuilder()
      .setTitle('Now Playing')
      .setDescription(`[${currentSong.title}](${currentSong.url})`)
      .setColor('#45f975')
      .setThumbnail(currentSong.thumbnail);

    interaction.reply({ embeds: [nowPlayingEmbed] });
  },
};