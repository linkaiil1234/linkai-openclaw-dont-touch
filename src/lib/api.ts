import axios, { AxiosError, AxiosInstance } from "axios";
import { getIdToken } from "firebase/auth";

import { env } from "@/constants/env";
import { auth } from "@/services/firebase";

const api: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use(
  async (config) => {
    const idToken = auth.currentUser
      ? await getIdToken(auth.currentUser)
      : null;

    if (idToken && !config.headers.Authorization) {
      const authToken = `Bearer ${idToken}`;
      config.headers.Authorization = authToken;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("[API Request error]", error);

    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    console.error("[API Response error]", error?.response?.data);

    return Promise.reject(error?.response?.data);
  },
);

export { api };
