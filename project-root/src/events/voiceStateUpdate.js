const { player } = require('../utils/player');
const { queue } = require('../utils/queue');

module.exports = {
  name: 'voiceStateUpdate',
  once: false,
  async execute(oldState, newState, client) {
    const guildId = oldState.guild.id;

    // If the bot is not in a voice channel, return
    if (!newState.member.voice.channel) return;

    // If the user joins a voice channel
    if (newState.member.voice.channel && !oldState.member.voice.channel) {
      // If there are no songs in the queue, return
      if (!queue.getQueue(guildId)) return;

      // Join the user's voice channel
      try {
        await player.joinVoiceChannel(newState.member.voice.channel);
        // Start playing if the player is not already playing
        if (!player.isPlaying(guildId)) player.play(guildId);
      } catch (error) {
        console.error(`Error joining voice channel: ${error}`);
      }
    }

    // If the user leaves a voice channel
    if (!newState.member.voice.channel && oldState.member.voice.channel) {
      // If the bot is the only member left in the voice channel, leave
      if (newState.member.voice.channel.members.size === 1 && newState.member.user.bot) {
        try {
          await player.leaveVoiceChannel(newState.member.voice.channel);
          player.stop(guildId);
          queue.clear(guildId);
        } catch (error) {
          console.error(`Error leaving voice channel: ${error}`);
        }
      }
    }
  },
};