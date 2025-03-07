import { inject, injectable } from 'tsyringe';
import { TheMovieDBService } from '../../services/players/theMovieDB.service';
import {
  ApplicationCommandOptionType,
  ChannelType,
  CommandInteraction,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
} from 'discord.js';
import {
  ICommandData,
  ISlashCommand,
} from '../../interfaces/command.interface';
import { HostParamsValidator } from '../../decorators/validators/cinema/host.command-validator';
import { HostValidatedParams } from '../../interfaces/command-params.interface';
import { GuildService } from '../../services/guild.service';
import { CommandError } from '../../errors/command.error';

@injectable()
export class Host implements ISlashCommand {
  constructor(
    @inject(TheMovieDBService.name)
    private theMovieDBService: TheMovieDBService,
    @inject(GuildService.name) private guildService: GuildService,
  ) {}

  public get data(): ICommandData {
    return {
      name: 'host',
      description: 'host command',
      permissions: {
        some: ['Administrator'],
      },
      category: 'cinema',
      options: [
        {
          name: 'movieid',
          description: 'The movie ID',
          type: ApplicationCommandOptionType.Number,
          required: true,
        },
        {
          name: 'startdate',
          description: 'The date on the format YYYY-MM-DD',
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
        {
          name: 'starttime',
          description: 'The time on the format HH:MM',
          type: ApplicationCommandOptionType.String,
          required: true,
          autocomplete: true,
        },
      ],
    };
  }

  @HostParamsValidator()
  public async execute(
    interaction: CommandInteraction,
    params: HostValidatedParams,
  ) {
    const { movieId, startDate } = params;
    const { guild, guildId } = interaction;
    const { posterPath, title, overview, runtime } =
      await this.theMovieDBService.getMovieById(movieId);

    const { cinemaCategoryId } = await this.guildService.getGuild(guildId);

    if (!cinemaCategoryId)
      throw new CommandError('Cinema not setup', interaction);

    const eventChannel = await guild.channels.create({
      name: title,
      type: ChannelType.GuildStageVoice,
      parent: cinemaCategoryId,
    });

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + runtime);

    await guild.scheduledEvents.create({
      name: title,
      privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
      scheduledStartTime: startDate,
      scheduledEndTime: endDate,
      entityType: GuildScheduledEventEntityType.StageInstance,
      image: this.theMovieDBService.tmdbImageCdnURL + posterPath,
      channel: eventChannel.id,
      description: overview,
      reason: 'Cinema Movie',
      entityMetadata: {
        location: `Hosted by ${interaction.user.username}`,
      },
    });
  }
}
