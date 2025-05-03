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