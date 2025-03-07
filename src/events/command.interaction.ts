import { CommandInteraction } from 'discord.js';
import { getSlashCommands } from '../core/constants';

export const onCommandInteraction = async (interaction: CommandInteraction) => {
  const slashCommands = await getSlashCommands();
  const command = slashCommands.find(
    (command) => command.data.name === interaction.commandName,
  );

  if (command) {
    await command.execute(interaction);
  }
};
