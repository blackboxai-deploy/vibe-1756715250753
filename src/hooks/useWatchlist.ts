import { useState, useEffect } from 'react';
import { WatchlistItem, Movie, TVShow } from '@/types';

const WATCHLIST_KEY = 'movieapp_watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWatchlist = () => {
      try {
        const stored = localStorage.getItem(WATCHLIST_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setWatchlist(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error('Error loading watchlist:', error);
        setWatchlist([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadWatchlist();
  }, []);

  const saveWatchlist = (newWatchlist: WatchlistItem[]) => {
    try {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(newWatchlist));
      setWatchlist(newWatchlist);
    } catch (error) {
      console.error('Error saving watchlist:', error);
    }
  };

  const addToWatchlist = (item: Movie | TVShow, type: 'movie' | 'tv') => {
    const watchlistItem: WatchlistItem = {
      id: item.id,
      type,
      title: type === 'movie' ? (item as Movie).title : (item as TVShow).name,
      poster_path: item.poster_path,
      vote_average: item.vote_average,
      release_date: type === 'movie' ? (item as Movie).release_date : undefined,
      first_air_date: type === 'tv' ? (item as TVShow).first_air_date : undefined,
      addedAt: Date.now(),
    };

    const newWatchlist = [watchlistItem, ...watchlist.filter(w => !(w.id === item.id && w.type === type))];
    saveWatchlist(newWatchlist);
  };

  const removeFromWatchlist = (id: number, type: 'movie' | 'tv') => {
    const newWatchlist = watchlist.filter(item => !(item.id === id && item.type === type));
    saveWatchlist(newWatchlist);
  };

  const isInWatchlist = (id: number, type: 'movie' | 'tv') => {
    return watchlist.some(item => item.id === id && item.type === type);
  };

  const toggleWatchlist = (item: Movie | TVShow, type: 'movie' | 'tv') => {
    if (isInWatchlist(item.id, type)) {
      removeFromWatchlist(item.id, type);
    } else {
      addToWatchlist(item, type);
    }
  };

  const clearWatchlist = () => {
    saveWatchlist([]);
  };

  const getWatchlistByType = (type: 'movie' | 'tv') => {
    return watchlist.filter(item => item.type === type);
  };

  const sortWatchlist = (sortBy: 'date' | 'title' | 'rating') => {
    const sorted = [...watchlist].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.addedAt - a.addedAt;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.vote_average - a.vote_average;
        default:
          return 0;
      }
    });
    setWatchlist(sorted);
  };

  return {
    watchlist,
    isLoading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    clearWatchlist,
    getWatchlistByType,
    sortWatchlist,
    count: watchlist.length,
  };
}