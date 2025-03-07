import 'reflect-metadata';

import { Client, Interaction } from 'discord.js';
import { onCommandInteraction } from '../events/command.interaction';
import { DISCORD_TOKEN, getSlashCommandsData } from '../core/constants';
import { onAutocompleteInteraction } from '../events/autocomplete.interaction';
import { initializeContainer } from './container-config';

async function startClient() {
  await initializeContainer();

  const client = new Client({ intents: ['GuildMessages'] });

  client.on('ready', async () => {
    console.log(
      `Logged in as ${client.user?.tag} with ${client.shard?.count} total shards`,
    );
    const commandsData = await getSlashCommandsData();
    await client.application.commands.set(commandsData);
  });

  client.on('interactionCreate', async (interaction: Interaction) => {
    if (interaction.isCommand()) {
      onCommandInteraction(interaction);
    }
    if (interaction.isAutocomplete()) {
      onAutocompleteInteraction(interaction);
    }
  });

  client.login(DISCORD_TOKEN);
}

startClient().catch(console.error);
