import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import { COLORS } from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="compass" size={60} color={COLORS.white} />
      </View>
      <Text style={styles.title}>Farallones</Text>
      <ActivityIndicator size="large" color={COLORS.secondary} style={styles.spinner} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary, // Using Morado Montaña for the splash
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: COLORS.white,
    letterSpacing: 2,
    marginBottom: 40,
  },
  spinner: {
    marginTop: 20,
  },
});

export default SplashScreen;