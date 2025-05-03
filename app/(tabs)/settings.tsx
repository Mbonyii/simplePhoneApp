import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Switch, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import Colors from "@/constants/colors";
import { Moon, Sun, Bell, Database, Trash2, Info, HelpCircle, LogOut } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useNotificationStore } from "@/stores/notificationStore";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const { notificationsEnabled, toggleNotifications } = useNotificationStore();

  const SettingItem = ({ icon, title, description, action, toggle, value }) => (
    <TouchableOpacity 
      style={[
        styles.settingItem,
        { borderBottomColor: colorScheme === 'dark' ? '#333333' : '#EEEEEE' }
      ]}
      onPress={action}
      disabled={toggle}
    >
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[
          styles.settingTitle,
          { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
        ]}>
          {title}
        </Text>
        {description && (
          <Text style={[
            styles.settingDescription,
            { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
          ]}>
            {description}
          </Text>
        )}
      </View>
      {toggle ? (
        <Switch
          value={value}
          onValueChange={action}
          trackColor={{ 
            false: colorScheme === 'dark' ? '#333333' : '#DDDDDD', 
            true: colorScheme === 'dark' ? '#50E3C2' : '#4A90E2' 
          }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <Text style={[
          styles.settingAction,
          { color: colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint }
        ]}>
          &gt;
        </Text>
      )}
    </TouchableOpacity>
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
          Settings
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
          ]}>
            APPEARANCE
          </Text>
          
          <SettingItem
            icon={colorScheme === 'dark' ? 
              <Moon size={22} color="#50E3C2" /> : 
              <Sun size={22} color="#4A90E2" />
            }
            title="Theme"
            description={colorScheme === 'dark' ? "Dark Mode" : "Light Mode"}
            action={toggleTheme}
            toggle={true}
            value={colorScheme === 'dark'}
          />
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
          ]}>
            NOTIFICATIONS
          </Text>
          
          <SettingItem
            icon={<Bell size={22} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />}
            title="Geofence Alerts"
            description="Receive notifications when entering or leaving geofences"
            action={toggleNotifications}
            toggle={true}
            value={notificationsEnabled}
          />
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
          ]}>
            DATA
          </Text>
          
          <SettingItem
            icon={<Database size={22} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />}
            title="Export Data"
            description="Export your geofences and settings"
            action={() => {}}
            toggle={false}
          />
          
          <SettingItem
            icon={<Trash2 size={22} color="#FF3B30" />}
            title="Clear All Data"
            description="Delete all geofences and reset settings"
            action={() => {}}
            toggle={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
          ]}>
            ABOUT
          </Text>
          
          <SettingItem
            icon={<Info size={22} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />}
            title="About GeoConnect"
            description="Version 1.0.0"
            action={() => {}}
            toggle={false}
          />
          
          <SettingItem
            icon={<HelpCircle size={22} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />}
            title="Help & Support"
            action={() => {}}
            toggle={false}
          />
        </View>

        <TouchableOpacity 
          style={[
            styles.logoutButton,
            { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }
          ]}
        >
          <LogOut size={22} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
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
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  settingAction: {
    fontSize: 18,
    fontWeight: "300",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#FF3B30",
  },
});