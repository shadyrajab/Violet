import { DataSource, MongoRepository } from 'typeorm';
import { GuildEntity } from './entities/guild.entity';
import { injectable } from 'tsyringe';
import { MONGODB_URI, DB_NAME } from '../core/constants';

@injectable()
export class Connection {
  public dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: 'mongodb',
      url: MONGODB_URI,
      database: DB_NAME,
      synchronize: true,
      logging: true,
      entities: [GuildEntity],
    });
  }

  public get guildRepository(): MongoRepository<GuildEntity> {
    return this.dataSource.getMongoRepository(GuildEntity);
  }
}
