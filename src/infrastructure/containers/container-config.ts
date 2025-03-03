import { container } from 'tsyringe';
import { ISlashCommand } from '../../interfaces/command.interface';
import { Host } from '../../commands/cinema/host';
import { TheMovieDBService } from '../../services/theMovieDB.service';
import { SearchMovie } from '../../commands/cinema/search';

container.registerSingleton<TheMovieDBService>(
  TheMovieDBService.name,
  TheMovieDBService,
);

container.registerSingleton<ISlashCommand>('ISlashCommand', Host);
container.registerSingleton<ISlashCommand>('ISlashCommand', SearchMovie);

export { container };
