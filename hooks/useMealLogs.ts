import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import {
  getMealLogs,
  createMealLog,
  updateMealLog,
  deleteMealLog,
} from "../utils/http";
import { MealLog } from "../utils/types";

export const useMealLogs = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const { data: mealLogsData, isLoading } = useQuery({
    queryKey: ["mealLogs"],
    queryFn: getMealLogs,
  });

  const mealLogs = Array.isArray(mealLogsData)
    ? mealLogsData
    : (mealLogsData as any)?.mealLogs ?? [];

  const createMealMutation = useMutation({
    mutationFn: createMealLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mealLogs"] });
      Toast.show({ type: "success", text1: "Meal saved", position: "bottom" });
      navigation.goBack();
    },
    onError: (error) => {
      console.error("Failed to save meal:", error);
      Toast.show({
        type: "error",
        text1: "Save failed",
        text2: "Could not save your meal. Please try again.",
        position: "bottom",
      });
    },
  });

  const updateMealMutation = useMutation({
    mutationFn: updateMealLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mealLogs"] });
      Toast.show({
        type: "success",
        text1: "Meal updated",
        position: "bottom",
      });
      navigation.goBack();
    },
    onError: (error) => {
      console.error("Failed to update meal:", error);
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: "Could not update your meal. Please try again.",
        position: "bottom",
      });
    },
  });

  const deleteMealMutation = useMutation({
    mutationFn: deleteMealLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mealLogs"] });
      Toast.show({
        type: "success",
        text1: "Meal deleted",
        position: "bottom",
      });
    },
    onError: (error) => {
      console.error("Failed to delete meal:", error);
      Toast.show({
        type: "error",
        text1: "Delete failed",
        text2: "Could not delete your meal. Please try again.",
        position: "bottom",
      });
    },
  });

  const handleSave = (
    notes: string,
    stagedItems: any[], // StagedMealItem
    editingMeal?: MealLog | null,
  ) => {
    if (!stagedItems.length) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please select at least one dish or meal.",
        position: "bottom",
      });
      return;
    }

    const dishes = stagedItems.map((item) => ({
      dishId: item.kind === "dish" ? item.id : undefined,
      name: item.name,
      calories: item.calories,
      quantity: item.quantity,
    }));

    const payload = {
      notes,
      mealTime: editingMeal?.mealTime ?? new Date().toISOString(),
      dishes,
    };

    if (editingMeal) {
      updateMealMutation.mutate({
        ...payload,
        id: editingMeal.id || editingMeal._id!,
      });
    } else {
      createMealMutation.mutate(payload);
    }
  };

  const handleDelete = (editingMeal: MealLog) => {
    deleteMealMutation.mutate(editingMeal.id || editingMeal._id!);
  };

  return {
    mealLogs,
    isLoading,
    handleSave,
    handleDelete,
    isPending:
      createMealMutation.isPending ||
      updateMealMutation.isPending ||
      deleteMealMutation.isPending,
  };
};
