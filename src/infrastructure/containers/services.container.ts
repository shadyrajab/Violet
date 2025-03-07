import { container } from 'tsyringe';
import { TheMovieDBService } from '../../services/players/theMovieDB.service';
import { GuildService } from '../../services/guild.service';

export function registerServices() {
  container.registerSingleton<TheMovieDBService>(
    TheMovieDBService.name,
    TheMovieDBService,
  );
  container.registerSingleton<GuildService>(GuildService.name, GuildService);
}
