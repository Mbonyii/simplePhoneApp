import * as SQLite from 'expo-sqlite';

// Open or create the database
const db = SQLite.openDatabaseSync('geoconnect.db');

// Initialize the database tables
export async function initDatabase(): Promise<void> {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS geofences (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        radius REAL NOT NULL,
        color TEXT NOT NULL,
        created_at TEXT NOT NULL,
        notifications_enabled INTEGER DEFAULT 1
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS home_location (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        timestamp TEXT NOT NULL
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        type TEXT NOT NULL,
        geofence_id TEXT
      );
    `);
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Geofence CRUD operations
export async function getGeofences(): Promise<any[]> {
  try {
    const result = await db.getAllAsync('SELECT * FROM geofences ORDER BY created_at DESC;');
    return result;
  } catch (error) {
    console.error('Error getting geofences:', error);
    throw error;
  }
}

export async function addGeofence(geofence: {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  color: string;
  createdAt: string;
  notificationsEnabled: boolean;
}): Promise<void> {
  try {
    await db.runAsync(
      `INSERT INTO geofences (id, name, latitude, longitude, radius, color, created_at, notifications_enabled)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        geofence.id,
        geofence.name,
        geofence.latitude,
        geofence.longitude,
        geofence.radius,
        geofence.color,
        geofence.createdAt,
        geofence.notificationsEnabled ? 1 : 0
      ]
    );
  } catch (error) {
    console.error('Error adding geofence:', error);
    throw error;
  }
}

export async function updateGeofence(id: string, geofence: {
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  color: string;
  notificationsEnabled: boolean;
}): Promise<void> {
  try {
    await db.runAsync(
      `UPDATE geofences SET 
       name = ?, 
       latitude = ?, 
       longitude = ?, 
       radius = ?, 
       color = ?, 
       notifications_enabled = ?
       WHERE id = ?;`,
      [
        geofence.name,
        geofence.latitude,
        geofence.longitude,
        geofence.radius,
        geofence.color,
        geofence.notificationsEnabled ? 1 : 0,
        id
      ]
    );
  } catch (error) {
    console.error('Error updating geofence:', error);
    throw error;
  }
}

export async function deleteGeofence(id: string): Promise<void> {
  try {
    await db.runAsync('DELETE FROM geofences WHERE id = ?;', [id]);
  } catch (error) {
    console.error('Error deleting geofence:', error);
    throw error;
  }
}

// Home location operations
export async function getHomeLocation(): Promise<any> {
  try {
    const result = await db.getFirstAsync('SELECT * FROM home_location ORDER BY id DESC LIMIT 1;');
    return result;
  } catch (error) {
    console.error('Error getting home location:', error);
    throw error;
  }
}

export async function setHomeLocation(location: {
  latitude: number;
  longitude: number;
  timestamp: string;
}): Promise<void> {
  try {
    await db.withTransactionAsync(async () => {
      await db.runAsync('DELETE FROM home_location;');
      await db.runAsync(
        `INSERT INTO home_location (latitude, longitude, timestamp)
         VALUES (?, ?, ?);`,
        [location.latitude, location.longitude, location.timestamp]
      );
    });
  } catch (error) {
    console.error('Error setting home location:', error);
    throw error;
  }
}

// Notification operations
export async function getNotifications(): Promise<any[]> {
  try {
    const result = await db.getAllAsync('SELECT * FROM notifications ORDER BY timestamp DESC;');
    return result;
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
}

export async function addNotification(notification: {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: string;
  geofenceId?: string;
}): Promise<void> {
  try {
    await db.runAsync(
      `INSERT INTO notifications (id, title, message, timestamp, type, geofence_id)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [
        notification.id,
        notification.title,
        notification.message,
        notification.timestamp,
        notification.type,
        notification.geofenceId || null
      ]
    );
  } catch (error) {
    console.error('Error adding notification:', error);
    throw error;
  }
}

export async function deleteNotification(id: string): Promise<void> {
  try {
    await db.runAsync('DELETE FROM notifications WHERE id = ?;', [id]);
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}

export async function clearNotifications(): Promise<void> {
  try {
    await db.runAsync('DELETE FROM notifications;');
  } catch (error) {
    console.error('Error clearing notifications:', error);
    throw error;
  }
}