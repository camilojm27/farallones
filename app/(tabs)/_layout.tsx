import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AuthContext } from "../../context/AuthContext";

function OfflineBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>
        Service unavailable — showing cached data
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const { isOffline } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      {isOffline && <OfflineBanner />}
      <Tabs screenOptions={{ tabBarActiveTintColor: "#6B4C9A" }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="cog" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="communities"
          options={{
            title: "Communities",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="users" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="user" color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    backgroundColor: "#F59E0B",
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  bannerText: {
    color: "#78350F",
    fontSize: 13,
    fontWeight: "600",
  },
});
