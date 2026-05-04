import * as SecureStore from "expo-secure-store";
import { User } from "../context/AuthContext";

let token: string | null = null;

export async function setToken(newToken: string | null) {
  token = newToken;
  if (token !== null) {
    await SecureStore.setItemAsync("token", token);
    return;
  }
  await SecureStore.deleteItemAsync("token");
}

export async function getToken() {
  if (token !== null) {
    return token;
  }
  token = await SecureStore.getItemAsync("token");
  return token;
}

export async function setCachedUser(user: User | null) {
  if (user !== null) {
    await SecureStore.setItemAsync("cached_user", JSON.stringify(user));
    return;
  }
  await SecureStore.deleteItemAsync("cached_user");
}

export async function getCachedUser(): Promise<User | null> {
  const raw = await SecureStore.getItemAsync("cached_user");
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}
