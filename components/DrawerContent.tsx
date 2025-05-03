import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useColorScheme } from "@/hooks/useColorScheme";
import Colors from "@/constants/colors";
import { useProfileStore } from "@/stores/profileStore";
import { ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";

export function DrawerContent(props: DrawerContentComponentProps) {
  const colorScheme = useColorScheme();
  const { profile } = useProfileStore();
  const router = useRouter();

  return (
    <View style={[
      styles.container,
      { backgroundColor: colorScheme === 'dark' ? Colors.dark.background : Colors.light.background }
    ]}>
      <TouchableOpacity 
        style={styles.profileSection}
        onPress={() => router.push('/profile')}
      >
        <View style={[
          styles.profileAvatar,
          { backgroundColor: colorScheme === 'dark' ? '#333333' : '#EEEEEE' }
        ]}>
          {profile.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatarImage} />
          ) : (
            <Text style={[
              styles.avatarInitial,
              { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
            ]}>
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'G'}
            </Text>
          )}
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={[
            styles.profileName,
            { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
          ]}>
            {profile.name || "Guest User"}
          </Text>
          <Text style={[
            styles.profileEmail,
            { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
          ]}>
            {profile.email || "Set up your profile"}
          </Text>
        </View>
        
        <ChevronRight size={20} color={colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary} />
      </TouchableOpacity>
      
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      
      <View style={styles.footer}>
        <Text style={[
          styles.footerText,
          { color: colorScheme === 'dark' ? Colors.dark.textTertiary : Colors.light.textTertiary }
        ]}>
          GeoConnect v1.0.0
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: "600",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
  },
});