import { inject, injectable } from 'tsyringe';
import { MongoRepository } from 'typeorm';
import { GuildEntity } from '../database/entities/guild.entity';
import { Connection } from '../database/datasource';

injectable();
export class GuildRepository {
  private guildRepository: MongoRepository<GuildEntity>;
  constructor(@inject(Connection.name) private connection: Connection) {
    this.guildRepository = this.connection.guildRepository;
  }

  async getGuild(guildId: string): Promise<GuildEntity> {
    return this.guildRepository.findOneBy({ guildId });
  }

  async updateGuild(guildId: string, data: Partial<GuildEntity>) {
    await this.guildRepository.update({ guildId }, data);
  }
}
