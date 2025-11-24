import { Stack } from "expo-router";

export default function CommunitiesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create" options={{ headerShown: false }} />
    </Stack>
  );
}

