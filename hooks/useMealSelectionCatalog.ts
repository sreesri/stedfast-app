import { useQuery } from "@tanstack/react-query";
import {
  getMealSelectionDishes,
  getMealSelectionMeals,
} from "../utils/http";

export const useMealSelectionCatalog = () => {
  const dishesQuery = useQuery({
    queryKey: ["mealSelection", "dishes"],
    queryFn: getMealSelectionDishes,
  });

  const mealsQuery = useQuery({
    queryKey: ["mealSelection", "meals"],
    queryFn: getMealSelectionMeals,
  });

  const refetch = () => Promise.all([dishesQuery.refetch(), mealsQuery.refetch()]);

  return {
    dishes: dishesQuery.data ?? [],
    meals: mealsQuery.data ?? [],
    isLoading: dishesQuery.isLoading || mealsQuery.isLoading,
    isRefreshing: dishesQuery.isFetching || mealsQuery.isFetching,
    refetch,
  };
};
