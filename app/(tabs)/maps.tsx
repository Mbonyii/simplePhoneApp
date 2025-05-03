import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import Colors from "@/constants/colors";
import { MapPin, Plus, Navigation } from "lucide-react-native";
import { useGeofenceStore } from "@/stores/geofenceStore";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

export default function MapsScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { geofences, homeLocation } = useGeofenceStore();
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

  // This is a placeholder for a real map
  // In a real app, you would use a map library like react-native-maps
  const MapPlaceholder = () => (
    <View style={styles.mapContainer}>
      <Image
        source="https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b?q=80&w=2069&auto=format&fit=crop"
        style={styles.mapImage}
        contentFit="cover"
      />
      {location && (
        <View style={styles.currentLocationMarker}>
          <View style={styles.currentLocationDot} />
        </View>
      )}
      {homeLocation && (
        <View style={styles.homeLocationMarker}>
          <MapPin size={24} color="#4A90E2" />
        </View>
      )}
      {geofences.map((geofence, index) => (
        <View key={index} style={styles.geofenceMarker}>
          <View style={[styles.geofenceCircle, { borderColor: geofence.color || '#50E3C2' }]} />
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[
      styles.container, 
      { backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background }
    ]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[
          styles.title, 
          { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
        ]}>
          Maps
        </Text>
        <TouchableOpacity 
          style={[
            styles.addButton,
            { backgroundColor: colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint }
          ]}
          onPress={() => router.push('/geofence/create')}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <MapPlaceholder />

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.footerButton,
            { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }
          ]}
          onPress={() => router.push('/home-location')}
        >
          <MapPin size={20} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />
          <Text style={[
            styles.footerButtonText,
            { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
          ]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.footerButton,
            { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }
          ]}
          onPress={() => router.push('/geofence/list')}
        >
          <Navigation size={20} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />
          <Text style={[
            styles.footerButtonText,
            { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
          ]}>
            Geofences
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    borderRadius: 16,
    margin: 16,
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  currentLocationMarker: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 24,
    height: 24,
    marginLeft: -12,
    marginTop: -12,
    borderRadius: 12,
    backgroundColor: "rgba(74, 144, 226, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  currentLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4A90E2",
  },
  homeLocationMarker: {
    position: "absolute",
    top: "30%",
    left: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  geofenceMarker: {
    position: "absolute",
    top: "60%",
    left: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  geofenceCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#50E3C2",
    backgroundColor: "rgba(80, 227, 194, 0.2)",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  footerButtonText: {
    marginLeft: 8,
    fontWeight: "500",
  },
});