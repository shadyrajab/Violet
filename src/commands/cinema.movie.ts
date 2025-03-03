import {
  ApplicationCommandOptionType,
  CommandInteraction,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  InteractionCollector,
  Interaction,
  EmbedBuilder,
  ApplicationEmoji,
  Collection,
  GuildScheduledEventPrivacyLevel,
  GuildScheduledEventEntityType,
} from 'discord.js';
import { ICommand } from '../interfaces/command.interface';
import { TheMovieDBService } from '../services/theMovieDB.service';
import { Movie } from '../interfaces/theMovieDB/search.response';
import { CountryWatchOptions } from '../interfaces/theMovieDB/movie-providers.response';

export const movie: ICommand = {
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
  execute: async (interaction: CommandInteraction) => {
    const emojis = interaction.client.application.emojis.cache;
    const movieName = interaction.options.get('movie').value.toString();
    const theMovieDBClient = new TheMovieDBService();
    const movies = await theMovieDBClient.searchMovie(movieName, 'BR');

    let currentMovieIndex = 0;
    let totalPages = movies.results.length;

    const embeds = movies.results.map((movie) =>
      createMovieEmbed(movie, emojis),
    );

    const response = await interaction.reply({
      embeds: [embeds[currentMovieIndex]],
      withResponse: true,
      components: [buildActionButtons(currentMovieIndex, totalPages)],
    });

    const filter = (i: Interaction) => i.user.id === interaction.user.id;
    const collector = response.resource.message.createMessageComponentCollector(
      {
        filter,
        time: 60000,
      },
    );
    const eventChannel = await interaction.guild.channels.fetch(
      '1345044162101121074',
    );
    await componentCollector(collector, currentMovieIndex, totalPages, embeds);
    await interaction.guild.scheduledEvents.create({
      name: movieName,
      privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
      scheduledStartTime: new Date(
        new Date().setDate(new Date().getDate() + 1),
      ).setHours(0, 0, 0, 0),
      scheduledEndTime: new Date(
        new Date().setDate(new Date().getDate() + 1),
      ).setHours(2, 0, 0, 0),
      entityType: GuildScheduledEventEntityType.Voice,
      image:
        'https://image.tmdb.org/t/p/original' + movies.results[0].posterPath,
      channel: eventChannel.id,
      description: movies.results[0].overview,
      reason: 'Cinema Movie',
      entityMetadata: {
        location: `Hosted by ${interaction.user.username}`,
      },
    });
  },
};

const buildActionButtons = (currentMovieIndex: number, totalPages: number) => {
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
};

const componentCollector = async (
  collector: InteractionCollector<any>,
  currentMovieIndex: number,
  totalPages: number,
  embeds: EmbedBuilder[],
) => {
  collector.on('collect', async (i) => {
    if (i.customId === 'next' && currentMovieIndex < totalPages - 1) {
      currentMovieIndex++;
    } else if (i.customId === 'prev' && currentMovieIndex > 0) {
      currentMovieIndex--;
    }
    await i.update({
      embeds: [embeds[currentMovieIndex]],
      components: [buildActionButtons(currentMovieIndex, totalPages)],
    });
  });
};

const getEmoji = (
  logoPath: string,
  emojis: Collection<string, ApplicationEmoji>,
) => {
  const emojiName = logoPath.replace('/', '').replace('.jpg', '');
  const emoji = emojis.find((e) => e.name === emojiName);
  return emoji ? `<:${emoji.name}:${emoji.id}>` : '❓';
};

const formatProviders = (
  providers: CountryWatchOptions,
  emojis: Collection<string, ApplicationEmoji>,
) => {
  if (!providers) return 'Não encontrado';
  const flatRate =
    providers.flatrate
      ?.map((p) => `${getEmoji(p.logoPath, emojis)} ${p.providerName}`)
      .join('\n') || 'Nenhum';

  const buy =
    providers.buy
      ?.map((p) => `${getEmoji(p.logoPath, emojis)} ${p.providerName}`)
      .join('\n') || 'Nenhum';

  const rent =
    providers.rent
      ?.map((p) => `${getEmoji(p.logoPath, emojis)} ${p.providerName}`)
      .join('\n') || 'Nenhum';

  return `**Streaming:**\n${flatRate}\n\n**Compra:**\n${buy}\n\n**Aluguel:**\n${rent}`;
};

const createMovieEmbed = (
  movie: Movie,
  emojis: Collection<string, ApplicationEmoji>,
) => {
  return new EmbedBuilder()
    .setColor('#FF5733')
    .setTitle(movie.title)
    .setDescription(movie.overview)
    .setImage(`https://image.tmdb.org/t/p/original/${movie.posterPath}`)
    .addFields(
      { name: 'Release Date', value: movie.releaseDate, inline: true },
      { name: 'Rating', value: `${movie.voteAverage}/10`, inline: true },
      { name: 'Popularity', value: `${movie.popularity}`, inline: true },
      {
        name: 'Providers',
        value: formatProviders(movie.providers, emojis),
        inline: false,
      },
    )
    .setFooter({ text: 'Data provided by TheMovieDB' });
};
