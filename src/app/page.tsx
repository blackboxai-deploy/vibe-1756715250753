'use client';

import { useState, useEffect } from 'react';
import { Movie, TVShow, Genre } from '@/types';
import { tmdbApi } from '@/lib/api/tmdb';
import { HeroCarousel } from '@/components/carousel/HeroCarousel';
import { GenreCarousel } from '@/components/carousel/GenreCarousel';
import { ContinueWatching } from '@/components/layout/ContinueWatching';
import { BackToTop } from '@/components/layout/BackToTop';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingTV, setTrendingTV] = useState<TVShow[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTV, setPopularTV] = useState<TVShow[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genreMovies, setGenreMovies] = useState<Record<number, Movie[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [
          trendingMoviesRes,
          trendingTVRes,
          popularMoviesRes,
          popularTVRes,
          topRatedMoviesRes,
          topRatedTVRes,
          genresRes
        ] = await Promise.all([
          tmdbApi.getTrending('movie'),
          tmdbApi.getTrending('tv'),
          tmdbApi.getPopular('movie'),
          tmdbApi.getPopular('tv'),
          tmdbApi.getTopRated('movie'),
          tmdbApi.getTopRated('tv'),
          tmdbApi.getGenres('movie')
        ]);

        setTrendingMovies(trendingMoviesRes.results.slice(0, 10));
        setTrendingTV(trendingTVRes.results.slice(0, 10));
        setPopularMovies(popularMoviesRes.results.slice(0, 10));
        setPopularTV(popularTVRes.results.slice(0, 10));
        setTopRatedMovies(topRatedMoviesRes.results.slice(0, 10));
        setTopRatedTV(topRatedTVRes.results.slice(0, 10));
        setGenres(genresRes.genres.slice(0, 6));

        // Fetch movies for each genre
        const genreMoviesData: Record<number, Movie[]> = {};
        for (const genre of genresRes.genres.slice(0, 6)) {
          const genreMoviesRes = await tmdbApi.getMoviesByGenre(genre.id);
          genreMoviesData[genre.id] = genreMoviesRes.results.slice(0, 10);
        }
        setGenreMovies(genreMoviesData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-12">
          {/* Hero Skeleton */}
          <div className="relative h-[60vh] rounded-2xl overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
          
          {/* Carousel Skeletons */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3, 4, 5, 6].map((j) => (
                  <div key={j} className="flex-shrink-0">
                    <Skeleton className="w-48 h-72 rounded-xl" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative">
        <HeroCarousel items={trendingMovies.slice(0, 5)} />
      </section>

      {/* Continue Watching */}
      <ContinueWatching />

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        
        {/* Trending Movies */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">Trending Movies</h2>
            <a 
              href="/movies?sort=trending" 
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              View All
            </a>
          </div>
          <GenreCarousel items={trendingMovies} type="movie" />
        </section>

        {/* Popular Movies */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">Popular Movies</h2>
            <a 
              href="/movies?sort=popular" 
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              View All
            </a>
          </div>
          <GenreCarousel items={popularMovies} type="movie" />
        </section>

        {/* Trending TV Shows */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">Trending TV Shows</h2>
            <a 
              href="/tv?sort=trending" 
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              View All
            </a>
          </div>
          <GenreCarousel items={trendingTV} type="tv" />
        </section>

        {/* Popular TV Shows */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">Popular TV Shows</h2>
            <a 
              href="/tv?sort=popular" 
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              View All
            </a>
          </div>
          <GenreCarousel items={popularTV} type="tv" />
        </section>

        {/* Top Rated Movies */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">Top Rated Movies</h2>
            <a 
              href="/movies?sort=top_rated" 
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              View All
            </a>
          </div>
          <GenreCarousel items={topRatedMovies} type="movie" />
        </section>

        {/* Top Rated TV Shows */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">Top Rated TV Shows</h2>
            <a 
              href="/tv?sort=top_rated" 
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              View All
            </a>
          </div>
          <GenreCarousel items={topRatedTV} type="tv" />
        </section>

        {/* Genre Sections */}
        {genres.map((genre) => (
          <section key={genre.id}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-foreground">{genre.name} Movies</h2>
              <a 
                href={`/genre/${genre.id}?name=${encodeURIComponent(genre.name)}`}
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                View All
              </a>
            </div>
            {genreMovies[genre.id] && (
              <GenreCarousel items={genreMovies[genre.id]} type="movie" />
            )}
          </section>
        ))}
      </div>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}