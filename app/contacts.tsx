import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Alert, Linking, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import Colors from "@/constants/colors";
import { User, Phone, Search, X, PhoneCall } from "lucide-react-native";
import { Stack } from "expo-router";
import * as Contacts from "expo-contacts";

export default function ContactsScreen() {
  const colorScheme = useColorScheme();
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contacts.Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
          sort: Contacts.SortTypes.FirstName,
        });
        
        if (data.length > 0) {
          // Filter contacts to only include those with phone numbers
          const contactsWithPhones = data.filter(contact => 
            contact.phoneNumbers && contact.phoneNumbers.length > 0
          );
          setContacts(contactsWithPhones);
          setFilteredContacts(contactsWithPhones);
        }
      } else {
        Alert.alert(
          "Permission Denied",
          "Please grant contacts permission to use this feature"
        );
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact.phoneNumbers && contact.phoneNumbers.some(phone => 
          phone.number?.includes(searchQuery) ?? false
        ))
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchQuery, contacts]);

  const handleCall = (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert("Error", "Phone calls are not supported on this device");
        }
      })
      .catch(err => {
        console.error("Error making phone call:", err);
        Alert.alert("Error", "Failed to make phone call");
      });
  };

  const renderContactItem = ({ item }: { item: Contacts.Contact }) => {
    const phoneNumber = item.phoneNumbers && item.phoneNumbers.length > 0 
      ? item.phoneNumbers[0].number 
      : null;
    
    return (
      <View style={[
        styles.contactItem,
        { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }
      ]}>
        <View style={[
          styles.contactAvatar,
          { backgroundColor: colorScheme === 'dark' ? '#333333' : '#DDDDDD' }
        ]}>
          <User size={20} color={colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary} />
        </View>
        
        <View style={styles.contactInfo}>
          <Text style={[
            styles.contactName,
            { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
          ]}>
            {item.name}
          </Text>
          {phoneNumber && (
            <Text style={[
              styles.contactPhone,
              { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
            ]}>
              {phoneNumber}
            </Text>
          )}
        </View>
        
        {phoneNumber && (
          <TouchableOpacity 
            style={[
              styles.callButton,
              { backgroundColor: colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint }
            ]}
            onPress={() => handleCall(phoneNumber)}
          >
            <PhoneCall size={16} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ 
        title: "Contacts",
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
        
        <View style={styles.searchContainer}>
          <View style={[
            styles.searchBar,
            { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }
          ]}>
            <Search size={20} color={colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary} />
            <TextInput
              style={[
                styles.searchInput,
                { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
              ]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search contacts..."
              placeholderTextColor={colorScheme === 'dark' ? '#777777' : '#999999'}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <X size={20} color={colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {loading ? (
          <View style={styles.centerContainer}>
            <Text style={[
              styles.loadingText,
              { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
            ]}>
              Loading contacts...
            </Text>
          </View>
        ) : filteredContacts.length === 0 ? (
          <View style={styles.centerContainer}>
            <Phone size={40} color={colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary} />
            <Text style={[
              styles.emptyText,
              { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
            ]}>
              {searchQuery ? "No contacts found" : "No contacts available"}
            </Text>
            <Text style={[
              styles.emptySubtext,
              { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
            ]}>
              {searchQuery ? "Try a different search term" : "Please add contacts to your device"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredContacts}
            renderItem={renderContactItem}
            keyExtractor={(item, index) => `contact-${index}-${item.id || item.name}`}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
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
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  listContent: {
    padding: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});