import 'reflect-metadata';

import { Client, Interaction } from 'discord.js';
import { onCommandInteraction } from '../events/interactionCommand';
import { DISCORD_TOKEN, SLASH_COMMANDS_DATA } from '../core/constants';

const client = new Client({ intents: ['GuildMessages'] });

client.on('ready', () => {
  console.log(
    `Logged in as ${client.user?.tag} with ${client.shard?.count} total shards`,
  );
  client.application.commands.set(SLASH_COMMANDS_DATA);
});

client.on('interactionCreate', async (interaction: Interaction) => {
  if (interaction.isCommand()) {
    onCommandInteraction(interaction);
  }
});

client.login(DISCORD_TOKEN);
