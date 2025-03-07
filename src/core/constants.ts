import { config } from 'dotenv';
import { container } from '../infrastructure/container-config';
import { ISlashCommand } from '../interfaces/command.interface';

config();

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const MONGODB_URI = process.env.MONGODB_URI;
export const DB_NAME = process.env.DB_NAME;
export const THE_MOVIE_DB_API_KEY = process.env.THE_MOVIE_DB_API_KEY;
export const THE_MOVIE_DB_API_URL = process.env.THE_MOVIE_DB_API_URL;

export async function getSlashCommands() {
  return container.resolveAll<ISlashCommand>('ISlashCommand');
}

export async function getSlashCommandsData() {
  const commands = await getSlashCommands();
  return commands.map((command) => command.data);
}
