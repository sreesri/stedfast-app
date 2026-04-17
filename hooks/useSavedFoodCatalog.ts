import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import {
  createSavedDish,
  createSavedMeal,
  getSavedDishes,
  getSavedMeals,
  updateSavedDish,
  updateSavedMeal,
} from "../utils/http";
import { SavedDish, SavedMeal } from "../utils/types";

export const useSavedFoodCatalog = () => {
  const queryClient = useQueryClient();

  const dishesQuery = useQuery({
    queryKey: ["savedFood", "dishes"],
    queryFn: getSavedDishes,
  });

  const mealsQuery = useQuery({
    queryKey: ["savedFood", "meals"],
    queryFn: getSavedMeals,
  });

  const invalidateCatalog = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["savedFood", "dishes"] }),
      queryClient.invalidateQueries({ queryKey: ["savedFood", "meals"] }),
      queryClient.invalidateQueries({ queryKey: ["mealSelection", "dishes"] }),
      queryClient.invalidateQueries({ queryKey: ["mealSelection", "meals"] }),
    ]);
  };

  const createDishMutation = useMutation({
    mutationFn: createSavedDish,
    onSuccess: async () => {
      await invalidateCatalog();
      Toast.show({ type: "success", text1: "Dish saved", position: "bottom" });
    },
  });

  const updateDishMutation = useMutation({
    mutationFn: updateSavedDish,
    onSuccess: async () => {
      await invalidateCatalog();
      Toast.show({ type: "success", text1: "Dish updated", position: "bottom" });
    },
  });

  const createMealMutation = useMutation({
    mutationFn: createSavedMeal,
    onSuccess: async () => {
      await invalidateCatalog();
      Toast.show({ type: "success", text1: "Meal saved", position: "bottom" });
    },
  });

  const updateMealMutation = useMutation({
    mutationFn: updateSavedMeal,
    onSuccess: async () => {
      await invalidateCatalog();
      Toast.show({ type: "success", text1: "Meal updated", position: "bottom" });
    },
  });

  const saveDish = async (dish: SavedDish | Omit<SavedDish, "id">) => {
    if ("id" in dish) {
      return updateDishMutation.mutateAsync(dish);
    }

    return createDishMutation.mutateAsync(dish);
  };

  const saveMeal = async (meal: SavedMeal | Omit<SavedMeal, "id">) => {
    if ("id" in meal) {
      return updateMealMutation.mutateAsync(meal);
    }

    return createMealMutation.mutateAsync(meal);
  };

  return {
    dishes: dishesQuery.data ?? [],
    meals: mealsQuery.data ?? [],
    isLoading: dishesQuery.isLoading || mealsQuery.isLoading,
    isSaving:
      createDishMutation.isPending ||
      updateDishMutation.isPending ||
      createMealMutation.isPending ||
      updateMealMutation.isPending,
    saveDish,
    saveMeal,
  };
};
