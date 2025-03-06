import { inject, injectable } from 'tsyringe';
import { GuildService } from '../../services/guild.service';
import { ICommandData } from '../../interfaces/command.interface';
import { ChannelType, CommandInteraction } from 'discord.js';
import { CommandError } from '../../errors/command.error';

@injectable()
export class CinemaSetup {
  constructor(@inject(GuildService.name) private guildService: GuildService) {}

  public get data(): ICommandData {
    return {
      name: 'cinema',
      description: 'Configure the Cinema',
      category: 'cinema',
    };
  }

  public async execute(interaction: CommandInteraction) {
    const { guildId, guild } = interaction;
    const { cinemaSetupId, cinemaCategoryId } =
      await this.guildService.getGuild(guildId);

    if (cinemaSetupId && cinemaCategoryId) throw new CommandError('Cinema already setup', interaction);

    const category = await guild?.channels.create({
      name: 'CINEMA',
      type: ChannelType.GuildCategory,
    });

    const channel = await guild?.channels.create({
      name: 'CINEMA',
      type: ChannelType.GuildText,
      parent: category?.id,
    });

    await this.guildService.setupCinema(guildId, category.id, channel.id);
  }
}
