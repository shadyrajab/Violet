import { container } from 'tsyringe';
import { ISlashCommand } from '../../interfaces/command.interface';
import { Host } from '../../commands/cinema/host';
import { SearchMovie } from '../../commands/cinema/search';
import { CinemaSetup } from '../../commands/cinema/setup';

export function registerCommands() {
  container.registerSingleton<ISlashCommand>('ISlashCommand', Host);
  container.registerSingleton<ISlashCommand>('ISlashCommand', SearchMovie);
  container.registerSingleton<ISlashCommand>('ISlashCommand', CinemaSetup);
}
