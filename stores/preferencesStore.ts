import { create } from 'zustand';

interface PreferencesState {
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  notificationsEnabled: boolean;
  locationTracking: boolean;
  backgroundUpdates: boolean;
  highAccuracy: boolean;
  toggleNotifications: () => void;
  toggleLocationTracking: () => void;
  toggleBackgroundUpdates: () => void;
  toggleHighAccuracy: () => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  darkMode: false,
  setDarkMode: (enabled) => set({ darkMode: enabled }),
  notificationsEnabled: true,
  locationTracking: true,
  backgroundUpdates: true,
  highAccuracy: false,
  toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
  toggleLocationTracking: () => set((state) => ({ locationTracking: !state.locationTracking })),
  toggleBackgroundUpdates: () => set((state) => ({ backgroundUpdates: !state.backgroundUpdates })),
  toggleHighAccuracy: () => set((state) => ({ highAccuracy: !state.highAccuracy })),
}));