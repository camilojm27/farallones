import { Stack, useRouter } from "expo-router";
import { AuthContext, User } from "../context/AuthContext";
import React, { useEffect, useState } from "react";
import { loadUser } from "../services/AuthService";
import SplashScreen from "./splash";

export default function Layout() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState("loading");
  const router = useRouter();

  useEffect(() => {
    async function runEffect() {
      try {
        const user = await loadUser();
        setUser(user);
      } catch (error) {
        console.log("Error loading user", error);
      } finally {
        setStatus("idle");
      }
    }
    runEffect();
  }, []);

  // Handle initial navigation after loading
  useEffect(() => {
    if (status === "idle") {
      if (user) {
        console.log("User authenticated, navigating to tabs");
        router.replace("/(tabs)");
      } else {
        console.log("User not authenticated, navigating to login");
        router.replace("/login");
      }
    }
  }, [status, user, router]);

  if (status === "loading") {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Stack initialRouteName="login">
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="communities" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      </Stack>
    </AuthContext.Provider>
  );
}
