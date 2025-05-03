import React from "react";
import { StyleSheet, Text, View, Switch, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import Colors from "@/constants/colors";
import { Moon, Sun, Bell, MapPin, Clock, Zap } from "lucide-react-native";
import { Stack } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { usePreferencesStore } from "@/stores/preferencesStore";

export default function PreferencesScreen() {
  const colorScheme = useColorScheme();
  const { toggleTheme } = useTheme();
  const { 
    notificationsEnabled, 
    locationTracking,
    backgroundUpdates,
    highAccuracy,
    toggleNotifications,
    toggleLocationTracking,
    toggleBackgroundUpdates,
    toggleHighAccuracy
  } = usePreferencesStore();

  const PreferenceItem = ({ 
    icon, 
    title, 
    description, 
    value, 
    onToggle 
  }: { 
    icon: React.ReactNode;
    title: string;
    description?: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <View style={[
      styles.preferenceItem,
      { borderBottomColor: colorScheme === 'dark' ? '#333333' : '#EEEEEE' }
    ]}>
      <View style={styles.preferenceIcon}>
        {icon}
      </View>
      <View style={styles.preferenceContent}>
        <Text style={[
          styles.preferenceTitle,
          { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
        ]}>
          {title}
        </Text>
        {description && (
          <Text style={[
            styles.preferenceDescription,
            { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
          ]}>
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ 
          false: colorScheme === 'dark' ? '#333333' : '#DDDDDD', 
          true: colorScheme === 'dark' ? '#50E3C2' : '#4A90E2' 
        }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ 
        title: "Preferences",
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
        
        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
            ]}>
              APPEARANCE
            </Text>
            
            <PreferenceItem
              icon={colorScheme === 'dark' ? 
                <Moon size={22} color="#50E3C2" /> : 
                <Sun size={22} color="#4A90E2" />
              }
              title="Dark Mode"
              description="Use dark theme throughout the app"
              value={colorScheme === 'dark'}
              onToggle={toggleTheme}
            />
          </View>

          <View style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
            ]}>
              NOTIFICATIONS
            </Text>
            
            <PreferenceItem
              icon={<Bell size={22} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />}
              title="Geofence Alerts"
              description="Receive notifications when entering or leaving geofences"
              value={notificationsEnabled}
              onToggle={toggleNotifications}
            />
          </View>

          <View style={styles.section}>
            <Text style={[
              styles.sectionTitle,
              { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
            ]}>
              LOCATION
            </Text>
            
            <PreferenceItem
              icon={<MapPin size={22} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />}
              title="Location Tracking"
              description="Allow the app to track your location"
              value={locationTracking}
              onToggle={toggleLocationTracking}
            />
            
            <PreferenceItem
              icon={<Clock size={22} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />}
              title="Background Updates"
              description="Continue tracking location when app is in background"
              value={backgroundUpdates}
              onToggle={toggleBackgroundUpdates}
            />
            
            <PreferenceItem
              icon={<Zap size={22} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />}
              title="High Accuracy"
              description="Use GPS for more precise location (higher battery usage)"
              value={highAccuracy}
              onToggle={toggleHighAccuracy}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[
              styles.footerText,
              { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
            ]}>
              Preferences are automatically saved and synced across your devices.
            </Text>
          </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  preferenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  preferenceContent: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
  },
  footer: {
    padding: 16,
    marginTop: 8,
    marginBottom: 32,
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
  },
});