import axios from "../utils/axios";
import { User } from "../context/AuthContext";
import { setToken, setCachedUser, getCachedUser } from "./TokenService";
import { Platform } from "react-native";

export class ServiceUnavailableError extends Error {
  constructor(public readonly cachedUser: User | null) {
    super("Service unavailable");
    this.name = "ServiceUnavailableError";
  }
}

export async function login(credentials: {
  email: string;
  password: string;
  device_name: string;
}) {
  const { data } = await axios.post("/login", credentials);
  await setToken(data.token);
}

export async function loadUser(): Promise<User> {
  try {
    const { data: user } = await axios.get("/user");
    await setCachedUser(user);
    return user;
  } catch (error: any) {
    if (!error.response) {
      const cachedUser = await getCachedUser();
      throw new ServiceUnavailableError(cachedUser);
    }
    throw error;
  }
}

export async function logout() {
  try {
    await axios.post("/logout");
  } catch {
    // Ignore — we clear the token regardless
  }
  await setToken(null);
  await setCachedUser(null);
}

export async function register(info: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  device_name: string;
}) {
  const { data } = await axios.post("/register", info);
  await setToken(data.token);
}

export async function updateUser(user: Partial<User> & Record<string, unknown>) {
  const { data } = await axios.put("/user", user);
  await setCachedUser(data);
  return data;
}

export async function sendPasswordResetLink(email: string): Promise<string> {
  const { data } = await axios.post("/forgot-password", { email });
  return data.status;
}
