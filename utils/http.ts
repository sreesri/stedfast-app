import axios from "axios";
import { CONFIG } from "./config";
import {
  AuthResponse,
  MealLog,
  MealSelectionItem,
  Dish,
  Meal,
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

const toPositiveNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const normalizeMealSelectionItems = (
  payload: unknown,
  kind: "dish" | "meal",
): MealSelectionItem[] => {
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as any)?.data)
      ? (payload as any).data
      : Array.isArray((payload as any)?.items)
        ? (payload as any).items
        : Array.isArray((payload as any)?.dishes)
          ? (payload as any).dishes
          : Array.isArray((payload as any)?.meals)
            ? (payload as any).meals
            : Array.isArray((payload as any)?.mealLogs)
              ? (payload as any).mealLogs
              : [];

  return items
    .map((item: any, index: number) => {
      const name =
        item?.name ??
        item?.label ??
        item?.title ??
        item?.dish ??
        item?.mealName ??
        null;
      if (!name) {
        return null;
      }

      const calories =
        toPositiveNumber(item?.calories) ||
        toPositiveNumber(item?.kcal) ||
        toPositiveNumber(item?.totalCalories) ||
        toPositiveNumber(item?.energy);

      const subtitle =
        item?.subtitle ??
        item?.description ??
        item?.dish ??
        item?.mealType ??
        undefined;

      return {
        id: String(item?.id ?? item?._id ?? `${kind}-${name}-${index}`),
        name,
        calories,
        subtitle,
        kind,
      } satisfies MealSelectionItem;
    })
    .filter((item): item is MealSelectionItem => item !== null);
};

const normalizeDishes = (payload: unknown): Dish[] => {
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as any)?.data)
      ? (payload as any).data
      : Array.isArray((payload as any)?.items)
        ? (payload as any).items
        : Array.isArray((payload as any)?.dishes)
          ? (payload as any).dishes
          : [];

  return items
    .map((item: any, index: number) => {
      const name =
        item?.name ?? item?.label ?? item?.dish ?? item?.title ?? null;
      if (!name) {
        return null;
      }

      return {
        id: String(item?.id ?? item?._id ?? `dish-${name}-${index}`),
        name,
        calories:
          toPositiveNumber(item?.calories) ||
          toPositiveNumber(item?.kcal) ||
          toPositiveNumber(item?.energy),
        protein:
          toPositiveNumber(item?.protein) ||
          toPositiveNumber(item?.proteinGrams),
        carbs:
          toPositiveNumber(item?.carbs) || toPositiveNumber(item?.carbGrams),
        fat: toPositiveNumber(item?.fat) || toPositiveNumber(item?.fatGrams),
      } satisfies Dish;
    })
    .filter((item): item is Dish => item !== null);
};

const normalizeMeals = (payload: unknown): Meal[] => {
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as any)?.data)
      ? (payload as any).data
      : Array.isArray((payload as any)?.items)
        ? (payload as any).items
        : Array.isArray((payload as any)?.meals)
          ? (payload as any).meals
          : [];

  return items
    .map((item: any, index: number) => {
      const name =
        item?.name ??
        item?.label ??
        item?.mealName ??
        item?.title ??
        item?.dish;

      if (!name) {
        return null;
      }

      const dishes = Array.isArray(item?.dishes)
        ? item.dishes
            .map((dish: any) => {
              const dishId = dish?.dishId ?? dish?.id ?? dish?._id;
              if (!dishId) {
                return null;
              }

              return {
                dishId: String(dishId),
                quantity: toPositiveNumber(dish?.quantity) || 1,
              };
            })
            .filter(Boolean)
        : [];

      return {
        id: String(item?.id ?? item?._id ?? `meal-${name}-${index}`),
        name,
        calories:
          toPositiveNumber(item?.calories) ||
          toPositiveNumber(item?.totalCalories) ||
          toPositiveNumber(item?.kcal),
        protein:
          toPositiveNumber(item?.protein) ||
          toPositiveNumber(item?.totalProtein),
        carbs:
          toPositiveNumber(item?.carbs) || toPositiveNumber(item?.totalCarbs),
        fat: toPositiveNumber(item?.fat) || toPositiveNumber(item?.totalFat),
        dishes,
      } satisfies Meal;
    })
    .filter((item): item is Meal => item !== null);
};

const buildMealSubtitle = (meal: Meal, dishes: Dish[]) => {
  const dishNames = meal.dishes
    .map((mealDish) => {
      const dish = dishes.find((item) => item.id === mealDish.dishId);
      return dish ? `${dish.name} x${mealDish.quantity}` : null;
    })
    .filter((item): item is string => Boolean(item));

  return dishNames.join(", ");
};

