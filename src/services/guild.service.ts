import { inject, injectable } from 'tsyringe';
import { GuildRepository } from '../repositories/guild.repository';
import { GuildEntity } from '../database/entities/guild.entity';

@injectable()
export class GuildService {
  constructor(
    @inject(GuildRepository.name) private guildRepository: GuildRepository,
  ) {}

  async getGuild(guildId: string): Promise<GuildEntity> {
    return this.guildRepository.getGuild(guildId);
  }

  async setupCinema(guildId: string, trSetupId: string, cinemaSetupId: string) {
    await this.guildRepository.updateGuild(guildId, {
      trSetupId,
      cinemaSetupId,
    });
  }
}
