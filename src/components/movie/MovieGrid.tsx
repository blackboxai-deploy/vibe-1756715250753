'use client';

import { useState, useEffect, useCallback } from 'react';
import { Movie, TVShow, TMDBResponse, SortOption } from '@/types';
import { MovieCard } from './MovieCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Loader2, Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface MovieGridProps {
  initialMovies?: (Movie | TVShow)[];
  type: 'movie' | 'tv';
  genreId?: number;
  searchQuery?: string;
  title?: string;
}

const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' }
];

export function MovieGrid({ initialMovies = [], type, genreId, searchQuery, title }: MovieGridProps) {
  const [movies, setMovies] = useState<(Movie | TVShow)[]>(initialMovies);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('popularity.desc');
  const [selectedGenres, setSelectedGenres] = useState<number[]>(genreId ? [genreId] : []);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState<number[]>([0, 10]);
  const [yearRange, setYearRange] = useState<number[]>([1900, new Date().getFullYear()]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchMovies = useCallback(async (pageNum: number, reset = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
      const apiKey = process.env.NEXT_PUBLIC_TMDB_KEY;
      
      let url = '';
      const params = new URLSearchParams({
        api_key: apiKey!,
        page: pageNum.toString(),
        sort_by: sortBy,
        'vote_average.gte': ratingRange[0].toString(),
        'vote_average.lte': ratingRange[1].toString(),
        'primary_release_date.gte': `${yearRange[0]}-01-01`,
        'primary_release_date.lte': `${yearRange[1]}-12-31`,
      });

      if (selectedGenres.length > 0) {
        params.append('with_genres', selectedGenres.join(','));
      }

      if (selectedLanguages.length > 0) {
        params.append('with_original_language', selectedLanguages.join('|'));
      }

      if (searchQuery) {
        url = `${baseUrl}/search/${type}?${params}&query=${encodeURIComponent(searchQuery)}`;
      } else if (genreId) {
        url = `${baseUrl}/discover/${type}?${params}`;
      } else {
        url = `${baseUrl}/discover/${type}?${params}`;
      }

      const response = await fetch(url);
      const data: TMDBResponse<Movie | TVShow> = await response.json();

      if (reset) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }

      setHasMore(pageNum < data.total_pages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  }, [type, sortBy, selectedGenres, selectedLanguages, ratingRange, yearRange, genreId, searchQuery, loading]);

  useEffect(() => {
    if (!initialMovies.length) {
      setPage(1);
      fetchMovies(1, true);
    }
  }, [fetchMovies, initialMovies.length]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(nextPage);
  };

  const handleFilterChange = () => {
    setPage(1);
    fetchMovies(1, true);
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    setSelectedGenres(genreId ? [genreId] : []);
    setSelectedLanguages([]);
    setRatingRange([0, 10]);
    setYearRange([1900, new Date().getFullYear()]);
    setSortBy('popularity.desc');
  };

  const activeFiltersCount = 
    selectedGenres.length + 
    selectedLanguages.length + 
    (ratingRange[0] > 0 || ratingRange[1] < 10 ? 1 : 0) + 
    (yearRange[0] > 1900 || yearRange[1] < new Date().getFullYear() ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {title || (type === 'movie' ? 'Movies' : 'TV Shows')}
          </h1>
          {searchQuery && (
            <p className="text-gray-400 mt-1">
              Search results for "{searchQuery}"
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-[180px] bg-[#1b1f23] border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1b1f23] border-gray-700">
              <SelectItem value="popularity.desc">Most Popular</SelectItem>
              <SelectItem value="popularity.asc">Least Popular</SelectItem>
              <SelectItem value="vote_average.desc">Highest Rated</SelectItem>
              <SelectItem value="vote_average.asc">Lowest Rated</SelectItem>
              <SelectItem value="release_date.desc">Newest First</SelectItem>
              <SelectItem value="release_date.asc">Oldest First</SelectItem>
              <SelectItem value="title.asc">A-Z</SelectItem>
              <SelectItem value="title.desc">Z-A</SelectItem>
            </SelectContent>
          </Select>

          {/* Filters */}
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative bg-[#1b1f23] border-gray-700 hover:bg-[#2a2f35]">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#0f1316] border-gray-700 w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle className="text-white">Advanced Filters</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-6 mt-6">
                {/* Genres */}
                <div>
                  <Label className="text-white font-medium">Genres</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {genres.map((genre) => (
                      <div key={genre.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`genre-${genre.id}`}
                          checked={selectedGenres.includes(genre.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedGenres([...selectedGenres, genre.id]);
                            } else {
                              setSelectedGenres(selectedGenres.filter(id => id !== genre.id));
                            }
                          }}
                        />
                        <Label htmlFor={`genre-${genre.id}`} className="text-sm text-gray-300">
                          {genre.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <Label className="text-white font-medium">Languages</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {languages.map((language) => (
                      <div key={language.code} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lang-${language.code}`}
                          checked={selectedLanguages.includes(language.code)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedLanguages([...selectedLanguages, language.code]);
                            } else {
                              setSelectedLanguages(selectedLanguages.filter(code => code !== language.code));
                            }
                          }}
                        />
                        <Label htmlFor={`lang-${language.code}`} className="text-sm text-gray-300">
                          {language.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating Range */}
                <div>
                  <Label className="text-white font-medium">
                    Rating: {ratingRange[0]} - {ratingRange[1]}
                  </Label>
                  <Slider
                    value={ratingRange}
                    onValueChange={setRatingRange}
                    max={10}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                {/* Year Range */}
                <div>
                  <Label className="text-white font-medium">
                    Year: {yearRange[0]} - {yearRange[1]}
                  </Label>
                  <Slider
                    value={yearRange}
                    onValueChange={setYearRange}
                    max={new Date().getFullYear()}
                    min={1900}
                    step={1}
                    className="mt-2"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleFilterChange} className="flex-1 bg-orange-500 hover:bg-orange-600">
                    Apply Filters
                  </Button>
                  <Button onClick={clearFilters} variant="outline" className="border-gray-700">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={`${movie.id}-${type}`}
            movie={movie}
            type={type}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 px-8 py-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}

      {/* No Results */}
      {!loading && movies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No results found</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}