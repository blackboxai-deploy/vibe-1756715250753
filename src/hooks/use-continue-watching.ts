'use client';

import { useState, useEffect } from 'react';
import { Movie, TVShow, ContinueWatchingItem } from '@/types';
import { 
  getContinueWatching, 
  addToContinueWatching as addToContinueWatchingStorage,
  removeFromContinueWatching as removeFromContinueWatchingStorage
} from '@/lib/storage';

export const useContinueWatching = () => {
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContinueWatching = () => {
      const items = getContinueWatching();
      setContinueWatching(items);
      setIsLoading(false);
    };

    loadContinueWatching();

    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'streaming_app_continue_watching') {
        loadContinueWatching();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToContinueWatching = (
    item: Movie | TVShow,
    type: 'movie' | 'tv',
    progress: number,
    currentTime: number,
    totalTime: number,
    season?: number,
    episode?: number
  ) => {
    addToContinueWatchingStorage(item, type, progress, currentTime, totalTime, season, episode);
    const updatedItems = getContinueWatching();
    setContinueWatching(updatedItems);
  };

  const removeFromContinueWatching = (id: number, type: 'movie' | 'tv') => {
    removeFromContinueWatchingStorage(id, type);
    const updatedItems = getContinueWatching();
    setContinueWatching(updatedItems);
  };

  const getCurrentlyWatching = (): ContinueWatchingItem | null => {
    return continueWatching.length > 0 ? continueWatching[0] : null;
  };

  return {
    continueWatching,
    isLoading,
    addToContinueWatching,
    removeFromContinueWatching,
    getCurrentlyWatching,
    count: continueWatching.length
  };
};