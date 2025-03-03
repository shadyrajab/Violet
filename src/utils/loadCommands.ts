import { readdirSync } from 'fs';
import { join } from 'path';
import { CommandRegistration, ICommand } from '../interfaces/command.interface';

export const loadCommands = (): CommandRegistration[] => {
  const commandFiles = readdirSync(join(__dirname, '../commands')).filter(
    (file) => file.endsWith('.js'),
  );

  const commands = commandFiles.map((file) => {
    const command = require(`../commands/${file}`) as {
      [key: string]: ICommand;
    };
    const commandName = Object.keys(command)[0];
    const { execute, category, ...commandData } = command[commandName];

    return {
      name: commandName,
      category: category,
      execute: execute,
      data: commandData,
    };
  });

  return commands;
};
