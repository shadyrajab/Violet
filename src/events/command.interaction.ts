import { CommandInteraction } from 'discord.js';
import { SLASH_COMMANDS } from '../core/constants';

export const onCommandInteraction = async (interaction: CommandInteraction) => {
  const command = SLASH_COMMANDS.find(
    (command) => command.data.name === interaction.commandName,
  );

  if (command) {
    await command.execute(interaction);
  }
};
