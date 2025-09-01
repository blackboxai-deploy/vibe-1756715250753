export interface WatchlistItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  addedAt: number;
}

export interface ContinueWatching {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  progress: number;
  lastWatched: number;
  season?: number;
  episode?: number;
  runtime?: number;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  defaultServer: string;
  autoplay: boolean;
  sandboxEnabled: boolean;
  language: string;
  profileImage?: string;
}

export interface SearchHistory {
  query: string;
  timestamp: number;
}

class LocalStorage {
  private isClient = typeof window !== 'undefined';

  // Watchlist Management
  getWatchlist(): WatchlistItem[] {
    if (!this.isClient) return [];
    try {
      const watchlist = localStorage.getItem('watchlist');
      return watchlist ? JSON.parse(watchlist) : [];
    } catch (error) {
      console.error('Error getting watchlist:', error);
      return [];
    }
  }

  addToWatchlist(item: Omit<WatchlistItem, 'addedAt'>): void {
    if (!this.isClient) return;
    try {
      const watchlist = this.getWatchlist();
      const exists = watchlist.find(w => w.id === item.id && w.type === item.type);
      
      if (!exists) {
        const newItem: WatchlistItem = {
          ...item,
          addedAt: Date.now()
        };
        watchlist.unshift(newItem);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  }

  removeFromWatchlist(id: number, type: 'movie' | 'tv'): void {
    if (!this.isClient) return;
    try {
      const watchlist = this.getWatchlist();
      const filtered = watchlist.filter(item => !(item.id === id && item.type === type));
      localStorage.setItem('watchlist', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  }

  isInWatchlist(id: number, type: 'movie' | 'tv'): boolean {
    if (!this.isClient) return false;
    const watchlist = this.getWatchlist();
    return watchlist.some(item => item.id === id && item.type === type);
  }

  // Continue Watching Management
  getContinueWatching(): ContinueWatching[] {
    if (!this.isClient) return [];
    try {
      const continueWatching = localStorage.getItem('continueWatching');
      return continueWatching ? JSON.parse(continueWatching) : [];
    } catch (error) {
      console.error('Error getting continue watching:', error);
      return [];
    }
  }

  addToContinueWatching(item: ContinueWatching): void {
    if (!this.isClient) return;
    try {
      let continueWatching = this.getContinueWatching();
      
      // Remove existing entry for same content
      continueWatching = continueWatching.filter(
        c => !(c.id === item.id && c.type === item.type && 
               c.season === item.season && c.episode === item.episode)
      );
      
      // Add new entry at the beginning
      continueWatching.unshift({
        ...item,
        lastWatched: Date.now()
      });
      
      // Keep only last 20 items
      continueWatching = continueWatching.slice(0, 20);
      
      localStorage.setItem('continueWatching', JSON.stringify(continueWatching));
    } catch (error) {
      console.error('Error adding to continue watching:', error);
    }
  }

  removeFromContinueWatching(id: number, type: 'movie' | 'tv', season?: number, episode?: number): void {
    if (!this.isClient) return;
    try {
      const continueWatching = this.getContinueWatching();
      const filtered = continueWatching.filter(item => {
        if (item.id !== id || item.type !== type) return true;
        if (type === 'tv' && (item.season !== season || item.episode !== episode)) return true;
        return false;
      });
      localStorage.setItem('continueWatching', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing from continue watching:', error);
    }
  }

  // User Preferences Management
  getUserPreferences(): UserPreferences {
    if (!this.isClient) {
      return {
        theme: 'dark',
        defaultServer: 'Change Server If Not Playing',
        autoplay: true,
        sandboxEnabled: true,
        language: 'en'
      };
    }
    
    try {
      const preferences = localStorage.getItem('userPreferences');
      const defaultPrefs: UserPreferences = {
        theme: 'dark',
        defaultServer: 'Change Server If Not Playing',
        autoplay: true,
        sandboxEnabled: true,
        language: 'en'
      };
      
      return preferences ? { ...defaultPrefs, ...JSON.parse(preferences) } : defaultPrefs;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {
        theme: 'dark',
        defaultServer: 'Change Server If Not Playing',
        autoplay: true,
        sandboxEnabled: true,
        language: 'en'
      };
    }
  }

  setUserPreferences(preferences: Partial<UserPreferences>): void {
    if (!this.isClient) return;
    try {
      const currentPrefs = this.getUserPreferences();
      const newPrefs = { ...currentPrefs, ...preferences };
      localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
    } catch (error) {
      console.error('Error setting user preferences:', error);
    }
  }

  // Search History Management
  getSearchHistory(): SearchHistory[] {
    if (!this.isClient) return [];
    try {
      const history = localStorage.getItem('searchHistory');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting search history:', error);
      return [];
    }
  }

  addToSearchHistory(query: string): void {
    if (!this.isClient || !query.trim()) return;
    try {
      let history = this.getSearchHistory();
      
      // Remove existing entry
      history = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());
      
      // Add new entry at the beginning
      history.unshift({
        query: query.trim(),
        timestamp: Date.now()
      });
      
      // Keep only last 10 searches
      history = history.slice(0, 10);
      
      localStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error adding to search history:', error);
    }
  }

  clearSearchHistory(): void {
    if (!this.isClient) return;
    try {
      localStorage.removeItem('searchHistory');
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }

  // Server Preferences
  getLastWorkingServer(movieId: number, type: 'movie' | 'tv'): string | null {
    if (!this.isClient) return null;
    try {
      const servers = localStorage.getItem('workingServers');
      const serverData = servers ? JSON.parse(servers) : {};
      const key = `${type}_${movieId}`;
      return serverData[key] || null;
    } catch (error) {
      console.error('Error getting last working server:', error);
      return null;
    }
  }

  setLastWorkingServer(movieId: number, type: 'movie' | 'tv', serverName: string): void {
    if (!this.isClient) return;
    try {
      const servers = localStorage.getItem('workingServers');
      const serverData = servers ? JSON.parse(servers) : {};
      const key = `${type}_${movieId}`;
      serverData[key] = serverName;
      localStorage.setItem('workingServers', JSON.stringify(serverData));
    } catch (error) {
      console.error('Error setting last working server:', error);
    }
  }

  // Generic storage methods
  setItem(key: string, value: any): void {
    if (!this.isClient) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  }

  getItem<T>(key: string, defaultValue: T): T {
    if (!this.isClient) return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return defaultValue;
    }
  }

  removeItem(key: string): void {
    if (!this.isClient) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  }

  // Clear all app data
  clearAllData(): void {
    if (!this.isClient) return;
    try {
      const keys = [
        'watchlist',
        'continueWatching',
        'userPreferences',
        'searchHistory',
        'workingServers'
      ];
      
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }
}

export const storage = new LocalStorage();