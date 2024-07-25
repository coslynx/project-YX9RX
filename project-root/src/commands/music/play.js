const { SlashCommandBuilder } = require('discord.js');
const { player } = require('../../utils/player');
const { queue } = require('../../utils/queue');
const { youtube } = require('../../utils/youtube');
const { spotify } = require('../../utils/spotify');
const { soundcloud } = require('../../utils/soundcloud');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song from YouTube, Spotify, or SoundCloud.')
    .addStringOption(option =>
      option.setName('song')
        .setDescription('The song name or URL to play')
        .setRequired(true)
    ),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const songQuery = interaction.options.getString('song');

    let songInfo;

    // Check if the song query is a valid URL
    if (songQuery.startsWith('https://')) {
      if (songQuery.includes('youtube.com')) {
        songInfo = await youtube.getVideoInfo(songQuery);
      } else if (songQuery.includes('spotify.com')) {
        songInfo = await spotify.getTrackInfo(songQuery);
      } else if (songQuery.includes('soundcloud.com')) {
        songInfo = await soundcloud.getTrackInfo(songQuery);
      } else {
        return interaction.reply({
          content: 'Invalid song URL.',
          ephemeral: true,
        });
      }
    } else {
      // Search for a song on YouTube if it's not a URL
      songInfo = await youtube.searchVideo(songQuery);
    }

    if (songInfo) {
      // Add the song to the queue
      queue.add(guildId, {
        title: songInfo.title,
        url: songInfo.url,
        duration: songInfo.duration,
        thumbnail: songInfo.thumbnail,
      });

      // Start the player if it's not already running
      if (!player.isPlaying(guildId)) {
        player.play(guildId);
      }

      await interaction.reply(`Queued **${songInfo.title}**`);
    } else {
      await interaction.reply({
        content: 'Could not find a song matching your query.',
        ephemeral: true,
      });
    }
  },
};