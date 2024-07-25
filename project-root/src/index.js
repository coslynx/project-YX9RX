const { Client, IntentsBitField, Collection } = require('discord.js');
const { token } = require('./utils/config');
const { logger } = require('./utils/logger');
const { connectToDatabase } = require('./utils/database');
const player = require('./utils/player');
const musicProvider = require('./utils/musicProvider');
const { errorHandler } = require('./utils/errorHandler');
const { rateLimiter } = require('./utils/rateLimiter');

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildVoiceStates, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });

client.commands = new Collection();
client.player = player;
client.musicProvider = musicProvider;

// Load commands
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Load events
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      errorHandler(error, interaction);
    }
  } else if (interaction.isButton()) {
    // Handle button interactions here
  } else if (interaction.isSelectMenu()) {
    // Handle select menu interactions here
  }
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // Rate limiting
  if (rateLimiter(message)) {
    return message.reply('Please wait a few seconds before using this command again.');
  }

  // Parse command
  if (!message.content.startsWith('!')) return;
  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    errorHandler(error, message);
  }
});

connectToDatabase().then(() => {
  client.login(token).catch(error => {
    logger.error('Error logging in:', error);
  });
});