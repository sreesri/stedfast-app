import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { getUserSummary, updateFastingStatus } from "../utils/http";

export const useHomeLogic = () => {
  const queryClient = useQueryClient();
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const { data: userSummary, isLoading } = useQuery({
    queryKey: ["userSummary"],
    queryFn: getUserSummary,
  });

  const trackingState = userSummary?.fasting?.status ?? "FASTING";
  const startTime = userSummary?.fasting?.startTime
    ? new Date(userSummary.fasting.startTime)
    : new Date();
  const mealLogs = userSummary?.mealLogs ?? [];
  const consumedCalories = userSummary?.totalCalories ?? 0;

  const updateFastingMutation = useMutation({
    mutationFn: updateFastingStatus,
    onSuccess: (fastingStatus) => {
      queryClient.invalidateQueries({ queryKey: ["userSummary"] });
      setTimePickerVisible(false);
      Toast.show({
        type: "success",
        text1: "Status Updated",
        text2: `You are now ${fastingStatus.status.toLowerCase()}.`,
        position: "bottom",
      });
    },
    onError: (error) => {
      console.error("Failed to update fasting status:", error);
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Something went wrong while updating your status.",
        position: "bottom",
      });
    },
  });

  const handleTogglePhase = (selectedTime: Date) => {
    updateFastingMutation.mutate({
      trackingState: trackingState === "FASTING" ? "EATING" : "FASTING",
      startTime: selectedTime.toISOString(),
    });
  };

  return {
    userSummary,
    isLoading,
    trackingState,
    startTime,
    mealLogs,
    consumedCalories,
    isTimePickerVisible,
    setTimePickerVisible,
    handleTogglePhase,
    isPending: updateFastingMutation.isPending,
  };
};
