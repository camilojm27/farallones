import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { COLORS } from "../../constants/Colors";

function DrawnTabBackground() {
  return (
    <View pointerEvents="none" style={styles.drawnTabBackground}>
      <View style={styles.drawnFill} />
      <View style={styles.mountainRidge}>
        <View style={[styles.mountainPeak, styles.mountainPeakOne]}>
          <View style={styles.mountainPeakHighlight} />
        </View>
        <View style={[styles.mountainPeak, styles.mountainPeakTwo]}>
          <View style={styles.mountainPeakHighlightSmall} />
        </View>
        <View style={[styles.mountainPeak, styles.mountainPeakThree]}>
          <View style={styles.mountainPeakHighlight} />
        </View>
        <View style={[styles.mountainPeak, styles.mountainPeakFour]}>
          <View style={styles.mountainPeakHighlightSmall} />
        </View>
        <View style={[styles.ridgeSketchLine, styles.ridgeSketchLineOne]} />
        <View style={[styles.ridgeSketchLine, styles.ridgeSketchLineTwo]} />
        <View style={[styles.ridgeSketchLine, styles.ridgeSketchLineThree]} />
      </View>
    </View>
  );
}

function TabIcon({
  name,
  color,
  size = 24,
}: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  size?: number;
}) {
  return (
    <View style={styles.tabIconContainer}>
      <FontAwesome size={size} name={name} color={color} />
    </View>
  );
}

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
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.secondary,
          tabBarInactiveTintColor: COLORS.white,
          tabBarStyle: styles.tabBar,
          tabBarItemStyle: styles.tabBarItem,
          tabBarIconStyle: styles.tabBarIcon,
          tabBarBackground: () => <DrawnTabBackground />,
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <TabIcon name="compass" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="communities"
          options={{
            title: "Communities",
            tabBarIcon: ({ color }) => (
              <TabIcon name="users" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <TabIcon name="user" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <TabIcon name="cog" color={color} />
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
    backgroundColor: COLORS.background,
  },
  tabBar: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    height: 64,
    backgroundColor: "transparent",
    borderRadius: 32,
    borderTopWidth: 0,
    borderWidth: 0,
    paddingTop: 0,
    paddingBottom: 0,
    overflow: "visible",
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 12,
  },
  tabBarItem: {
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0,
    paddingBottom: 0,
  },
  tabBarIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },
  drawnTabBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  drawnFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primary,
    borderRadius: 34,
  },
  mountainRidge: {
    position: "absolute",
    top: 0,
    left: 18,
    right: 18,
    height: 34,
  },
  mountainPeak: {
    position: "absolute",
    top: -15,
    width: 38,
    height: 38,
    backgroundColor: COLORS.primary,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: "rgba(250, 250, 250, 0.45)",
    borderTopLeftRadius: 8,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    transform: [{ rotate: "45deg" }],
  },
  mountainPeakOne: {
    left: 8,
    top: -10,
    width: 30,
    height: 30,
    transform: [{ rotate: "41deg" }],
  },
  mountainPeakTwo: {
    left: "29%",
    top: -18,
    width: 46,
    height: 46,
    transform: [{ rotate: "47deg" }],
  },
  mountainPeakThree: {
    right: "24%",
    top: -13,
    width: 36,
    height: 36,
    transform: [{ rotate: "43deg" }],
  },
  mountainPeakFour: {
    right: 12,
    top: -20,
    width: 44,
    height: 44,
    transform: [{ rotate: "49deg" }],
  },
  mountainPeakHighlight: {
    position: "absolute",
    top: 7,
    left: 7,
    width: 13,
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(245, 184, 0, 0.55)",
    transform: [{ rotate: "-8deg" }],
  },
  mountainPeakHighlightSmall: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 9,
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(250, 250, 250, 0.5)",
    transform: [{ rotate: "-10deg" }],
  },
  ridgeSketchLine: {
    position: "absolute",
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(250, 250, 250, 0.34)",
  },
  ridgeSketchLineOne: {
    left: 2,
    top: 4,
    width: 52,
    transform: [{ rotate: "-10deg" }],
  },
  ridgeSketchLineTwo: {
    left: "41%",
    top: -2,
    width: 62,
    transform: [{ rotate: "8deg" }],
  },
  ridgeSketchLineThree: {
    right: 6,
    top: 2,
    width: 54,
    transform: [{ rotate: "-7deg" }],
  },
  tabIconContainer: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
  },
  banner: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    zIndex: 10,
  },
  bannerText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },
});
