const { player } = require('../utils/player');
const { queue } = require('../utils/queue');
const { logger } = require('../utils/logger');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    logger.info(`Logged in as ${client.user.tag}!`);

    // Load commands
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      client.commands.set(command.data.name, command);
    }

    // Set activity (optional)
    client.user.setActivity('music', { type: 'LISTENING' });
    
    // Database connection (optional)
    // connectToDatabase().then(() => {
    //   logger.info('Database connected!');
    // }).catch(error => {
    //   logger.error('Error connecting to database:', error);
    // });
  },
};