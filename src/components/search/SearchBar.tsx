"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchMulti } from '@/lib/api/tmdb';
import { SearchResult } from '@/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsLoading(true);
        try {
          const response = await searchMulti(query);
          setResults(response.results.slice(0, 8));
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    const title = result.title || result.name || '';
    saveRecentSearch(title);
    setQuery('');
    setShowResults(false);
    
    if (result.media_type === 'movie') {
      router.push(`/movies/${result.id}`);
    } else if (result.media_type === 'tv') {
      router.push(`/tv/${result.id}`);
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
      setQuery('');
      setShowResults(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const saveRecentSearch = (searchTerm: string) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setShowResults(false);
      inputRef.current?.blur();
    }
  };

  const getImageUrl = (path: string | null, isProfile = false) => {
    if (!path) return '/placeholder-poster.jpg';
    const baseUrl = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL;
    const size = isProfile ? 'w92' : 'w154';
    return `${baseUrl}/${size}${path}`;
  };

  const getResultTitle = (result: SearchResult) => {
    return result.title || result.name || 'Unknown';
  };

  const getResultYear = (result: SearchResult) => {
    const date = result.release_date || result.first_air_date;
    return date ? new Date(date).getFullYear() : '';
  };

  const getMediaTypeLabel = (type: string) => {
    switch (type) {
      case 'movie': return 'Movie';
      case 'tv': return 'TV Show';
      case 'person': return 'Person';
      default: return '';
    }
  };

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-md", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search movies, TV shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim().length > 2 && results.length > 0) {
              setShowResults(true);
            }
          }}
          className="pl-10 pr-10 bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-colors"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowResults(false);
            }}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-md border border-border/50 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={`${result.media_type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="relative w-12 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={getImageUrl(
                        result.media_type === 'person' ? result.profile_path : result.poster_path,
                        result.media_type === 'person'
                      )}
                      alt={getResultTitle(result)}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {getResultTitle(result)}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {getResultYear(result) && (
                        <span className="text-sm text-muted-foreground">
                          {getResultYear(result)}
                        </span>
                      )}
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        {getMediaTypeLabel(result.media_type)}
                      </span>
                      {result.vote_average && result.vote_average > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm text-muted-foreground">
                            {result.vote_average.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              <div className="border-t border-border/50 mt-2 pt-2">
                <button
                  onClick={() => handleSearch(query)}
                  className="w-full px-4 py-2 text-sm text-primary hover:bg-muted/50 transition-colors text-left"
                >
                  See all results for "{query}"
                </button>
              </div>
            </div>
          ) : query.trim().length > 2 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          ) : (
            recentSearches.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Recent Searches</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentSearches}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </Button>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted/50 transition-colors text-foreground"
                  >
                    {search}
                  </button>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}