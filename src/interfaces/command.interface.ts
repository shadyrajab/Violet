import {
  ApplicationCommandDataResolvable,
  ApplicationCommandOptionData,
  CommandInteraction,
} from 'discord.js';
import { CommandValidator } from './command-params.interface';

export interface ICommand {
  name: string;
  description: string;
  options?: ApplicationCommandOptionData[];
  category?: string;
  execute(interaction: CommandInteraction): Promise<void>;
}

export interface CommandRegistration {
  name: string;
  category: string;
  execute: (interaction: CommandInteraction) => Promise<void>;
  data: ApplicationCommandDataResolvable;
}

export interface CommandPermissions {
  some?: string[];
  all?: string[];
  none?: string[];
}

export interface ICommandData {
  name: string;
  description: string;
  permissions?: CommandPermissions;
  options?: ApplicationCommandOptionData[];
  category?: string;
}

export interface ISlashCommand {
  execute(
    interaction: CommandInteraction,
    params?: CommandValidator,
  ): Promise<void>;
  readonly data: ICommandData;
}
