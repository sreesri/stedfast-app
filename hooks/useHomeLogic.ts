import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { 
  getUserSummary, 
  getActiveSession, 
  startSession, 
  endActiveSession,
  getFastingSchedules 
} from "../utils/http";

export const useHomeLogic = () => {
  const queryClient = useQueryClient();
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  // Still fetch userSummary as a fallback for calories/meals if supported
  const { data: userSummary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["userSummary"],
    queryFn: getUserSummary,
    retry: false,
  });

  const { data: activeSession, isLoading: isActiveSessionLoading } = useQuery({
    queryKey: ["activeSession"],
    queryFn: getActiveSession,
  });

  const { data: schedules } = useQuery({
    queryKey: ["fastingSchedules"],
    queryFn: getFastingSchedules,
  });

  const isLoading = isSummaryLoading || isActiveSessionLoading;

  const trackingState = activeSession?.sessionType || "FASTING"; // Default if no session
  const startTime = activeSession?.startedAt
    ? new Date(activeSession.startedAt)
    : new Date();
  
  const mealLogs = userSummary?.mealLogs ?? [];
  const consumedCalories = userSummary?.totalCalories ?? 0;

  const togglePhaseMutation = useMutation({
    mutationFn: async (selectedTime: Date) => {
      // 1. End current session if active
      if (activeSession) {
        await endActiveSession();
      }

      // 2. Start new session
      const nextType = trackingState === "FAST" ? "EAT" : "FAST";
      const defaultScheduleId = schedules?.[0]?.id || "default";
      
      return await startSession({
        scheduleId: defaultScheduleId,
        sessionType: nextType,
      });
    },
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ["userSummary"] });
      queryClient.invalidateQueries({ queryKey: ["activeSession"] });
      setTimePickerVisible(false);
      Toast.show({
        type: "success",
        text1: "Status Updated",
        text2: `You are now ${newSession.sessionType.toLowerCase()}ing.`,
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
    togglePhaseMutation.mutate(selectedTime);
  };

  return {
    userSummary,
    isLoading,
    trackingState: trackingState === "FAST" ? "FASTING" : "EATING",
    startTime,
    mealLogs,
    consumedCalories,
    isTimePickerVisible,
    setTimePickerVisible,
    handleTogglePhase,
    isPending: togglePhaseMutation.isPending,
  };
};
