const { SlashCommandBuilder } = require('discord.js');
const { queue } = require('../../utils/queue');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Displays the current music queue'),
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const queueData = queue.getQueue(guildId);

    if (!queueData) {
      return interaction.reply({
        content: 'There are no songs in the queue.',
        ephemeral: true,
      });
    }

    const queueEmbed = new EmbedBuilder()
      .setTitle('Music Queue')
      .setDescription(
        queueData.map((song, index) => `${index + 1}. ${song.title}`).join('\n')
      )
      .setColor('#45f975');

    await interaction.reply({ embeds: [queueEmbed] });
  },
};