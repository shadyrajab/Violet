import { config } from 'dotenv';
import { loadCommands } from '../utils/loadCommands';
// import { loadEmojis } from '../utils/loadEmojis';

config();

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const THE_MOVIE_DB_API_KEY = process.env.THE_MOVIE_DB_API_KEY;
export const THE_MOVIE_DB_API_URL = process.env.THE_MOVIE_DB_API_URL;

export const SLASH_COMMANDS = loadCommands();
export const SLASH_COMMANDS_DATA = SLASH_COMMANDS.map(
  (command) => command.data,
);

// export const APPLICATION_EMOJIS = loadEmojis();
