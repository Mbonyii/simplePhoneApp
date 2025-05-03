import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from '@/utils/uuid';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'enter' | 'exit' | 'info';
  geofenceId?: string;
}

interface NotificationState {
  notificationsEnabled: boolean;
  notifications: Notification[];
  toggleNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      notifications: [
        {
          id: '1',
          title: 'Welcome to GeoConnect',
          message: 'Set up your first geofence to get started',
          timestamp: new Date().toISOString(),
          type: 'info',
        },
      ],
      toggleNotifications: () => 
        set((state) => ({
          notificationsEnabled: !state.notificationsEnabled,
        })),
      addNotification: (notification) => 
        set((state) => ({
          notifications: [
            {
              id: uuidv4(),
              ...notification,
              timestamp: new Date().toISOString(),
            },
            ...state.notifications,
          ].slice(0, 50), // Keep only the 50 most recent notifications
        })),
      removeNotification: (id) => 
        set((state) => ({
          notifications: state.notifications.filter((notification) => notification.id !== id),
        })),
      clearNotifications: () => 
        set(() => ({
          notifications: [],
        })),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);