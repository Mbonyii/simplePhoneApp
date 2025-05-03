import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import Colors from "@/constants/colors";
import { MapPin, Home, Navigation, Save } from "lucide-react-native";
import { Stack, useRouter } from "expo-router";
import { useGeofenceStore } from "@/stores/geofenceStore";
import * as Location from "expo-location";
import { Image } from "expo-image";

export default function HomeLocationScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { homeLocation, setHomeLocation } = useGeofenceStore();
  
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
    })();
  }, []);

  const handleSaveCurrentLocation = () => {
    if (!currentLocation) {
      Alert.alert("Error", "Current location is not available");
      return;
    }

    setHomeLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      timestamp: new Date().toISOString(),
    });

    Alert.alert(
      "Success",
      "Home location saved successfully",
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <>
      <Stack.Screen options={{ 
        title: "Home Location",
        headerShown: true,
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background,
        },
        headerTintColor: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
      }} />
      
      <SafeAreaView style={[
        styles.container, 
        { backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background }
      ]}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        
        <View style={styles.mapContainer}>
          <Image
            source="https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b?q=80&w=2069&auto=format&fit=crop"
            style={styles.mapImage}
            contentFit="cover"
          />
          
          {homeLocation && (
            <View style={styles.homeMarker}>
              <Home size={24} color="#4A90E2" />
            </View>
          )}
          
          {currentLocation && (
            <View style={styles.currentLocationMarker}>
              <View style={styles.currentLocationDot} />
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={[
            styles.infoCard,
            { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }
          ]}>
            <View style={styles.infoHeader}>
              <Home size={24} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />
              <Text style={[
                styles.infoTitle,
                { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
              ]}>
                Home Location
              </Text>
            </View>
            
            {homeLocation ? (
              <View style={styles.coordinatesContainer}>
                <Text style={[
                  styles.coordinatesLabel,
                  { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
                ]}>
                  Coordinates
                </Text>
                <Text style={[
                  styles.coordinates,
                  { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
                ]}>
                  {homeLocation.latitude.toFixed(6)}, {homeLocation.longitude.toFixed(6)}
                </Text>
              </View>
            ) : (
              <Text style={[
                styles.noHomeText,
                { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
              ]}>
                No home location set
              </Text>
            )}
          </View>

          <View style={[
            styles.infoCard,
            { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }
          ]}>
            <View style={styles.infoHeader}>
              <Navigation size={24} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />
              <Text style={[
                styles.infoTitle,
                { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
              ]}>
                Current Location
              </Text>
            </View>
            
            {currentLocation ? (
              <View style={styles.coordinatesContainer}>
                <Text style={[
                  styles.coordinatesLabel,
                  { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
                ]}>
                  Coordinates
                </Text>
                <Text style={[
                  styles.coordinates,
                  { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
                ]}>
                  {currentLocation.coords.latitude.toFixed(6)}, {currentLocation.coords.longitude.toFixed(6)}
                </Text>
              </View>
            ) : (
              <Text style={[
                styles.noHomeText,
                { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
              ]}>
                Fetching current location...
              </Text>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.saveButton,
              { backgroundColor: colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint },
              !currentLocation && styles.disabledButton
            ]}
            onPress={handleSaveCurrentLocation}
            disabled={!currentLocation}
          >
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save Current as Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: 250,
    position: "relative",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  homeMarker: {
    position: "absolute",
    top: "40%",
    left: "60%",
    padding: 4,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
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
  infoContainer: {
    padding: 16,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  coordinatesContainer: {
    marginLeft: 32,
  },
  coordinatesLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 16,
    fontWeight: "500",
  },
  noHomeText: {
    marginLeft: 32,
    fontSize: 16,
    fontStyle: "italic",
  },
  buttonContainer: {
    padding: 16,
    marginTop: 'auto',
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 25,
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});