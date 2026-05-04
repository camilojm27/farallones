import { Stack, useRouter } from "expo-router";
import { AuthContext, User } from "../context/AuthContext";
import React, { useEffect, useRef, useState } from "react";
import { loadUser, logout, ServiceUnavailableError } from "../services/AuthService";
import { getToken } from "../services/TokenService";
import { setTokenExpiredCallback } from "../utils/axios";
import SplashScreen from "./splash";

export default function Layout() {
  const [user, setUser] = useState<User | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [status, setStatus] = useState("loading");
  const hasNavigated = useRef(false);
  const router = useRouter();

  useEffect(() => {
    async function bootstrap() {
      // Skip the API call entirely if there's no stored token.
      // This prevents a needless 401 from triggering the interceptor on first launch.
      const token = await getToken();
      if (!token) {
        setStatus("idle");
        return;
      }

      try {
        const loadedUser = await loadUser();
        setUser(loadedUser);
        setIsOffline(false);
      } catch (error: any) {
        if (error instanceof ServiceUnavailableError && error.cachedUser) {
          setUser(error.cachedUser);
          setIsOffline(true);
        }
        // 401 / other auth error → user stays null → will redirect to login
      } finally {
        setStatus("idle");
      }
    }
    bootstrap();
  }, []);

  // Register the token-expired callback once, so any mid-session 401
  // (not from /logout) cleanly logs the user out.
  useEffect(() => {
    setTokenExpiredCallback(async () => {
      await logout();
      setUser(null);
      setIsOffline(false);
      router.replace("/login");
    });
  }, [router]);

  // Initial navigation — runs once when bootstrap finishes.
  // Using a ref so re-renders (e.g. from the callback above) don't
  // send the user back to /login if they're already navigating elsewhere.
  useEffect(() => {
    if (status !== "idle" || hasNavigated.current) {
      return;
    }
    hasNavigated.current = true;
    if (user) {
      router.replace("/(tabs)");
    } else {
      router.replace("/login");
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (status === "loading") {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isOffline, setIsOffline }}>
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
