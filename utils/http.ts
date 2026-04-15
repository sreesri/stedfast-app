import axios from "axios";
import { CONFIG } from "./config";
import {
  AuthResponse,
  MealLog,
  UserSummary,
  FastingSession,
  FastingSchedule,
  BodyStat,
  UserIntakeSummary,
} from "./types";
import { LimitConfig } from "../context/LimitContext";
import { FastingConfig } from "../context/FastingContext";

const api = axios.create({
  baseURL: CONFIG.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`,
      {
        data: config.data,
        headers: config.headers,
      },
    );
    return config;
  },
  (error) => {
    console.error(`❌ [API Request Error] ${error.message}`);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url} | Status: ${response.status}`,
      { data: response.data },
    );
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const method = error.config?.method?.toUpperCase();
    const url = error.config?.url;

    console.error(
      `❌ [API Response Error] ${method} ${url} | Status: ${status}`,
      {
        message: error.message,
        data: error.response?.data,
      },
    );
    return Promise.reject(error);
  },
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
  const response = await api.post("/api/auth/register", {
    name,
    email,
    password,
  });
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

export const getActiveFastingSchedule = async (): Promise<FastingSchedule> => {
  const response = await api.get("/api/fasting/schedules/active");
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

export const saveHealthStats = async (
  data: Partial<BodyStat>,
): Promise<any> => {
  const response = await api.post("/api/health/stats", data);
  return response.data;
};

export const getDishTemplates = async (): Promise<any[]> => {
  const response = await api.get("/api/meal/dishes");
  return response.data;
};

export const getUserSummary = async (): Promise<UserSummary> => {
  const response = await api.get("/api/meal/summary");
  return response.data;
};

export const getIntakeSummary = async (
  date: string,
): Promise<UserIntakeSummary[]> => {
  const response = await api.get(`/api/meal/intake-summary?date=${date}`);
  return response.data;
};

export const setupFastingConfig = async (
  config: FastingConfig,
): Promise<FastingSchedule> => {
  const { year, month, day, hour, minute } = config.fastingStartTime;
  // Create a proper date string that backends can parse reliably
  const startTime = new Date(year, month, day, hour, minute).toISOString();

  const response = await api.post("/api/fasting/schedules", {
    fastingHours: config.fastingWindow,
    eatingHours: config.eatingWindow,
    label: `${config.fastingWindow}:${config.eatingWindow} Schedule`,
    fastingStartTime: startTime,
  });
  return response.data;
};

export const getLimitConfig = async (): Promise<LimitConfig> => {
  const response = await api.get("/api/health/stats/limits");
  return response.data;
};

export const setupLimitConfig = async (
  config: LimitConfig,
): Promise<LimitConfig> => {
  const response = await api.post("/api/health/stats/limits", config);
  return response.data;
};

export default api;
