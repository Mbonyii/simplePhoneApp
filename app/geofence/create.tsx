import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import Colors from "@/constants/colors";
import { MapPin, Save, AlertCircle } from "lucide-react-native";
import { Stack, useRouter } from "expo-router";
import { useGeofenceStore } from "@/stores/geofenceStore";
import * as Location from "expo-location";
import { Image } from "expo-image";
import { v4 as uuidv4 } from "@/utils/uuid";

export default function CreateGeofenceScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { addGeofence } = useGeofenceStore();
  
  const [name, setName] = useState("");
  const [radius, setRadius] = useState("100");
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [color, setColor] = useState("#4A90E2");

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

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a name for the geofence");
      return;
    }

    if (!radius || isNaN(Number(radius)) || Number(radius) <= 0) {
      Alert.alert("Error", "Please enter a valid radius");
      return;
    }

    if (!location) {
      Alert.alert("Error", "Location data is not available");
      return;
    }

    const newGeofence = {
      id: uuidv4(),
      name: name.trim(),
      radius: Number(radius),
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      color,
      createdAt: new Date().toISOString(),
    };

    addGeofence(newGeofence);
    Alert.alert(
      "Success",
      "Geofence created successfully",
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  const colorOptions = [
    "#4A90E2", // Blue
    "#50E3C2", // Teal
    "#FF9500", // Orange
    "#FF3B30", // Red
    "#5856D6", // Purple
    "#34C759", // Green
  ];

  return (
    <>
      <Stack.Screen options={{ 
        title: "Create Geofence",
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
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          {errorMsg ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={24} color="#FF3B30" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : (
            <>
              <View style={styles.mapPreview}>
                <Image
                  source="https://images.unsplash.com/photo-1569336415962-a4bd9f69c07b?q=80&w=2069&auto=format&fit=crop"
                  style={styles.mapImage}
                  contentFit="cover"
                />
                <View style={[styles.mapPin, { borderColor: color }]}>
                  <MapPin size={24} color={color} />
                </View>
                <View style={[styles.radiusCircle, { borderColor: color, width: 100, height: 100 }]} />
              </View>

              <View style={styles.formSection}>
                <Text style={[
                  styles.sectionTitle,
                  { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
                ]}>
                  GEOFENCE DETAILS
                </Text>
                
                <View style={styles.inputGroup}>
                  <Text style={[
                    styles.inputLabel,
                    { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
                  ]}>
                    Name
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
                        backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5',
                      }
                    ]}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter geofence name"
                    placeholderTextColor={colorScheme === 'dark' ? '#777777' : '#999999'}
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={[
                    styles.inputLabel,
                    { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
                  ]}>
                    Radius (meters)
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
                        backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5',
                      }
                    ]}
                    value={radius}
                    onChangeText={setRadius}
                    placeholder="Enter radius in meters"
                    placeholderTextColor={colorScheme === 'dark' ? '#777777' : '#999999'}
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={[
                    styles.inputLabel,
                    { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
                  ]}>
                    Location
                  </Text>
                  <View style={[
                    styles.locationDisplay,
                    { 
                      backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5',
                    }
                  ]}>
                    <MapPin size={20} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />
                    <Text style={[
                      styles.locationText,
                      { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
                    ]}>
                      {location ? 
                        `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}` : 
                        "Fetching location..."}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={[
                    styles.inputLabel,
                    { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
                  ]}>
                    Color
                  </Text>
                  <View style={styles.colorOptions}>
                    {colorOptions.map((colorOption) => (
                      <TouchableOpacity
                        key={colorOption}
                        style={[
                          styles.colorOption,
                          { backgroundColor: colorOption },
                          color === colorOption && styles.colorOptionSelected
                        ]}
                        onPress={() => setColor(colorOption)}
                      />
                    ))}
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                style={[
                  styles.saveButton,
                  { backgroundColor: colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint }
                ]}
                onPress={handleSave}
              >
                <Save size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Geofence</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
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
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    marginLeft: 8,
    color: "#FF3B30",
    fontSize: 16,
  },
  mapPreview: {
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    position: "relative",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  mapPin: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -12,
    marginTop: -24,
    borderWidth: 2,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  radiusCircle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -50,
    marginTop: -50,
    borderWidth: 2,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  locationDisplay: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
  },
  colorOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    marginBottom: 12,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 25,
    marginBottom: 32,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});