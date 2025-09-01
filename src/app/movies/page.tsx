'use client';

import { useState, useEffect } from 'react';
import { Movie, Genre, TMDBResponse } from '@/types';
import { getMovies, getGenres } from '@/lib/api/tmdb';
import MovieGrid from '@/components/movie/MovieGrid';
import FilterBar from '@/components/movie/FilterBar';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    genre: '',
    sortBy: 'popularity.desc',
    year: '',
    rating: '',
    language: ''
  });

  useEffect(() => {
    loadGenres();
    loadMovies(1, true);
  }, [filters]);

  const loadGenres = async () => {
    try {
      const genresData = await getGenres('movie');
      setGenres(genresData.genres);
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };

  const loadMovies = async (page: number, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setMovies([]);
      } else {
        setLoadingMore(true);
      }

      const params = {
        page,
        sort_by: filters.sortBy,
        ...(filters.genre && { with_genres: filters.genre }),
        ...(filters.year && { year: filters.year }),
        ...(filters.rating && { 'vote_average.gte': filters.rating }),
        ...(filters.language && { with_original_language: filters.language })
      };

      const response: TMDBResponse<Movie> = await getMovies('discover', params);
      
      if (reset) {
        setMovies(response.results);
        setCurrentPage(1);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }
      
      setTotalPages(response.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      loadMovies(currentPage + 1);
    }
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1316] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
            Movies
          </h1>
          <p className="text-gray-400">Discover amazing movies from around the world</p>
        </div>

        <FilterBar
          genres={genres}
          filters={filters}
          onFilterChange={handleFilterChange}
          mediaType="movie"
        />

        <MovieGrid movies={movies} />

        {currentPage < totalPages && (
          <div className="flex justify-center mt-12">
            <Button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Movies'
              )}
            </Button>
          </div>
        )}

        {movies.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No movies found with the current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}