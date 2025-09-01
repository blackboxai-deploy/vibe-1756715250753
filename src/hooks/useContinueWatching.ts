import { useState, useEffect } from 'react';
import { ContinueWatching } from '@/types';

const CONTINUE_WATCHING_KEY = 'continueWatching';

export function useContinueWatching() {
  const [continueWatching, setContinueWatching] = useState<ContinueWatching[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(CONTINUE_WATCHING_KEY);
    if (stored) {
      try {
        setContinueWatching(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing continue watching data:', error);
        localStorage.removeItem(CONTINUE_WATCHING_KEY);
      }
    }
  }, []);

  const addToContinueWatching = (item: Omit<ContinueWatching, 'lastWatched'>) => {
    const newItem: ContinueWatching = {
      ...item,
      lastWatched: Date.now(),
    };

    setContinueWatching(prev => {
      const filtered = prev.filter(existing => 
        !(existing.id === item.id && existing.type === item.type)
      );
      const updated = [newItem, ...filtered].slice(0, 10); // Keep only last 10 items
      localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateProgress = (id: number, type: 'movie' | 'tv', progress: number, season?: number, episode?: number) => {
    setContinueWatching(prev => {
      const updated = prev.map(item => {
        if (item.id === id && item.type === type) {
          return {
            ...item,
            progress,
            lastWatched: Date.now(),
            ...(season !== undefined && { season }),
            ...(episode !== undefined && { episode }),
          };
        }
        return item;
      });
      localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromContinueWatching = (id: number, type: 'movie' | 'tv') => {
    setContinueWatching(prev => {
      const updated = prev.filter(item => !(item.id === id && item.type === type));
      localStorage.setItem(CONTINUE_WATCHING_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearContinueWatching = () => {
    setContinueWatching([]);
    localStorage.removeItem(CONTINUE_WATCHING_KEY);
  };

  const getCurrentlyWatching = () => {
    return continueWatching.length > 0 ? continueWatching[0] : null;
  };

  return {
    continueWatching,
    addToContinueWatching,
    updateProgress,
    removeFromContinueWatching,
    clearContinueWatching,
    getCurrentlyWatching,
  };
}