import { Movie, TVShow, Genre, Cast, Video, SearchResult, TMDBResponse, ExternalIds, Season, Episode } from '@/types/media';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = '7bffed716d50c95ed1c4790cfab4866a';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

class TMDBApi {
  private async request<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.set('api_key', API_KEY);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Movies
  async getTrendingMovies(timeWindow: 'day' | 'week' = 'day'): Promise<TMDBResponse<Movie>> {
    return this.request<TMDBResponse<Movie>>(`/trending/movie/${timeWindow}`);
  }

  async getPopularMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.request<TMDBResponse<Movie>>('/movie/popular', { page: page.toString() });
  }

  async getTopRatedMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.request<TMDBResponse<Movie>>('/movie/top_rated', { page: page.toString() });
  }

  async getNowPlayingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.request<TMDBResponse<Movie>>('/movie/now_playing', { page: page.toString() });
  }

  async getUpcomingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.request<TMDBResponse<Movie>>('/movie/upcoming', { page: page.toString() });
  }

  async getMovieDetails(id: number): Promise<Movie> {
    return this.request<Movie>(`/movie/${id}`);
  }

  async getMovieCredits(id: number): Promise<{ cast: Cast[]; crew: any[] }> {
    return this.request<{ cast: Cast[]; crew: any[] }>(`/movie/${id}/credits`);
  }

  async getMovieVideos(id: number): Promise<{ results: Video[] }> {
    return this.request<{ results: Video[] }>(`/movie/${id}/videos`);
  }

  async getSimilarMovies(id: number): Promise<TMDBResponse<Movie>> {
    return this.request<TMDBResponse<Movie>>(`/movie/${id}/similar`);
  }

  async getMovieRecommendations(id: number): Promise<TMDBResponse<Movie>> {
    return this.request<TMDBResponse<Movie>>(`/movie/${id}/recommendations`);
  }

  async getMovieExternalIds(id: number): Promise<ExternalIds> {
    return this.request<ExternalIds>(`/movie/${id}/external_ids`);
  }

  // TV Shows
  async getTrendingTVShows(timeWindow: 'day' | 'week' = 'day'): Promise<TMDBResponse<TVShow>> {
    return this.request<TMDBResponse<TVShow>>(`/trending/tv/${timeWindow}`);
  }

  async getPopularTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.request<TMDBResponse<TVShow>>('/tv/popular', { page: page.toString() });
  }

  async getTopRatedTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.request<TMDBResponse<TVShow>>('/tv/top_rated', { page: page.toString() });
  }

  async getAiringTodayTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.request<TMDBResponse<TVShow>>('/tv/airing_today', { page: page.toString() });
  }

  async getOnTheAirTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.request<TMDBResponse<TVShow>>('/tv/on_the_air', { page: page.toString() });
  }

  async getTVShowDetails(id: number): Promise<TVShow> {
    return this.request<TVShow>(`/tv/${id}`);
  }

  async getTVShowCredits(id: number): Promise<{ cast: Cast[]; crew: any[] }> {
    return this.request<{ cast: Cast[]; crew: any[] }>(`/tv/${id}/credits`);
  }

  async getTVShowVideos(id: number): Promise<{ results: Video[] }> {
    return this.request<{ results: Video[] }>(`/tv/${id}/videos`);
  }

  async getSimilarTVShows(id: number): Promise<TMDBResponse<TVShow>> {
    return this.request<TMDBResponse<TVShow>>(`/tv/${id}/similar`);
  }

  async getTVShowRecommendations(id: number): Promise<TMDBResponse<TVShow>> {
    return this.request<TMDBResponse<TVShow>>(`/tv/${id}/recommendations`);
  }

  async getTVShowExternalIds(id: number): Promise<ExternalIds> {
    return this.request<ExternalIds>(`/tv/${id}/external_ids`);
  }

  async getTVShowSeason(id: number, seasonNumber: number): Promise<Season> {
    return this.request<Season>(`/tv/${id}/season/${seasonNumber}`);
  }

  async getTVShowEpisode(id: number, seasonNumber: number, episodeNumber: number): Promise<Episode> {
    return this.request<Episode>(`/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}`);
  }

  // Search
  async searchMulti(query: string, page: number = 1): Promise<TMDBResponse<SearchResult>> {
    return this.request<TMDBResponse<SearchResult>>('/search/multi', { 
      query: encodeURIComponent(query), 
      page: page.toString() 
    });
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.request<TMDBResponse<Movie>>('/search/movie', { 
      query: encodeURIComponent(query), 
      page: page.toString() 
    });
  }

  async searchTVShows(query: string, page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.request<TMDBResponse<TVShow>>('/search/tv', { 
      query: encodeURIComponent(query), 
      page: page.toString() 
    });
  }

  // Discover
  async discoverMovies(params: {
    page?: number;
    sort_by?: string;
    with_genres?: string;
    primary_release_year?: number;
    vote_average_gte?: number;
    vote_average_lte?: number;
    with_original_language?: string;
  } = {}): Promise<TMDBResponse<Movie>> {
    const queryParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams[key] = value.toString();
      }
    });
    return this.request<TMDBResponse<Movie>>('/discover/movie', queryParams);
  }

  async discoverTVShows(params: {
    page?: number;
    sort_by?: string;
    with_genres?: string;
    first_air_date_year?: number;
    vote_average_gte?: number;
    vote_average_lte?: number;
    with_original_language?: string;
  } = {}): Promise<TMDBResponse<TVShow>> {
    const queryParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams[key] = value.toString();
      }
    });
    return this.request<TMDBResponse<TVShow>>('/discover/tv', queryParams);
  }

  // Genres
  async getMovieGenres(): Promise<{ genres: Genre[] }> {
    return this.request<{ genres: Genre[] }>('/genre/movie/list');
  }

  async getTVGenres(): Promise<{ genres: Genre[] }> {
    return this.request<{ genres: Genre[] }>('/genre/tv/list');
  }

  // Utility functions
  getImageUrl(path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!path) return 'https://placehold.co/500x750?text=No+Image+Available';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }

  getBackdropUrl(path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
    if (!path) return 'https://placehold.co/1280x720?text=No+Backdrop+Available';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }

  getProfileUrl(path: string | null, size: 'w45' | 'w185' | 'h632' | 'original' = 'w185'): string {
    if (!path) return 'https://placehold.co/185x278?text=No+Profile+Available';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }

  formatRuntime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) {
      return `${remainingMinutes}m`;
    }
    return `${hours}h ${remainingMinutes}m`;
  }

  formatReleaseDate(date: string): string {
    return new Date(date).getFullYear().toString();
  }

  formatVoteAverage(vote: number): string {
    return vote.toFixed(1);
  }
}

export const tmdbApi = new TMDBApi();
export default tmdbApi;