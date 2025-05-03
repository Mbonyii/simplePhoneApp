import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import Colors from "@/constants/colors";
import { User, Camera, Image as ImageIcon, ChevronDown, ChevronUp, Save } from "lucide-react-native";
import { Image } from "expo-image";
import { useProfileStore } from "@/stores/profileStore";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { profile, updateProfile } = useProfileStore();
  const [name, setName] = useState(profile.name || "");
  const [email, setEmail] = useState(profile.email || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [showMediaOptions, setShowMediaOptions] = useState(false);

  const handleSave = () => {
    updateProfile({
      name,
      email,
      phone,
      bio,
      avatar: profile.avatar,
    });
    Alert.alert("Success", "Profile updated successfully");
  };

  const pickImage = async (useCamera = false) => {
    setShowMediaOptions(false);
    
    try {
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission Denied", "Camera permission is required to take photos");
          return;
        }
        
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
        
        if (!result.canceled) {
          updateProfile({ ...profile, avatar: result.assets[0].uri });
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission Denied", "Gallery permission is required to select photos");
          return;
        }
        
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
        
        if (!result.canceled) {
          updateProfile({ ...profile, avatar: result.assets[0].uri });
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  return (
    <>
      <Stack.Screen options={{ 
        title: "Profile",
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
          <View style={styles.avatarContainer}>
            <View style={[
              styles.avatar,
              { backgroundColor: colorScheme === 'dark' ? '#333333' : '#EEEEEE' }
            ]}>
              {profile.avatar ? (
                <Image
                  source={{ uri: profile.avatar }}
                  style={styles.avatarImage}
                  contentFit="cover"
                />
              ) : (
                <User size={40} color={colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary} />
              )}
            </View>
            
            <TouchableOpacity 
              style={[
                styles.changePhotoButton,
                { backgroundColor: colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint }
              ]}
              onPress={() => setShowMediaOptions(!showMediaOptions)}
            >
              <Text style={styles.changePhotoText}>Change Photo</Text>
              {showMediaOptions ? (
                <ChevronUp size={16} color="#FFFFFF" />
              ) : (
                <ChevronDown size={16} color="#FFFFFF" />
              )}
            </TouchableOpacity>
            
            {showMediaOptions && (
              <View style={[
                styles.mediaOptions,
                { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }
              ]}>
                <TouchableOpacity 
                  style={styles.mediaOption}
                  onPress={() => pickImage(true)}
                >
                  <Camera size={20} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />
                  <Text style={[
                    styles.mediaOptionText,
                    { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
                  ]}>
                    Take Photo
                  </Text>
                </TouchableOpacity>
                
                <View style={[
                  styles.mediaOptionDivider,
                  { backgroundColor: colorScheme === 'dark' ? '#333333' : '#DDDDDD' }
                ]} />
                
                <TouchableOpacity 
                  style={styles.mediaOption}
                  onPress={() => pickImage(false)}
                >
                  <ImageIcon size={20} color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint} />
                  <Text style={[
                    styles.mediaOptionText,
                    { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
                  ]}>
                    Choose from Gallery
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.formSection}>
            <Text style={[
              styles.sectionTitle,
              { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
            ]}>
              PERSONAL INFORMATION
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
                placeholder="Enter your name"
                placeholderTextColor={colorScheme === 'dark' ? '#777777' : '#999999'}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[
                styles.inputLabel,
                { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
              ]}>
                Email
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
                    backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5',
                  }
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colorScheme === 'dark' ? '#777777' : '#999999'}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[
                styles.inputLabel,
                { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
              ]}>
                Phone
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
                    backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5',
                  }
                ]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                placeholderTextColor={colorScheme === 'dark' ? '#777777' : '#999999'}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[
                styles.inputLabel,
                { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
              ]}>
                Bio
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  { 
                    color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text,
                    backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5',
                  }
                ]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                placeholderTextColor={colorScheme === 'dark' ? '#777777' : '#999999'}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
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
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </TouchableOpacity>
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
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  changePhotoText: {
    color: "#FFFFFF",
    fontWeight: "500",
    marginRight: 4,
  },
  mediaOptions: {
    position: "absolute",
    top: 140,
    width: "80%",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1,
  },
  mediaOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  mediaOptionText: {
    marginLeft: 12,
    fontSize: 16,
  },
  mediaOptionDivider: {
    height: 1,
    width: "100%",
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
  textArea: {
    minHeight: 100,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
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