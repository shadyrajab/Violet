import { TheMovieDBClient } from '../utils/theMovieDB/theMovieDB.client';
import { THE_MOVIE_DB_API_KEY, THE_MOVIE_DB_API_URL } from '../core/constants';
import { MovieResponse } from '../interfaces/theMovieDB/search.response';
import { MovieProvidersResponse } from '../interfaces/theMovieDB/movie-providers.response';
import { join } from 'path';
import { writeFileSync } from 'fs';

export class TheMovieDBService {
  private theMovieDBClient: TheMovieDBClient;

  constructor() {
    this.theMovieDBClient = new TheMovieDBClient(
      THE_MOVIE_DB_API_URL,
      THE_MOVIE_DB_API_KEY,
    );
  }

  public async searchMovie(
    movieName: string,
    countryCode: string,
  ): Promise<MovieResponse> {
    const movies = await this.theMovieDBClient.searchMovie(movieName);
    const moviesWithProviders = await Promise.all(
      movies.results.map(async (movie) => {
        const movieProviders: MovieProvidersResponse =
          await this.theMovieDBClient.getMovieProviders(movie.id);

        const countryProviders = movieProviders.results[countryCode];

        return {
          ...movie,
          providers: countryProviders,
        };
      }),
    );

    return {
      ...movies,
      results: moviesWithProviders,
    };
  }

  public async getWatchProvidersLogosJSON(
    language: string,
    countryCode: string,
  ): Promise<void> {
    const watchProviders = await this.theMovieDBClient.getAllProviders(
      language,
      countryCode,
    );

    const providers = watchProviders.results
      .map((provider) => {
        const logoUrl =
          this.theMovieDBClient.tmdbImageCdnURL + provider.logoPath;
        return {
          attachment: logoUrl,
          name: provider.logoPath,
        };
      })
      .filter(Boolean);
    const filePath = join(__dirname, '../watchProviders.json');
    writeFileSync(filePath, JSON.stringify(providers, null, 2));
  }
}
