import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import {
  getActiveSession,
  startSession,
  endActiveSession,
  getActiveFastingSchedule,
  getIntakeSummary,
} from "../utils/http";

export const useHomeLogic = () => {
  const today = new Date().toISOString().split("T")[0];

  const { data: intakeSummaries, isLoading: isIntakeLoading, refetch: refetchIntake, isRefetching: isIntakeRefetching } = useQuery({
    queryKey: ["intakeSummary", today],
    queryFn: () => getIntakeSummary(today),
  });

  const { data: activeSession, isLoading: isActiveSessionLoading, refetch: refetchSession, isRefetching: isSessionRefetching } = useQuery({
    queryKey: ["activeSession"],
    queryFn: getActiveSession,
  });

  const { data: activeSchedule, refetch: refetchSchedule, isRefetching: isScheduleRefetching } = useQuery({
    queryKey: ["activeSchedule"],
    queryFn: getActiveFastingSchedule,
  });

  const refetch = () => Promise.all([refetchIntake(), refetchSession(), refetchSchedule()]);

  const isLoading = isIntakeLoading || isActiveSessionLoading;

  const trackingState = activeSession?.sessionType || "FAST";
  const startTime = activeSession?.startedAt
    ? new Date(activeSession.startedAt)
    : new Date();

  const intake = intakeSummaries?.[0] || null;

  const macros = {
    calories: {
      consumed: intake?.consumedCalories ?? 0,
      limit: intake?.calorieLimit ?? 2000,
    },
    protein: {
      consumed: intake?.consumedProtein ?? 0,
      limit: intake?.proteinLimit ?? 150,
    },
    carbs: {
      consumed: intake?.consumedCarbs ?? 0,
      limit: intake?.carbsLimit ?? 250,
    },
    fat: {
      consumed: intake?.consumedFat ?? 0,
      limit: intake?.fatLimit ?? 70,
    },
  };

  const activeScheduleId = activeSchedule?.id || "default";
  const scheduleStartTime = activeSchedule?.createdAt
    ? new Date(activeSchedule.createdAt)
    : undefined;

  return {
    isLoading,
    trackingState: trackingState === "FAST" ? "FASTING" : "EATING",
    startTime,
    scheduleStartTime,
    macros,
    rawTrackingState: trackingState,
    activeScheduleId,
    refetch,
    isRefreshing: isIntakeRefetching || isSessionRefetching || isScheduleRefetching,
  };
};
