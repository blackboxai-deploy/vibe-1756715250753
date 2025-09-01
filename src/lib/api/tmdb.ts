import { Movie, TVShow, Genre, Cast, Video, ExternalIds, Season, Episode, SearchResult, TMDBResponse } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL;

class TMDBApi {
  private async fetchFromTMDB<T>(endpoint: string): Promise<T> {
    const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('TMDB API fetch error:', error);
      throw error;
    }
  }

  // Image URL helpers
  getImageUrl(path: string | null, size: string = 'w500'): string {
    if (!path) return '/placeholder-poster.jpg';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }

  getBackdropUrl(path: string | null, size: string = 'w1280'): string {
    if (!path) return '/placeholder-backdrop.jpg';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }

  // Movies
  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> {
    const response = await this.fetchFromTMDB<TMDBResponse<Movie>>(`/trending/movie/${timeWindow}`);
    return response.results;
  }

  async getPopularMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.fetchFromTMDB<TMDBResponse<Movie>>(`/movie/popular?page=${page}`);
  }

  async getNowPlayingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.fetchFromTMDB<TMDBResponse<Movie>>(`/movie/now_playing?page=${page}`);
  }

  async getUpcomingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.fetchFromTMDB<TMDBResponse<Movie>>(`/movie/upcoming?page=${page}`);
  }

  async getTopRatedMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.fetchFromTMDB<TMDBResponse<Movie>>(`/movie/top_rated?page=${page}`);
  }

  async getMovieDetails(id: number): Promise<Movie> {
    return this.fetchFromTMDB<Movie>(`/movie/${id}`);
  }

  async getMovieCredits(id: number): Promise<{ cast: Cast[] }> {
    return this.fetchFromTMDB<{ cast: Cast[] }>(`/movie/${id}/credits`);
  }

  async getMovieVideos(id: number): Promise<{ results: Video[] }> {
    return this.fetchFromTMDB<{ results: Video[] }>(`/movie/${id}/videos`);
  }

  async getSimilarMovies(id: number, page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.fetchFromTMDB<TMDBResponse<Movie>>(`/movie/${id}/similar?page=${page}`);
  }

  async getMovieExternalIds(id: number): Promise<ExternalIds> {
    return this.fetchFromTMDB<ExternalIds>(`/movie/${id}/external_ids`);
  }

  // TV Shows
  async getTrendingTVShows(timeWindow: 'day' | 'week' = 'week'): Promise<TVShow[]> {
    const response = await this.fetchFromTMDB<TMDBResponse<TVShow>>(`/trending/tv/${timeWindow}`);
    return response.results;
  }

  async getPopularTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.fetchFromTMDB<TMDBResponse<TVShow>>(`/tv/popular?page=${page}`);
  }

  async getAiringTodayTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.fetchFromTMDB<TMDBResponse<TVShow>>(`/tv/airing_today?page=${page}`);
  }

  async getOnTheAirTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.fetchFromTMDB<TMDBResponse<TVShow>>(`/tv/on_the_air?page=${page}`);
  }

  async getTopRatedTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.fetchFromTMDB<TMDBResponse<TVShow>>(`/tv/top_rated?page=${page}`);
  }

  async getTVShowDetails(id: number): Promise<TVShow> {
    return this.fetchFromTMDB<TVShow>(`/tv/${id}`);
  }

  async getTVShowCredits(id: number): Promise<{ cast: Cast[] }> {
    return this.fetchFromTMDB<{ cast: Cast[] }>(`/tv/${id}/credits`);
  }

  async getTVShowVideos(id: number): Promise<{ results: Video[] }> {
    return this.fetchFromTMDB<{ results: Video[] }>(`/tv/${id}/videos`);
  }

  async getSimilarTVShows(id: number, page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.fetchFromTMDB<TMDBResponse<TVShow>>(`/tv/${id}/similar?page=${page}`);
  }

  async getTVShowExternalIds(id: number): Promise<ExternalIds> {
    return this.fetchFromTMDB<ExternalIds>(`/tv/${id}/external_ids`);
  }

  async getSeasonDetails(tvId: number, seasonNumber: number): Promise<Season> {
    return this.fetchFromTMDB<Season>(`/tv/${tvId}/season/${seasonNumber}`);
  }

  async getEpisodeDetails(tvId: number, seasonNumber: number, episodeNumber: number): Promise<Episode> {
    return this.fetchFromTMDB<Episode>(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`);
  }

  // Genres
  async getMovieGenres(): Promise<{ genres: Genre[] }> {
    return this.fetchFromTMDB<{ genres: Genre[] }>('/genre/movie/list');
  }

  async getTVGenres(): Promise<{ genres: Genre[] }> {
    return this.fetchFromTMDB<{ genres: Genre[] }>('/genre/tv/list');
  }

  // Discover
  async discoverMovies(params: {
    page?: number;
    genre?: number;
    sortBy?: string;
    year?: number;
    language?: string;
    voteAverageGte?: number;
    voteAverageLte?: number;
  } = {}): Promise<TMDBResponse<Movie>> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.genre) queryParams.append('with_genres', params.genre.toString());
    if (params.sortBy) queryParams.append('sort_by', params.sortBy);
    if (params.year) queryParams.append('year', params.year.toString());
    if (params.language) queryParams.append('with_original_language', params.language);
    if (params.voteAverageGte) queryParams.append('vote_average.gte', params.voteAverageGte.toString());
    if (params.voteAverageLte) queryParams.append('vote_average.lte', params.voteAverageLte.toString());

    const endpoint = `/discover/movie?${queryParams.toString()}`;
    return this.fetchFromTMDB<TMDBResponse<Movie>>(endpoint);
  }

  async discoverTVShows(params: {
    page?: number;
    genre?: number;
    sortBy?: string;
    firstAirDateYear?: number;
    language?: string;
    voteAverageGte?: number;
    voteAverageLte?: number;
  } = {}): Promise<TMDBResponse<TVShow>> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.genre) queryParams.append('with_genres', params.genre.toString());
    if (params.sortBy) queryParams.append('sort_by', params.sortBy);
    if (params.firstAirDateYear) queryParams.append('first_air_date_year', params.firstAirDateYear.toString());
    if (params.language) queryParams.append('with_original_language', params.language);
    if (params.voteAverageGte) queryParams.append('vote_average.gte', params.voteAverageGte.toString());
    if (params.voteAverageLte) queryParams.append('vote_average.lte', params.voteAverageLte.toString());

    const endpoint = `/discover/tv?${queryParams.toString()}`;
    return this.fetchFromTMDB<TMDBResponse<TVShow>>(endpoint);
  }

  // Search
  async searchMulti(query: string, page: number = 1): Promise<TMDBResponse<SearchResult>> {
    const encodedQuery = encodeURIComponent(query);
    return this.fetchFromTMDB<TMDBResponse<SearchResult>>(`/search/multi?query=${encodedQuery}&page=${page}`);
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse<Movie>> {
    const encodedQuery = encodeURIComponent(query);
    return this.fetchFromTMDB<TMDBResponse<Movie>>(`/search/movie?query=${encodedQuery}&page=${page}`);
  }

  async searchTVShows(query: string, page: number = 1): Promise<TMDBResponse<TVShow>> {
    const encodedQuery = encodeURIComponent(query);
    return this.fetchFromTMDB<TMDBResponse<TVShow>>(`/search/tv?query=${encodedQuery}&page=${page}`);
  }

  // Utility methods
  async getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.discoverMovies({ genre: genreId, page });
  }

  async getTVShowsByGenre(genreId: number, page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.discoverTVShows({ genre: genreId, page });
  }

  formatRuntime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatYear(dateString: string): string {
    return new Date(dateString).getFullYear().toString();
  }

  getTrailerUrl(videos: Video[]): string | null {
    const trailer = videos.find(video => 
      video.type === 'Trailer' && 
      video.site === 'YouTube' && 
      video.official
    ) || videos.find(video => 
      video.type === 'Trailer' && 
      video.site === 'YouTube'
    );
    
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  }

  getYouTubeEmbedUrl(videos: Video[]): string | null {
    const trailer = videos.find(video => 
      video.type === 'Trailer' && 
      video.site === 'YouTube' && 
      video.official
    ) || videos.find(video => 
      video.type === 'Trailer' && 
      video.site === 'YouTube'
    );
    
    return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
  }
}

export const tmdbApi = new TMDBApi();