import { useCallback, useEffect, useState } from 'react';
import {
  getToggledThemePreference,
  isValidThemePreference,
  ResolvedTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  ThemePreference,
} from '../utils/themeLogic';

function readInitialPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isValidThemePreference(stored)) {
      return stored;
    }
  } catch {
    // Ignore storage access restrictions
  }
  return 'system';
}

function readSystemPrefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return true;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export interface UseThemePreferenceReturn {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  systemTheme: ResolvedTheme;
  setPreference: (next: ThemePreference) => void;
  toggleTheme: () => void;
  resetToSystem: () => void;
}

export function useThemePreference(): UseThemePreferenceReturn {
  const [preference, setPreferenceState] = useState<ThemePreference>(readInitialPreference);
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(readSystemPrefersDark);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPrefersDark(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemPrefersDark(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const resolvedTheme = resolveTheme(preference, systemPrefersDark);
  const systemTheme: ResolvedTheme = systemPrefersDark ? 'dark' : 'light';

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.classList.toggle('light', resolvedTheme === 'light');
    root.dataset.theme = resolvedTheme;
    root.dataset.themePreference = preference;
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme, preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    if (typeof window !== 'undefined') {
      try {
        if (next === 'system') {
          window.localStorage.removeItem(THEME_STORAGE_KEY);
        } else {
          window.localStorage.setItem(THEME_STORAGE_KEY, next);
        }
      } catch {
        // Ignore storage access restrictions
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const next = getToggledThemePreference(resolvedTheme);
    setPreference(next);
  }, [resolvedTheme, setPreference]);

  const resetToSystem = useCallback(() => {
    setPreference('system');
  }, [setPreference]);

  return {
    preference,
    resolvedTheme,
    systemTheme,
    setPreference,
    toggleTheme,
    resetToSystem,
  };
}
