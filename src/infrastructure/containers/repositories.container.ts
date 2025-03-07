import { container } from 'tsyringe';
import { GuildRepository } from '../../repositories/guild.repository';
import { Connection } from '../../database/datasource';

export function registerRepositories() {
  container.registerSingleton<Connection>(Connection.name, Connection);
  container.registerSingleton<GuildRepository>(
    GuildRepository.name,
    GuildRepository,
  );
}
