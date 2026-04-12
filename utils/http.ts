import axios from "axios";
import { CONFIG } from "./config";
import {
  AuthResponse,
  BaseConfig,
  MealLog,
  UserSummary,
  FastingSession,
  FastingSchedule,
  BodyStat,
} from "./types";

const api = axios.create({
  baseURL: CONFIG.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
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

// --- AUTH ---
export const doLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await api.post("/api/auth/login", { email, password });
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
  const response = await api.post("/api/auth/register", { name, email, password });
  return response.data;
};

// --- FASTING ---
export const getActiveSession = async (): Promise<FastingSession | null> => {
  try {
    const response = await api.get("/api/fasting/session/active");
    if (response.status === 204) return null;
    return response.data;
  } catch (error) {
    return null;
  }
};

export const startSession = async ({
  scheduleId,
  sessionType,
}: {
  scheduleId: string;
  sessionType: "FAST" | "EAT";
}): Promise<FastingSession> => {
  const response = await api.post("/api/fasting/session/start", {
    scheduleId,
    sessionType,
  });
  return response.data;
};

export const endActiveSession = async (): Promise<any> => {
  const response = await api.post("/api/fasting/session/end");
  return response.data;
};

export const getFastingSchedules = async (): Promise<FastingSchedule[]> => {
  const response = await api.get("/api/fasting/schedules");
  return response.data;
};

export const createFastingSchedule = async (data: {
  fastingHours: number;
  eatingHours: number;
  label: string;
}): Promise<FastingSchedule> => {
  const response = await api.post("/api/fasting/schedules", data);
  return response.data;
};

// --- HEALTH & STATS ---
export const getHealthStats = async (): Promise<BodyStat[]> => {
  const response = await api.get("/api/health/stats");
  return response.data;
};

export const saveHealthStats = async (data: Partial<BodyStat>): Promise<any> => {
  const response = await api.post("/api/health/stats", data);
  return response.data;
};

// --- MEALS (Legacy/Placeholder) ---
// Note: user advised these are missing from documentation but we keep them if needed
export const getMealLogs = async (): Promise<MealLog[]> => {
  const url = `/api/meallog?date=${new Date().toISOString()}`;
  const response = await api.get(url);
  return response.data;
};

export const createMealLog = async (data: any): Promise<MealLog> => {
  const response = await api.post("/api/meallog", data);
  return response.data;
};

export const updateMealLog = async (id: string, data: any): Promise<MealLog> => {
  const response = await api.put(`/api/meallog/${id}`, data);
  return response.data;
};

export const deleteMealLog = async (id: string): Promise<any> => {
  const response = await api.delete(`/api/meallog/${id}`);
  return response.data;
};

export const getDishTemplates = async (): Promise<any[]> => {
  const response = await api.get("/api/meal/dishes");
  return response.data;
};

// --- USER SUMMARY (Fallback) ---
export const getUserSummary = async (): Promise<UserSummary> => {
  const response = await api.get("/api/user/summary");
  return response.data;
};

export default api;
