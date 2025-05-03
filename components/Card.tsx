import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Colors from "@/constants/colors";

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onPress: () => void;
  colorScheme: 'light' | 'dark';
}

export function Card({ title, description, icon, onPress, colorScheme }: CardProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.card,
        { backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#F5F5F5' }
      ]}
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: colorScheme === 'dark' ? 'rgba(80, 227, 194, 0.1)' : 'rgba(74, 144, 226, 0.1)' }
        ]}>
          {icon}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[
            styles.title,
            { color: colorScheme === 'dark' ? Colors.dark.text : Colors.light.text }
          ]}>
            {title}
          </Text>
          <Text style={[
            styles.description,
            { color: colorScheme === 'dark' ? Colors.dark.textSecondary : Colors.light.textSecondary }
          ]}>
            {description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
  },
});