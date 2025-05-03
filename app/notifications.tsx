import React from "react";
import { StyleSheet, Text, View, Switch, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import Colors from "@/constants/colors";
import { Bell, BellOff, Trash2, MapPin } from "lucide-react-native";
import { Stack } from "expo-router";
import { useNotificationStore } from "@/stores/notificationStore";
import { formatTimeAgo } from "@/utils/formatters";

type AppNotification = {
  id: string;
  title: string;
  message: string;
  type: 'enter' | 'exit' | 'info';
  timestamp: string;
};

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const { 
    notificationsEnabled, 
    notifications, 
    toggleNotifications, 
    clearNotifications,
    removeNotification
  } = useNotificationStore();

  const renderNotificationItem = ({ item }: { item: AppNotification }) => (
    <View style={[
      styles.notificationItem,
      { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }
    ]}>
      <View style={[
        styles.notificationIcon,
        { backgroundColor: item.type === 'enter' ? '#34C759' : item.type === 'exit' ? '#FF9500' : '#FF9500' }
      ]}>
        <MapPin size={20} color="#FFFFFF" />
      </View>
      
      <View style={styles.notificationContent}>
        <Text style={[
          styles.notificationTitle,
          { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
        ]}>
          {item.title}
        </Text>
        <Text style={[
          styles.notificationMessage,
          { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
        ]}>
          {item.message}
        </Text>
        <Text style={[
          styles.notificationTime,
          { color: colorScheme === 'dark' ? Colors.dark.textTertiary : Colors.light.textTertiary }
        ]}>
          {formatTimeAgo(new Date(item.timestamp))}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => removeNotification(item.id)}
      >
        <Trash2 size={18} color={colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ 
        title: "Notifications",
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
        
        <View style={[
          styles.settingCard,
          { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }
        ]}>
          <View style={styles.settingRow}>
            {notificationsEnabled ? (
              <Bell size={24} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />
            ) : (
              <BellOff size={24} color={colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary} />
            )}
            
            <View style={styles.settingContent}>
              <Text style={[
                styles.settingTitle,
                { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
              ]}>
                Geofence Notifications
              </Text>
              <Text style={[
                styles.settingDescription,
                { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
              ]}>
                Receive alerts when entering or leaving geofences
              </Text>
            </View>
            
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ 
                false: colorScheme === 'dark' ? '#333333' : '#DDDDDD', 
                true: colorScheme === 'dark' ? '#50E3C2' : '#4A90E2' 
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.notificationsHeader}>
          <Text style={[
            styles.notificationsTitle,
            { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
          ]}>
            Recent Notifications
          </Text>
          
          {notifications.length > 0 && (
            <TouchableOpacity onPress={clearNotifications}>
              <Text style={[
                styles.clearButton,
                { color: colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint }
              ]}>
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <BellOff size={48} color={colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary} />
            <Text style={[
              styles.emptyTitle,
              { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
            ]}>
              No Notifications
            </Text>
            <Text style={[
              styles.emptyDescription,
              { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
            ]}>
              {notificationsEnabled ? 
                "You'll see notifications here when you enter or leave geofences" : 
                "Enable notifications to receive geofence alerts"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
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
  settingCard: {
    margin: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  notificationsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  notificationsTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  clearButton: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: "center",
  },
  listContent: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: "row",
    borderRadius: 12,
    marginBottom: 8,
    padding: 16,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  deleteButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});