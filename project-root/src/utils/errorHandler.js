const { logger } = require('./logger');

module.exports = (error, interaction) => {
  logger.error(`An error occurred: ${error.message}`);
  logger.error(error.stack);

  if (interaction) {
    // Handle errors in interactions (slash commands)
    interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
  } else {
    // Handle errors in messages (prefix commands)
    interaction.channel.send('An error occurred while executing the command.');
  }
};