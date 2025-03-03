import { inject, injectable } from 'tsyringe';
import {
  ICommandData,
  ISlashCommand,
} from '../../interfaces/command.interface';
import { TheMovieDBService } from '../../services/theMovieDB.service';
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationEmoji,
  ButtonBuilder,
  ButtonStyle,
  Collection,
  CommandInteraction,
  EmbedBuilder,
  Interaction,
  InteractionCollector,
} from 'discord.js';
import { CountryWatchOptions } from '../../interfaces/theMovieDB/movie-providers.response';
import { Movie } from '../../interfaces/theMovieDB/search.response';

@injectable()
export class SearchMovie implements ISlashCommand {
  constructor(
    @inject(TheMovieDBService.name)
    private theMovieDBService: TheMovieDBService,
  ) {}

  public get commandData(): ICommandData {
    return {
      name: 'movie',
      description: 'movie command',
      category: 'cinema',
      options: [
        {
          name: 'movie',
          description: 'movie name',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    };
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const emojis = interaction.client.application.emojis.cache;
    console.log(interaction.client.application.emojis);
    const movieName = interaction.options.get('movie').value.toString();
    const movies = await this.theMovieDBService.searchMovie(movieName, 'BR');
    let currentMovieIndex = 0;
    let totalPages = movies.results.length;

    const embeds = await Promise.all(
      movies.results.map(
        async (movie) => await this.createMovieEmbed(movie, emojis),
      ),
    );

    const response = await interaction.reply({
      embeds: [embeds[currentMovieIndex]],
      withResponse: true,
      components: [
        await this.buildActionButtons(currentMovieIndex, totalPages),
      ],
    });

    const filter = (i: Interaction) => i.user.id === interaction.user.id;
    const collector = response.resource.message.createMessageComponentCollector(
      {
        filter,
        time: 60000,
      },
    );

    await this.componentCollector(
      collector,
      currentMovieIndex,
      totalPages,
      embeds,
    );
  }

  async buildActionButtons(
    currentMovieIndex: number,
    totalPages: number,
  ): Promise<ActionRowBuilder<ButtonBuilder>> {
    const prev = new ButtonBuilder()
      .setCustomId('prev')
      .setLabel('◀️')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(currentMovieIndex === 0);
    const next = new ButtonBuilder()
      .setCustomId('next')
      .setLabel('▶️')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(currentMovieIndex === totalPages - 1);

    return new ActionRowBuilder<ButtonBuilder>().addComponents(prev, next);
  }

  async componentCollector(
    collector: InteractionCollector<any>,
    currentMovieIndex: number,
    totalPages: number,
    embeds: EmbedBuilder[],
  ) {
    collector.on('collect', async (i) => {
      if (i.customId === 'next' && currentMovieIndex < totalPages - 1) {
        currentMovieIndex++;
      } else if (i.customId === 'prev' && currentMovieIndex > 0) {
        currentMovieIndex--;
      }
      await i.update({
        embeds: [embeds[currentMovieIndex]],
        components: [
          await this.buildActionButtons(currentMovieIndex, totalPages),
        ],
      });
    });
  }

  getEmoji(logoPath: string, emojis: Collection<string, ApplicationEmoji>) {
    const emojiName = logoPath.replace('/', '').replace('.jpg', '');
    const emoji = emojis.find((e) => e.name === emojiName);
    // console.log(emojis);
    return emoji ? `<:${emoji.name}:${emoji.id}>` : '❓';
  }

  async formatProviders(
    providers: CountryWatchOptions,
    emojis: Collection<string, ApplicationEmoji>,
  ) {
    if (!providers) return 'Não encontrado';
    const flatRate =
      providers.flatrate
        ?.map((p) => `${this.getEmoji(p.logoPath, emojis)} ${p.providerName}`)
        .join('\n') || 'Nenhum';

    const buy =
      providers.buy
        ?.map((p) => `${this.getEmoji(p.logoPath, emojis)} ${p.providerName}`)
        .join('\n') || 'Nenhum';

    const rent =
      providers.rent
        ?.map((p) => `${this.getEmoji(p.logoPath, emojis)} ${p.providerName}`)
        .join('\n') || 'Nenhum';

    return `**Streaming:**\n${flatRate}\n\n**Compra:**\n${buy}\n\n**Aluguel:**\n${rent}`;
  }

  async createMovieEmbed(
    movie: Movie,
    emojis: Collection<string, ApplicationEmoji>,
  ) {
    const logoUrl = this.theMovieDBService.tmdbImageCdnURL + movie.posterPath;
    return new EmbedBuilder()
      .setColor('#FF5733')
      .setTitle(movie.title)
      .setDescription(movie.overview)
      .setImage(logoUrl)
      .addFields(
        { name: 'Release Date', value: movie.releaseDate, inline: true },
        { name: 'Rating', value: `${movie.voteAverage}/10`, inline: true },
        { name: 'Popularity', value: `${movie.popularity}`, inline: true },
        {
          name: 'Providers',
          value: await this.formatProviders(movie.providers, emojis),
          inline: false,
        },
      )
      .setFooter({ text: 'Data provided by TheMovieDB' });
  }
}
