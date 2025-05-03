import { usePreferencesStore } from '@/stores/preferencesStore';

export function useColorScheme() {
  const { darkMode } = usePreferencesStore();
  return darkMode ? 'dark' : 'light';
}