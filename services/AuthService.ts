import axios from "../utils/axios";
import { setToken } from "./TokenService";

export async function login(credentials: {
  email: string;
  password: string;
  device_name: string;
}) {
  console.log("Attempting login with:", credentials);
  console.log("Making request to:", axios.defaults.baseURL + "/login");

  try {
    const { data } = await axios.post("/login", credentials);
    console.log("Login response:", data);

    await setToken(data.token);
  } catch (error: any) {
    console.error("Login error details:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      },
    });
    throw error;
  }
}

export async function loadUser() {
  console.log("Loading user...");
  try {
    const { data: user } = await axios.get("/user");
    console.log("User loaded successfully:", user);
    return user;
  } catch (error) {
    console.error("Failed to load user:", error);
    throw error;
  }
}

export async function logout() {
  console.log("Attempting logout...");
  try {
    await axios.post("/logout");
    console.log("Logout request successful");
  } catch (error) {
    console.log("Logout request failed, but continuing to clear token:", error);
  }
  await setToken(null);
  console.log("Token cleared");
}

export async function register(info: any) {
  console.log("Attempting registration with:", info);
  console.log("Making request to:", axios.defaults.baseURL + "/register");

  const { data } = await axios.post("/register", info);
  console.log("Registration response:", data);

  await setToken(data.token);
}

export async function updateUser(user: any) {
  const { data } = await axios.put("/user", user);
  return data;
}

export async function sendPasswordResetLink(email: string) {
  const { data } = await axios.post("/forgot-password", { email });
  return data.status;
}
