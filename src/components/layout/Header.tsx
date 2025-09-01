"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Moon, Sun, User, Settings, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { searchMulti } from "@/lib/api/tmdb";
import { SearchResult } from "@/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.trim().length > 2) {
      setIsLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const results = await searchMulti(searchQuery);
          setSearchResults(results.results.slice(0, 8));
        } catch (error) {
          console.error("Search error:", error);
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
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearchResultClick = (result: SearchResult) => {
    if (result.media_type === "movie") {
      router.push(`/movies/${result.id}`);
    } else if (result.media_type === "tv") {
      router.push(`/tv/${result.id}`);
    }
    setIsSearchFocused(false);
    setSearchQuery("");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
    }
  };

  const getImageUrl = (path: string | null, size: string = "w92") => {
    if (!path) return "/placeholder-poster.jpg";
    return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/${size}${path}`;
  };

  const getTitle = (result: SearchResult) => {
    return result.title || result.name || "Unknown";
  };

  const getYear = (result: SearchResult) => {
    const date = result.release_date || result.first_air_date;
    return date ? new Date(date).getFullYear() : "";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500">
            <span className="text-sm font-bold text-white">M</span>
          </div>
          <span className="hidden font-bold text-xl md:inline-block">MovieStream</span>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md mx-4" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search movies, TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="pl-10 pr-4 bg-muted/50 border-muted-foreground/20 focus:border-orange-500/50 focus:ring-orange-500/20"
              />
            </div>
          </form>

          {/* Search Results Dropdown */}
          {isSearchFocused && (searchResults.length > 0 || isLoading || searchQuery.length > 2) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  <div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2 text-sm">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((result) => (
                    <div
                      key={`${result.media_type}-${result.id}`}
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleSearchResultClick(result)}
                    >
                      <div className="relative h-12 w-8 flex-shrink-0 rounded overflow-hidden bg-muted">
                        <Image
                          src={getImageUrl(result.poster_path || result.profile_path)}
                          alt={getTitle(result)}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{getTitle(result)}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getYear(result) && (
                            <span className="text-xs text-muted-foreground">{getYear(result)}</span>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {result.media_type === "movie" ? "Movie" : result.media_type === "tv" ? "TV" : "Person"}
                          </Badge>
                          {result.vote_average && result.vote_average > 0 && (
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-yellow-500">★</span>
                              <span className="text-xs text-muted-foreground">
                                {result.vote_average.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {searchQuery.trim() && (
                    <div className="border-t border-border mt-2 pt-2">
                      <button
                        onClick={() => {
                          router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                          setIsSearchFocused(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-orange-500 hover:bg-muted/50 transition-colors"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  )}
                </div>
              ) : searchQuery.length > 2 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <p className="text-sm">No results found for "{searchQuery}"</p>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Watchlist */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/profile")}
            className="h-9 w-9 relative"
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Watchlist</span>
          </Button>

          {/* Continue Watching */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/profile")}
            className="h-9 w-9 hidden md:flex"
          >
            <Clock className="h-4 w-4" />
            <span className="sr-only">Continue Watching</span>
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/settings")}
            className="h-9 w-9 hidden md:flex"
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>

          {/* Profile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/profile")}
            className="h-9 w-9"
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src="/default-avatar.jpg" alt="Profile" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </div>
    </header>
  );
}