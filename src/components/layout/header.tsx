'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/hooks/use-theme';
import { searchMulti, getImageUrl } from '@/lib/api/tmdb';
import { SearchResult } from '@/types';
import { addToRecentSearches } from '@/lib/storage';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length > 2) {
      setIsLoading(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await searchMulti(searchQuery, 1);
          setSearchResults(results.results.slice(0, 8)); // Show only first 8 results
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    addToRecentSearches(searchQuery);
    setIsSearchOpen(false);
    setSearchQuery('');
    
    const type = result.media_type === 'movie' ? 'movies' : 'tv';
    router.push(`/${type}/${result.id}`);
    
    // Smooth scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToRecentSearches(searchQuery);
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0f1316]/80 backdrop-blur-md border-b border-[#1b1f23] lg:ml-16">
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo for mobile */}
          <div className="lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-auto lg:mx-0" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <i className="bx bx-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
                <Input
                  type="text"
                  placeholder="Search movies, TV shows..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="pl-12 pr-4 py-3 bg-[#1b1f23] border-[#2a3441] text-white placeholder-gray-400 focus:border-yellow-500 rounded-xl"
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-yellow-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {isSearchOpen && (searchResults.length > 0 || isLoading) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1b1f23] rounded-xl border border-[#2a3441] shadow-xl max-h-96 overflow-y-auto z-50">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-400">
                      Searching...
                    </div>
                  ) : (
                    searchResults.map((result) => (
                      <button
                        key={`${result.media_type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="w-full flex items-center p-3 hover:bg-[#232a30] transition-colors duration-200"
                      >
                        <div className="w-12 h-16 bg-[#2a3441] rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={getImageUrl(result.poster_path, 'w92')}
                            alt={result.title || result.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://placehold.co/92x138?text=No+Image';
                            }}
                          />
                        </div>
                        <div className="ml-3 flex-1 text-left">
                          <h4 className="text-white font-medium text-sm">
                            {result.title || result.name}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-gray-400 text-xs">
                              {result.release_date || result.first_air_date 
                                ? new Date(result.release_date || result.first_air_date!).getFullYear()
                                : 'TBA'
                              }
                            </span>
                            <span className="text-yellow-500 text-xs">★ {result.vote_average.toFixed(1)}</span>
                            <span className="bg-[#2a3441] text-gray-300 text-xs px-2 py-1 rounded-full capitalize">
                              {result.media_type}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Theme Toggle */}
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className="ml-4 text-gray-400 hover:text-white hover:bg-[#1b1f23]"
          >
            <i className={`bx ${isDark ? 'bx-sun' : 'bx-moon'} text-xl`}></i>
          </Button>
        </div>
      </div>
    </header>
  );
}