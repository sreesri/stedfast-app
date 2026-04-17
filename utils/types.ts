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
  fastingStartTime?: string;
}

export interface FastingSession {
  id: string;
  sessionType: "FAST" | "EAT";
  status: "ACTIVE" | "COMPLETED";
  startedAt: string;
  endedAt?: string;
  durationMinutes?: number;
}



export interface MealLogDish {
  id?: string;
  dishId?: string;
  dish?: Dish;
  name?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  quantity: number;
}

export interface MealLog {
  id: string;
  mealTime: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  notes?: string;
  dishes?: MealLogDish[];
}

export interface MealSelectionItem {
  id: string;
  name: string;
  calories: number;
  subtitle?: string;
  kind: "dish" | "meal";
}

export interface StagedMealItem extends MealSelectionItem {
  quantity: number;
}

export interface Dish {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealDish {
  dishId?: string;
  dish?: Dish;
  name?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  quantity: number;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes?: string;
  dishes: MealDish[];
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

export interface UserIntakeSummary {
  id: string;
  userId: string;
  calorieLimit: number;
  proteinLimit: number;
  carbsLimit: number;
  fatLimit: number;
  loggedDate: string;
  consumedCalories: number;
  consumedProtein: number;
  consumedCarbs: number;
  consumedFat: number;
}
