'use client';

import { useState, useEffect } from 'react';
import { getTheme, setTheme as setThemeStorage } from '@/lib/storage';

export const useTheme = () => {
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedTheme = getTheme();
    setThemeState(savedTheme);
    setIsLoading(false);

    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(savedTheme);
  }, []);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    setThemeStorage(newTheme);
    
    // Apply theme to document immediately
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isLoading,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
};