import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import { ICommand } from '../interfaces/command.interface';

export const host: ICommand = {
  name: 'host',
  description: 'host command',
  category: 'cinema',
  options: [
    {
      name: 'movie',
      description: 'movie name',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'date',
      description: 'date',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: 'time',
      description: 'time',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  execute: async (interaction: CommandInteraction) => {},
};
