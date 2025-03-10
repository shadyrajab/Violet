import { InternalAxiosRequestConfig } from 'axios';
import { HttpClient } from '../http/http.client';
import { SearchMovieResponse } from '../../interfaces/theMovieDB/search.response';
import { mapKeysToCamelCase } from '../formatCase';
import { MovieProvidersResponse } from '../../interfaces/theMovieDB/movie-providers.response';
import { WatchProvidersResponse } from '../../interfaces/theMovieDB/watch-providers.response';
import { MovieDetailsResponse } from '../../interfaces/theMovieDB/movie-details.response';

export class TheMovieDBClient extends HttpClient {
  private readonly bearerToken: string;
  private readonly baseURL: string;

  constructor(baseURL: string, bearerToken: string) {
    super(baseURL);
    this.baseURL = baseURL;
    this.bearerToken = bearerToken;

    this._initializeRequestInterceptor();
  }

  private _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(
      this._handlerRequest,
      this._handlerError,
    );
  };

  public get tmdbImageCdnURL() {
    return 'https://image.tmdb.org/t/p/original';
  }

  private _handlerRequest = async (config: InternalAxiosRequestConfig) => {
    config.headers['Authorization'] = this.bearerToken;
    return config;
  };

  public async searchMovieByName(name: string): Promise<SearchMovieResponse> {
    const response = await this.instance.get(
      `/search/movie?query=${name}&language=pt-BR`,
    );
    return mapKeysToCamelCase(response);
  }

  public async searchMovieById(id: number): Promise<MovieDetailsResponse> {
    const response = await this.instance.get(`/movie/${id}?language=pt-BR`);
    return mapKeysToCamelCase(response);
  }

  public async getMovieProviders(
    movieId: number,
  ): Promise<MovieProvidersResponse> {
    const response = await this.instance.get(
      `/movie/${movieId}/watch/providers`,
    );
    return mapKeysToCamelCase(response);
  }

  public async getAllProviders(
    language: string,
    countryCode: string,
  ): Promise<WatchProvidersResponse> {
    const response = await this.instance.get(
      `/watch/providers/movie?language=${language}&watch_region=${countryCode}`,
    );
    return mapKeysToCamelCase(response);
  }
}
