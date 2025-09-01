export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  genres?: Genre[];
  adult: boolean;
  original_language: string;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
  runtime?: number;
  status?: string;
  tagline?: string;
  imdb_id?: string;
  homepage?: string;
  budget?: number;
  revenue?: number;
  production_countries?: ProductionCountry[];
  production_companies?: ProductionCompany[];
  spoken_languages?: SpokenLanguage[];
}

export interface TVShow {
  id: number;
  name: string;
  original_name?: string;
  overview: string;
  first_air_date: string;
  last_air_date?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  genres?: Genre[];
  adult: boolean;
  origin_country: string[];
  original_language: string;
  popularity: number;
  vote_count: number;
  vote_average: number;
  episode_run_time?: number[];
  number_of_episodes?: number;
  number_of_seasons?: number;
  status?: string;
  tagline?: string;
  type?: string;
  homepage?: string;
  in_production?: boolean;
  languages?: string[];
  networks?: Network[];
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  spoken_languages?: SpokenLanguage[];
  seasons?: Season[];
  created_by?: CreatedBy[];
  external_ids?: ExternalIds;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episodes?: Episode[];
}

export interface Episode {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface ExternalIds {
  imdb_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
  wikidata_id: string | null;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Network {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface CreatedBy {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string | null;
}

export interface StreamingServer {
  name: string;
  type: 'imdb' | 'tmdb';
  url: string;
  url_tv: string;
}

export interface WatchlistItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  addedAt: number;
}

export interface ContinueWatching {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  progress: number;
  lastWatched: number;
  season?: number;
  episode?: number;
  runtime?: number;
}

export interface SearchResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  poster_path: string | null;
  profile_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  overview?: string;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  defaultServer: string;
  autoplay: boolean;
  sandboxEnabled: boolean;
  language: string;
  profileImage?: string;
}

export type MediaType = 'movie' | 'tv';
export type SortOption = 'popularity.desc' | 'popularity.asc' | 'vote_average.desc' | 'vote_average.asc' | 'release_date.desc' | 'release_date.asc' | 'title.asc' | 'title.desc';