'use client';

import { useState, useEffect } from 'react';
import { Movie, TVShow, WatchlistItem } from '@/types';
import { 
  getWatchlist, 
  addToWatchlist as addToWatchlistStorage, 
  removeFromWatchlist as removeFromWatchlistStorage,
  isInWatchlist as checkIsInWatchlist
} from '@/lib/storage';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWatchlist = () => {
      const items = getWatchlist();
      setWatchlist(items);
      setIsLoading(false);
    };

    loadWatchlist();

    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'streaming_app_watchlist') {
        loadWatchlist();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToWatchlist = (item: Movie | TVShow, type: 'movie' | 'tv') => {
    addToWatchlistStorage(item, type);
    const updatedWatchlist = getWatchlist();
    setWatchlist(updatedWatchlist);
  };

  const removeFromWatchlist = (id: number, type: 'movie' | 'tv') => {
    removeFromWatchlistStorage(id, type);
    const updatedWatchlist = getWatchlist();
    setWatchlist(updatedWatchlist);
  };

  const isInWatchlist = (id: number, type: 'movie' | 'tv'): boolean => {
    return checkIsInWatchlist(id, type);
  };

  const toggleWatchlist = (item: Movie | TVShow, type: 'movie' | 'tv') => {
    if (isInWatchlist(item.id, type)) {
      removeFromWatchlist(item.id, type);
    } else {
      addToWatchlist(item, type);
    }
  };

  return {
    watchlist,
    isLoading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    count: watchlist.length
  };
};