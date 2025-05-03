import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Profile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string | null;
}

interface ProfileState {
  profile: Profile;
  updateProfile: (profile: Partial<Profile>) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: {
        name: '',
        email: '',
        phone: '',
        bio: '',
        avatar: null,
      },
      updateProfile: (newProfileData) => 
        set((state) => ({
          profile: { ...state.profile, ...newProfileData },
        })),
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);