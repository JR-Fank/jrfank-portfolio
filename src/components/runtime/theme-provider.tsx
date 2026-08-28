'use client';

import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

import type { ThemeState } from '@/content/types';

interface ThemeContextValue {
  readonly theme: ThemeState;
  readonly toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeState>('dark');
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    setTheme(document.documentElement.classList.contains('light-mode') ? 'light' : 'dark');
    return () => {
      if (transitionTimer.current) {
        clearTimeout(transitionTimer.current);
      }
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const nextTheme: ThemeState = root.classList.contains('light-mode') ? 'dark' : 'light';
    root.classList.add('transition');
    root.classList.toggle('light-mode', nextTheme === 'light');

    if (nextTheme === 'light') {
      localStorage.setItem('light-mode', 'true');
    } else {
      localStorage.removeItem('light-mode');
    }
    setTheme(nextTheme);

    if (transitionTimer.current) {
      clearTimeout(transitionTimer.current);
    }
    transitionTimer.current = setTimeout(() => root.classList.remove('transition'), 750);
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider.');
  }
  return context;
}
