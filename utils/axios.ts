import axiosLib from "axios";
import { getToken } from "../services/TokenService";

let onTokenExpired: (() => void) | null = null;
let isHandling401 = false;

export function setTokenExpiredCallback(callback: () => void) {
  onTokenExpired = callback;
}

const axios = axiosLib.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axios.interceptors.request.use(
  async (request) => {
    const token = await getToken();
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? "";
    // Never handle 401s from the logout endpoint (it may already be expired)
    // and deduplicate so rapid 401s don't fire the callback multiple times.
    if (
      error.response?.status === 401 &&
      !url.includes("/logout") &&
      !isHandling401
    ) {
      isHandling401 = true;
      onTokenExpired?.();
      setTimeout(() => {
        isHandling401 = false;
      }, 2000);
    }
    return Promise.reject(error);
  }
);

export default axios;
