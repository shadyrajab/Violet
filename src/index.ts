import { Client, Interaction } from 'discord.js';
import { DISCORD_TOKEN, SLASH_COMMANDS_DATA } from './core/constants';
import { onCommandInteraction } from './events/interactionCommand';

const client = new Client({ intents: ['GuildMessages'] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  client.application.commands.set(SLASH_COMMANDS_DATA);
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (interaction.isCommand()) {
    onCommandInteraction(interaction);
  }
});

client.login(DISCORD_TOKEN);
