"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { searchMulti } from '@/lib/api/tmdb';
import { SearchResult } from '@/types';
import Image from 'next/image';

interface SearchResultsProps {
  query?: string;
  onClose?: () => void;
  isDropdown?: boolean;
}

export default function SearchResults({ query = '', onClose, isDropdown = false }: SearchResultsProps) {
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await searchMulti(query);
      setResults(response.results.slice(0, 10));
      
      // Save to recent searches
      const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.media_type === 'person') return;
    
    const path = result.media_type === 'movie' ? `/movies/${result.id}` : `/tv/${result.id}`;
    router.push(path);
    onClose?.();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const getImageUrl = (path: string | null, type: 'poster' | 'profile' = 'poster') => {
    if (!path) return '/placeholder-poster.jpg';
    return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/w200${path}`;
  };

  const getTitle = (result: SearchResult) => {
    return result.title || result.name || 'Unknown';
  };

  const getYear = (result: SearchResult) => {
    const date = result.release_date || result.first_air_date;
    return date ? new Date(date).getFullYear() : null;
  };

  const getMediaTypeBadge = (type: string) => {
    const variants = {
      movie: 'Movie',
      tv: 'TV Show',
      person: 'Person'
    };
    return variants[type as keyof typeof variants] || type;
  };

  if (isDropdown) {
    return (
      <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
        {loading && (
          <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="w-12 h-16 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && searchQuery && results.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            No results found for "{searchQuery}"
          </div>
        )}

        {!loading && !searchQuery && recentSearches.length > 0 && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">Recent Searches</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearRecentSearches}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            </div>
            <div className="space-y-1">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(search)}
                  className="w-full text-left px-2 py-1 text-sm hover:bg-accent rounded transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="p-2">
            {results.map((result) => (
              <button
                key={`${result.media_type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                className="w-full flex items-center space-x-3 p-2 hover:bg-accent rounded-lg transition-colors"
                disabled={result.media_type === 'person'}
              >
                <div className="relative w-12 h-16 flex-shrink-0">
                  <Image
                    src={getImageUrl(result.poster_path || result.profile_path, result.media_type === 'person' ? 'profile' : 'poster')}
                    alt={getTitle(result)}
                    fill
                    className="object-cover rounded"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="font-medium text-sm truncate">{getTitle(result)}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {getYear(result) && (
                      <span className="text-xs text-muted-foreground">{getYear(result)}</span>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {getMediaTypeBadge(result.media_type)}
                    </Badge>
                    {result.vote_average && result.vote_average > 0 && (
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-xs text-muted-foreground">
                          {result.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search movies, TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex space-x-4">
                  <Skeleton className="w-20 h-28 rounded" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && searchQuery && results.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No results found</h2>
            <p className="text-muted-foreground">
              Try searching with different keywords or check your spelling.
            </p>
          </div>
        )}

        {!loading && !searchQuery && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Search for movies and TV shows</h2>
            <p className="text-muted-foreground mb-8">
              Discover your next favorite movie or TV series.
            </p>
            
            {recentSearches.length > 0 && (
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Recent Searches</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentSearches}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery(search)}
                      className="text-sm"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Search Results for "{searchQuery}" ({results.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <Card
                  key={`${result.media_type}-${result.id}`}
                  className={`p-4 transition-all duration-200 ${
                    result.media_type === 'person' 
                      ? 'opacity-60 cursor-not-allowed' 
                      : 'hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                  }`}
                  onClick={() => result.media_type !== 'person' && handleResultClick(result)}
                >
                  <div className="flex space-x-4">
                    <div className="relative w-20 h-28 flex-shrink-0">
                      <Image
                        src={getImageUrl(result.poster_path || result.profile_path, result.media_type === 'person' ? 'profile' : 'poster')}
                        alt={getTitle(result)}
                        fill
                        className="object-cover rounded"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{getTitle(result)}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        {getYear(result) && (
                          <span className="text-muted-foreground">{getYear(result)}</span>
                        )}
                        <Badge variant="secondary">
                          {getMediaTypeBadge(result.media_type)}
                        </Badge>
                      </div>
                      {result.vote_average && result.vote_average > 0 && (
                        <div className="flex items-center space-x-1 mb-2">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm font-medium">
                            {result.vote_average.toFixed(1)}
                          </span>
                        </div>
                      )}
                      {result.overview && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {result.overview}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}