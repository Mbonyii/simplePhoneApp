import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Geofence {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  color: string;
  createdAt: string;
  notificationsEnabled?: boolean;
}

export interface HomeLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface GeofenceState {
  geofences: Geofence[];
  homeLocation: HomeLocation | null;
  addGeofence: (geofence: Geofence) => void;
  updateGeofence: (id: string, geofence: Partial<Geofence>) => void;
  removeGeofence: (id: string) => void;
  setHomeLocation: (location: HomeLocation) => void;
  toggleGeofenceNotifications: (id: string) => void;
}

export const useGeofenceStore = create<GeofenceState>()(
  persist(
    (set) => ({
      geofences: [],
      homeLocation: null,
      addGeofence: (geofence) => 
        set((state) => ({
          geofences: [...state.geofences, { ...geofence, notificationsEnabled: true }],
        })),
      updateGeofence: (id, updatedGeofence) => 
        set((state) => ({
          geofences: state.geofences.map((geofence) => 
            geofence.id === id ? { ...geofence, ...updatedGeofence } : geofence
          ),
        })),
      removeGeofence: (id) => 
        set((state) => ({
          geofences: state.geofences.filter((geofence) => geofence.id !== id),
        })),
      setHomeLocation: (location) => 
        set(() => ({
          homeLocation: location,
        })),
      toggleGeofenceNotifications: (id) => 
        set((state) => ({
          geofences: state.geofences.map((geofence) => 
            geofence.id === id 
              ? { ...geofence, notificationsEnabled: !geofence.notificationsEnabled } 
              : geofence
          ),
        })),
    }),
    {
      name: 'geofence-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);