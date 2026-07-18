import { SCREEN } from "../utils/Constants";
import { MealLog, Dish, Meal, Exercise, WorkoutLog } from "../utils/types";

export type RootStackParamList = {
  [SCREEN.homescreen]: undefined;
  [SCREEN.statsscreen]: undefined;
  [SCREEN.meallogs]: undefined;
  [SCREEN.foodlibrary]: undefined;
  [SCREEN.login]: undefined;
  [SCREEN.signup]: undefined;
  [SCREEN.fastingconfig]: undefined;
  [SCREEN.limitConfig]: undefined;
  [SCREEN.mealedit]: {
    mealId?: string;
    editingMeal?: MealLog;
    isFastingToggle?: boolean;
    trackingState?: string;
    activeScheduleId?: string;
  };
  [SCREEN.foodeditor]: {
    entityType: "dish" | "meal";
    editingDish?: Dish;
    editingMeal?: Meal;
  };
  [SCREEN.workoutlogs]: undefined;
  [SCREEN.workoutedit]: {
    editingLog?: WorkoutLog;
  };
  [SCREEN.exerciselibrary]: undefined;
  [SCREEN.exerciseeditor]: {
    editingExercise?: Exercise;
  };
};
