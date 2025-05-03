import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Drawer } from "expo-router/drawer";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ErrorBoundary } from "./error-boundary";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemeProvider } from "@/context/ThemeContext";
import { DrawerContent } from "@/components/DrawerContent";
import { MapPin, Settings, Home, User, Phone, PaintBucket } from "lucide-react-native";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <RootLayoutNav />
        </ThemeProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  
  return (
    <Drawer 
      drawerContent={(props: DrawerContentComponentProps) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colorScheme === 'dark' ? '#50E3C2' : '#4A90E2',
        drawerInactiveTintColor: colorScheme === 'dark' ? '#AAAAAA' : '#666666',
        drawerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#121212' : '#FFFFFF',
        }
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Home",
          title: "Home",
          drawerIcon: ({ color }: { color: string }) => <Home size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: "Profile",
          title: "Profile",
          drawerIcon: ({ color }: { color: string }) => <User size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="contacts"
        options={{
          drawerLabel: "Contacts",
          title: "Contacts",
          drawerIcon: ({ color }: { color: string }) => <Phone size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="preferences"
        options={{
          drawerLabel: "Preferences",
          title: "Preferences",
          drawerIcon: ({ color }: { color: string }) => <PaintBucket size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="modal"
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}