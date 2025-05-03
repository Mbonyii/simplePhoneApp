import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import Colors from "@/constants/colors";
import { MapPin, Bell, Home as HomeIcon } from "lucide-react-native";
import { Card } from "@/components/Card";
import { useGeofenceStore } from "@/stores/geofenceStore";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { geofences } = useGeofenceStore();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleAddGeofence = () => {
    router.push('/geofence/create');
  };

  const handleViewGeofences = () => {
    router.push('/geofence/list');
  };

  return (
    <SafeAreaView style={[
      styles.container, 
      { backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background }
    ]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[
            styles.title, 
            { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
          ]}>
            GeoConnect
          </Text>
          <Text style={[
            styles.subtitle, 
            { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
          ]}>
            Your location companion
          </Text>
        </View>

        <LinearGradient
          colors={colorScheme === 'dark' ? ['#2A2A2A', '#1A1A1A'] : ['#F8F9FA', '#E9ECEF']}
          style={styles.statsCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[
                styles.statValue, 
                { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
              ]}>
                {geofences.length}
              </Text>
              <Text style={[
                styles.statLabel, 
                { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
              ]}>
                Active Geofences
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[
                styles.statValue, 
                { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
              ]}>
                {location ? 
                  `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}` : 
                  'Loading...'}
              </Text>
              <Text style={[
                styles.statLabel, 
                { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
              ]}>
                Current Location
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.cardsContainer}>
          <Card 
            title="Geofencing" 
            description="Create and manage virtual boundaries"
            icon={<MapPin size={24} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />}
            onPress={handleAddGeofence}
            colorScheme={colorScheme}
          />
          
          <Card 
            title="Home Location" 
            description="Set and update your home coordinates"
            icon={<HomeIcon size={24} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />}
            onPress={() => router.push('/home-location')}
            colorScheme={colorScheme}
          />
          
          <Card 
            title="Notifications" 
            description="Manage geofence alerts and settings"
            icon={<Bell size={24} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />}
            onPress={() => router.push('/notifications')}
            colorScheme={colorScheme}
          />
        </View>

        {geofences.length > 0 && (
          <View style={styles.geofenceSection}>
            <View style={styles.sectionHeader}>
              <Text style={[
                styles.sectionTitle, 
                { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
              ]}>
                Active Geofences
              </Text>
              <TouchableOpacity onPress={handleViewGeofences}>
                <Text style={[
                  styles.viewAll, 
                  { color: colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint }
                ]}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            
            {geofences.slice(0, 2).map((geofence, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.geofenceItem,
                  { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }
                ]}
                onPress={() => router.push(`/geofence/${geofence.id}`)}
              >
                <View style={styles.geofenceIcon}>
                  <MapPin size={20} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />
                </View>
                <View style={styles.geofenceInfo}>
                  <Text style={[
                    styles.geofenceName, 
                    { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
                  ]}>
                    {geofence.name}
                  </Text>
                  <Text style={[
                    styles.geofenceRadius, 
                    { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
                  ]}>
                    Radius: {geofence.radius}m
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  statsCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#DDDDDD",
    marginHorizontal: 16,
  },
  cardsContainer: {
    marginBottom: 24,
  },
  geofenceSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  viewAll: {
    fontSize: 14,
  },
  geofenceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  geofenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  geofenceInfo: {
    flex: 1,
  },
  geofenceName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  geofenceRadius: {
    fontSize: 14,
  },
});