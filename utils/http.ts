import axios from "axios";
import { CONFIG } from "./config";
import {
  AuthResponse,
  BaseConfig,
  FastingStatus,
  MealLog,
  UserSummary,
} from "./types";

// Create a dedicated axios instance to avoid global mutations
const api = axios.create({
  baseURL: CONFIG.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for central error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // In a real app, we might trigger a logout event or clear storage here.
      // For now, we'll let the context handle it if it still needs to, 
      // but industry standard is to have a logout utility.
    }
    return Promise.reject(error);
  }
);
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const doLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await api.post("/api/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const doSignup = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<any> => {
  const response = await api.post("/api/auth/register", {
    name,
    email,
    password,
  });
  return response.data;
};

export const getFastingStatus = async (): Promise<FastingStatus> => {
  const response = await api.get("/api/fasting/current-status");
  return response.data;
};

export const updateFastingStatus = async ({
  trackingState,
  startTime,
}: {
  trackingState: string;
  startTime: string;
}): Promise<any> => {
  const response = await api.post("/api/fasting/change-status", {
    status: trackingState,
    startTime: startTime,
  });
  return response.data;
};

export const getUserSummary = async (): Promise<UserSummary> => {
  const response = await api.get("/api/user/summary");
  return response.data;
};

export const getMealLogs = async (): Promise<MealLog[]> => {
  const url = `/api/meallog?date=${new Date().toISOString()}`;
  const response = await api.get(url);
  return response.data;
};

export const createMealLog = async ({
  name,
  time,
  calories,
  dish,
}: {
  name: string;
  time: string;
  calories: number;
  dish: string;
}): Promise<MealLog> => {
  const response = await api.post("/api/meallog", {
    mealType: name,
    mealTime: time,
    calories,
    dish,
  });
  return response.data;
};

export const updateMealLog = async ({
  id,
  name,
  time,
  calories,
  dish,
}: {
  id: string;
  name: string;
  time: string;
  calories: number;
  dish: string;
}): Promise<MealLog> => {
  const response = await api.put(`/api/meallog/${id}`, {
    mealType: name,
    mealTime: time,
    calories,
    dish,
  });
  return response.data;
};

export const deleteMealLog = async (id: string): Promise<any> => {
  const response = await api.delete(`/api/meallog/${id}`);
  return response.data;
};

export const setupBaseConfig = async ({
  fastingWindow,
  eatingWindow,
  fastingStartTime,
  calorieLimit,
}: BaseConfig): Promise<any> => {
  const { hour, minute } = fastingStartTime;
  const mm = minute < 10 ? `0${minute}` : minute;
  const formattedTime = `${hour}:${mm}:00`;

  const response = await api.post("/api/user/settings", {
    fastingWindow,
    eatingWindow,
    fastingStartTime: formattedTime,
    calorieLimit: calorieLimit,
  });
  return response.data;
};

export const getBaseConfig = async (): Promise<BaseConfig> => {
  const response = await api.get("/api/user/settings");
  return response.data;
};

export default api;
