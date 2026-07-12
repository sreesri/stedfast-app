import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import {
  createDish,
  createMeal,
  getDishes,
  getMeals,
  updateDish,
  updateMeal,
  deleteDish,
  deleteMeal,
} from "../utils/http";
import { Dish, Meal } from "../utils/types";

export const useSavedFoodCatalog = () => {
  const queryClient = useQueryClient();

  const dishesQuery = useQuery({
    queryKey: ["savedFood", "dishes"],
    queryFn: getDishes,
  });

  const mealsQuery = useQuery({
    queryKey: ["savedFood", "meals"],
    queryFn: getMeals,
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
    mutationFn: createDish,
    onSuccess: async () => {
      await invalidateCatalog();
      Toast.show({ type: "success", text1: "Dish saved", position: "bottom" });
    },
  });

  const updateDishMutation = useMutation({
    mutationFn: updateDish,
    onSuccess: async () => {
      await invalidateCatalog();
      Toast.show({ type: "success", text1: "Dish updated", position: "bottom" });
    },
  });

  const createMealMutation = useMutation({
    mutationFn: createMeal,
    onSuccess: async () => {
      await invalidateCatalog();
      Toast.show({ type: "success", text1: "Meal saved", position: "bottom" });
    },
  });

  const updateMealMutation = useMutation({
    mutationFn: updateMeal,
    onSuccess: async () => {
      await invalidateCatalog();
      Toast.show({ type: "success", text1: "Meal updated", position: "bottom" });
    },
  });

  const deleteDishMutation = useMutation({
    mutationFn: deleteDish,
    onSuccess: async () => {
      await invalidateCatalog();
      Toast.show({ type: "success", text1: "Dish deleted", position: "bottom" });
    },
  });

  const deleteMealMutation = useMutation({
    mutationFn: deleteMeal,
    onSuccess: async () => {
      await invalidateCatalog();
      Toast.show({ type: "success", text1: "Meal deleted", position: "bottom" });
    },
  });

  const saveDish = async (dish: Dish | Omit<Dish, "id">) => {
    if ("id" in dish) {
      return updateDishMutation.mutateAsync(dish);
    }

    return createDishMutation.mutateAsync(dish);
  };

  const saveMeal = async (meal: Meal | Omit<Meal, "id">) => {
    if ("id" in meal) {
      return updateMealMutation.mutateAsync(meal);
    }

    return createMealMutation.mutateAsync(meal);
  };

  const refetch = () => Promise.all([dishesQuery.refetch(), mealsQuery.refetch()]);

  return {
    dishes: dishesQuery.data ?? [],
    meals: mealsQuery.data ?? [],
    isLoading: dishesQuery.isLoading || mealsQuery.isLoading,
    isRefreshing: dishesQuery.isRefetching || mealsQuery.isRefetching,
    refetch,
    isSaving:
      createDishMutation.isPending ||
      updateDishMutation.isPending ||
      createMealMutation.isPending ||
      updateMealMutation.isPending,
    isDeleting:
      deleteDishMutation.isPending ||
      deleteMealMutation.isPending,
    saveDish,
    saveMeal,
    removeDish: async (id: string) => deleteDishMutation.mutateAsync(id),
    removeMeal: async (id: string) => deleteMealMutation.mutateAsync(id),
  };
};
