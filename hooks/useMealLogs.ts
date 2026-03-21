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

  const [modalVisible, setModalVisible] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealLog | null>(null);

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
      queryClient.invalidateQueries({ queryKey: ["userSummary"] });
      queryClient.invalidateQueries({ queryKey: ["mealLogs"] });
      Toast.show({ type: "success", text1: "Meal saved", position: "bottom" });
      closeModal();
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
      queryClient.invalidateQueries({ queryKey: ["userSummary"] });
      queryClient.invalidateQueries({ queryKey: ["mealLogs"] });
      Toast.show({
        type: "success",
        text1: "Meal updated",
        position: "bottom",
      });
      closeModal();
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
      queryClient.invalidateQueries({ queryKey: ["userSummary"] });
      queryClient.invalidateQueries({ queryKey: ["mealLogs"] });
      Toast.show({
        type: "success",
        text1: "Meal deleted",
        position: "bottom",
      });
      closeModal();
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

  const openModal = (meal?: MealLog) => {
    if (meal) {
      setEditingMeal(meal);
    } else {
      setEditingMeal(null);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingMeal(null);
  };

  const handleSave = (mealData: {
    name: string;
    calories: string;
    dish: string;
  }) => {
    const { name, calories, dish } = mealData;

    if (!name || !calories || !dish) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter both calories and the dish name.",
        position: "bottom",
      });
      return;
    }

    const payload = {
      name,
      time: editingMeal?.mealTime || new Date().toISOString(),
      calories: parseInt(calories) || 0,
      dish,
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

  const handleDelete = () => {
    if (editingMeal) {
      deleteMealMutation.mutate(editingMeal.id || editingMeal._id!);
    }
  };

  return {
    mealLogs,
    isLoading,
    modalVisible,
    editingMeal,
    openModal,
    closeModal,
    handleSave,
    handleDelete,
    isPending:
      createMealMutation.isPending ||
      updateMealMutation.isPending ||
      deleteMealMutation.isPending,
  };
};
