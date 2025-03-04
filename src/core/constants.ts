import { config } from 'dotenv';
// import { loadEmojis } from '../utils/loadEmojis';
import { container } from '../infrastructure/containers/container-config';
import { ISlashCommand } from '../interfaces/command.interface';

config();

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const THE_MOVIE_DB_API_KEY = process.env.THE_MOVIE_DB_API_KEY;
export const THE_MOVIE_DB_API_URL = process.env.THE_MOVIE_DB_API_URL;

export const SLASH_COMMANDS =
  container.resolveAll<ISlashCommand>('ISlashCommand');

export const SLASH_COMMANDS_DATA = SLASH_COMMANDS.map(
  (command) => command.commandData,
);

// export const APPLICATION_EMOJIS = loadEmojis();
