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

export interface MealLogsResponse {
  mealLogs: MealLog[];
}

export interface FastingStatus {
  status: string;
  startTime: string;
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

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}
