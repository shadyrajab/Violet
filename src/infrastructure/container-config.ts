import { container } from 'tsyringe';
import { registerCommands } from './containers/commands.container';
import { registerServices } from './containers/services.container';
import { registerRepositories } from './containers/repositories.container';
import { Connection } from '../database/datasource';

export async function initializeContainer() {
  registerRepositories();

  const connection = container.resolve<Connection>(Connection.name);
  await connection.initialize();

  registerServices();
  registerCommands();

  return container;
}

export { container };
