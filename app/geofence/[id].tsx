import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import Colors from "@/constants/colors";
import { MapPin, Edit, Trash2, Bell, BellOff } from "lucide-react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useGeofenceStore } from "@/stores/geofenceStore";
import { Image } from "expo-image";
import { formatDate } from "@/utils/formatters";
import { Geofence } from "@/types/geofence";

export default function GeofenceDetailScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const geofenceId = id as string;
  const { geofences, removeGeofence, toggleGeofenceNotifications } = useGeofenceStore();
  const [geofence, setGeofence] = useState<Geofence | null>(null);

  useEffect(() => {
    const found = geofences.find(g => g.id === geofenceId);
    if (found) {
      setGeofence(found);
    } else {
      Alert.alert("Error", "Geofence not found", [
        { text: "OK", onPress: () => router.back() }
      ]);
    }
  }, [id, geofences]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Geofence",
      "Are you sure you want to delete this geofence?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            removeGeofence(geofenceId);
            router.back();
          }
        }
      ]
    );
  };

  const handleEdit = () => {
    // In a real app, you would navigate to an edit screen
    // For this demo, we'll just show an alert
    Alert.alert("Edit Geofence", "Edit functionality would be implemented here");
  };

  const handleToggleNotifications = () => {
    if (geofence) {
      toggleGeofenceNotifications(geofenceId);
    }
  };

  if (!geofence) {
    return (
      <SafeAreaView style={[
        styles.container, 
        { backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background }
      ]}>
        <Text style={[
          styles.loadingText,
          { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
        ]}>
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ 
        title: geofence.name,
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
          <View style={[styles.mapPin, { borderColor: geofence.color }]}>
            <MapPin size={24} color={geofence.color} />
          </View>
          <View style={[
            styles.radiusCircle, 
            { 
              borderColor: geofence.color, 
              width: Math.min(300, geofence.radius / 2), 
              height: Math.min(300, geofence.radius / 2),
              marginLeft: -Math.min(300, geofence.radius / 2) / 2,
              marginTop: -Math.min(300, geofence.radius / 2) / 2,
            }
          ]} />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={[
              styles.detailLabel,
              { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
            ]}>
              Name
            </Text>
            <Text style={[
              styles.detailValue,
              { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
            ]}>
              {geofence.name}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[
              styles.detailLabel,
              { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
            ]}>
              Radius
            </Text>
            <Text style={[
              styles.detailValue,
              { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
            ]}>
              {geofence.radius} meters
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[
              styles.detailLabel,
              { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
            ]}>
              Coordinates
            </Text>
            <Text style={[
              styles.detailValue,
              { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
            ]}>
              {geofence.latitude.toFixed(6)}, {geofence.longitude.toFixed(6)}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[
              styles.detailLabel,
              { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
            ]}>
              Created
            </Text>
            <Text style={[
              styles.detailValue,
              { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
            ]}>
              {formatDate(new Date(geofence.createdAt))}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[
              styles.detailLabel,
              { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
            ]}>
              Notifications
            </Text>
            <TouchableOpacity 
              style={[
                styles.notificationToggle,
                { 
                  backgroundColor: geofence.notificationsEnabled ? 
                    (colorScheme === 'dark' ? '#50E3C2' : '#4A90E2') : 
                    (colorScheme === 'dark' ? '#333333' : '#DDDDDD')
                }
              ]}
              onPress={handleToggleNotifications}
            >
              {geofence.notificationsEnabled ? (
                <Bell size={16} color="#FFFFFF" />
              ) : (
                <BellOff size={16} color={colorScheme === 'dark' ? '#777777' : '#999999'} />
              )}
              <Text style={[
                styles.notificationToggleText,
                { 
                  color: geofence.notificationsEnabled ? 
                    "#FFFFFF" : 
                    (colorScheme === 'dark' ? '#777777' : '#999999')
                }
              ]}>
                {geofence.notificationsEnabled ? "Enabled" : "Disabled"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }
            ]}
            onPress={handleEdit}
          >
            <Edit size={20} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />
            <Text style={[
              styles.actionButtonText,
              { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
            ]}>
              Edit
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.actionButton,
              { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }
            ]}
            onPress={handleDelete}
          >
            <Trash2 size={20} color="#FF3B30" />
            <Text style={[
              styles.actionButtonText,
              { color: "#FF3B30" }
            ]}>
              Delete
            </Text>
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
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 24,
  },
  mapContainer: {
    height: 250,
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
    borderWidth: 2,
    borderRadius: 150,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  detailsContainer: {
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 16,
  },
  notificationToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  notificationToggleText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "45%",
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
});