const toMealSelectionDish = (dish: Dish): MealSelectionItem => ({
  id: dish.id,
  name: dish.name,
  calories: dish.calories,
  subtitle: `${dish.protein}P • ${dish.carbs}C • ${dish.fat}F`,
  kind: "dish",
});

const toMealSelectionMeal = (
  meal: Meal,
  dishes: Dish[],
): MealSelectionItem => ({
  id: meal.id,
  name: meal.name,
  calories: meal.calories,
  subtitle: buildMealSubtitle(meal, dishes),
  kind: "meal",
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

export const getDishes = async (): Promise<Dish[]> => {
  try {
    const dishes = await getDishTemplates();
    const normalized = normalizeDishes(dishes);
    if (normalized.length > 0) {
      return normalized;
    }
  } catch (error) {
    console.warn("Falling back to local dishes", error);
  }

  return [];
};

export const getMealSelectionDishes = async (): Promise<
  MealSelectionItem[]
> => {
  const dishes = await getDishes();
  return dishes.map(toMealSelectionDish);
};

export const getMeals = async (): Promise<Meal[]> => {
  try {
    const response = await api.get("/api/meal/meals");
    const normalized = normalizeMeals(response.data);
    if (normalized.length > 0) {
      return normalized;
    }
  } catch (error) {
    console.warn("Failed Getting Saved meals", error);
  }

  return [];
};

export const getMealSelectionMeals = async (): Promise<MealSelectionItem[]> => {
  const [meals, dishes] = await Promise.all([
    getMeals(),
    getDishes(),
  ]);
  return meals.map((meal) => toMealSelectionMeal(meal, dishes));
};

export const createDish = async (
  data: Omit<Dish, "id">,
): Promise<Dish> => {
  try {
    const response = await api.post("/api/meal/dishes", data);
    const normalized = normalizeDishes(response.data);
    const createdDish =
      normalized[0] ??
      ({
        id: `dish-${Date.now()}`,
        ...data,
      } satisfies Dish);

    return createdDish;
  } catch (error) {
    const createdDish = {
      id: `dish-${Date.now()}`,
      ...data,
    } satisfies Dish;
    return createdDish;
  }
};

export const updateDish = async (data: Dish): Promise<Dish> => {
  try {
    const response = await api.put(`/api/meal/dishes/${data.id}`, data);
    const normalized = normalizeDishes(response.data);
    const updatedDish = normalized[0] ?? data;
    return updatedDish;
  } catch (error) {
    return data;
  }
};

export const createMeal = async (
  data: Omit<Meal, "id">,
): Promise<Meal> => {
  try {
    const response = await api.post("/api/meal/meals", data);
    const normalized = normalizeMeals(response.data);
    const createdMeal =
      normalized[0] ??
      ({
        id: `meal-${Date.now()}`,
        ...data,
      } satisfies Meal);

    return createdMeal;
  } catch (error) {
    const createdMeal = {
      id: `meal-${Date.now()}`,
      ...data,
    } satisfies Meal;
    return createdMeal;
  }
};

export const updateMeal = async (data: Meal): Promise<Meal> => {
  try {
    const response = await api.put(`/api/meal/meals/${data.id}`, data);
    const normalized = normalizeMeals(response.data);
    const updatedMeal = normalized[0] ?? data;
    return updatedMeal;
  } catch (error) {
    return data;
  }
};

export const getMealLogs = async (): Promise<MealLog[]> => {
  try {
    const response = await api.get("/api/meal/logs");
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    return data?.mealLogs ?? [];
  } catch (error) {
    console.warn("Failed to Get Meal Logs", error);
    return [];
  }
};

export const createMealLog = async (data: {
  mealTime: string;
  notes?: string;
  dishes?: Array<{
    dishId?: string;
    name?: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    quantity?: number;
  }>;
}): Promise<MealLog> => {
  const response = await api.post("/api/meal/logs", data);
  return response.data;
};

export const updateMealLog = async (data: {
  id: string;
  mealTime: string;
  notes?: string;
  dishes?: Array<{
    dishId?: string;
    name?: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    quantity?: number;
  }>;
}): Promise<MealLog> => {
  const { id, ...payload } = data;
  const response = await api.put(`/api/meal/logs/${id}`, payload);
  return response.data;
};

export const deleteMealLog = async (id: string): Promise<void> => {
  await api.delete(`/api/meal/logs/${id}`);
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
