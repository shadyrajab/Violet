import { container } from 'tsyringe';
import { ISlashCommand } from '../../interfaces/command.interface';
import { Host } from '../../commands/cinema/host';
import { TheMovieDBService } from '../../services/players/theMovieDB.service';
import { SearchMovie } from '../../commands/cinema/search';
import { CinemaSetup } from '../../commands/cinema/setup';

container.registerSingleton<TheMovieDBService>(
  TheMovieDBService.name,
  TheMovieDBService,
);

container.registerSingleton<ISlashCommand>('ISlashCommand', Host);
container.registerSingleton<ISlashCommand>('ISlashCommand', SearchMovie);
container.registerSingleton<ISlashCommand>('ISlashCommand', CinemaSetup);

export { container };
