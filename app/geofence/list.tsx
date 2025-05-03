import React from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import Colors from "@/constants/colors";
import { MapPin, Plus, Trash2 } from "lucide-react-native";
import { Stack, useRouter } from "expo-router";
import { useGeofenceStore } from "@/stores/geofenceStore";
import { formatDistance } from "@/utils/formatters";
import { Geofence } from "@/types/geofence";

export default function GeofenceListScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { geofences, removeGeofence } = useGeofenceStore();

  const handleAddGeofence = () => {
    router.push('/geofence/create');
  };

  const handleViewGeofence = (id: string) => {
    router.push(`/geofence/${id}`);
  };

  const handleDeleteGeofence = (id: string) => {
    removeGeofence(id);
  };

  const renderGeofenceItem = ({ item }: { item: Geofence }) => (
    <TouchableOpacity 
      style={[
        styles.geofenceItem,
        { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }
      ]}
      onPress={() => handleViewGeofence(item.id)}
    >
      <View style={[styles.geofenceIcon, { backgroundColor: `${item.color}20` }]}>
        <MapPin size={20} color={item.color} />
      </View>
      
      <View style={styles.geofenceInfo}>
        <Text style={[
          styles.geofenceName,
          { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
        ]}>
          {item.name}
        </Text>
        <Text style={[
          styles.geofenceDetails,
          { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
        ]}>
          Radius: {item.radius}m • Created {formatDistance(new Date(item.createdAt))}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteGeofence(item.id)}
      >
        <Trash2 size={18} color="#FF3B30" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ 
        title: "Geofences",
        headerShown: true,
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background,
        },
        headerTintColor: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
        headerRight: () => (
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleAddGeofence}
          >
            <Plus size={24} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />
          </TouchableOpacity>
        ),
      }} />
      
      <SafeAreaView style={[
        styles.container, 
        { backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background }
      ]}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        
        {geofences.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MapPin size={48} color={colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary} />
            <Text style={[
              styles.emptyTitle,
              { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
            ]}>
              No Geofences Yet
            </Text>
            <Text style={[
              styles.emptyDescription,
              { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
            ]}>
              Create your first geofence to get started
            </Text>
            <TouchableOpacity 
              style={[
                styles.addButton,
                { backgroundColor: colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint }
              ]}
              onPress={handleAddGeofence}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Geofence</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={geofences}
            renderItem={renderGeofenceItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    marginRight: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  listContent: {
    padding: 16,
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
  geofenceDetails: {
    fontSize: 14,
  },
  deleteButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});