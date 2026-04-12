export interface BodyStat {
  id: string;
  loggedDate: string;
  weightKg: number;
  heightCm: number;
  bodyFatPct?: number;
  waistCm?: number;
  chestCm?: number;
  hipsCm?: number;
  createdAt: string;
}

export interface FastingSchedule {
  id: string;
  fastingHours: number;
  eatingHours: number;
  label: string;
}

export interface FastingSession {
  id: string;
  sessionType: "FAST" | "EAT";
  status: "ACTIVE" | "COMPLETED";
  startedAt: string;
  endedAt?: string;
  durationMinutes?: number;
}

export interface UserSummary {
  fasting?: {
    status: string;
    startTime: string;
  };
  mealLogs: MealLog[];
  totalCalories: number;
}

export interface MealLog {
  id?: string;
  _id?: string;
  mealType: string;
  mealTime: string;
  calories: number;
  dish: string;
}

export interface AuthResponse {
  token: string;
}

export interface BaseConfig {
  fastingWindow: number;
  eatingWindow: number;
  fastingStartTime: {
    hour: number;
    minute: number;
  };
  calorieLimit: number;
}
