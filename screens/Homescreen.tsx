import { ActivityIndicator, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { COLORS } from "../utils/Constants";
import FastingTracker from "../components/FastingTracker";
import Divider from "../components/Divider";
import DailySummary from "../components/DailySummary";
import TimePickerModal from "../components/TimePickerModal";
import { getUserSummary, updateFastingStatus } from "../utils/http";
import Toast from "react-native-toast-message";
import { useBaseContext } from "../context/BaseContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Homescreen = () => {
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const { baseConfig } = useBaseContext();
  const queryClient = useQueryClient();

  const { data: userSummary, isLoading } = useQuery({
    queryKey: ['userSummary'],
    queryFn: getUserSummary,
  });

  const trackingState = userSummary?.fasting?.status ?? "FASTING";
  const startTime = userSummary?.fasting?.startTime ? new Date(userSummary.fasting.startTime) : new Date();
  const mealLogs = userSummary?.mealLogs ?? [];
  const consumedCalories = userSummary?.totalCalories ?? 0;

  const updateFastingMutation = useMutation({
    mutationFn: updateFastingStatus,
    onSuccess: (fastingStatus) => {
      queryClient.invalidateQueries({ queryKey: ['userSummary'] });
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
    }
  });

  const handleTogglePhase = (selectedTime: Date) => {
    updateFastingMutation.mutate({
      trackingState: trackingState === "FASTING" ? "EATING" : "FASTING",
      startTime: selectedTime.toISOString(),
    });
  };

  return (
    <>
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <>
            <FastingTracker
              trackingState={trackingState}
              startTime={startTime}
              onToggle={() => setTimePickerVisible(true)}
              fastRatio={baseConfig?.fastingWindow}
              eatRatio={baseConfig?.eatingWindow}
            />
            <Divider />
            <DailySummary
              consumed={consumedCalories}
              maxLimit={baseConfig?.calorieLimit}
              mealLog={mealLogs}
            />
            <TimePickerModal
              visible={isTimePickerVisible}
              initialTime={new Date()}
              onClose={() => setTimePickerVisible(false)}
              onConfirm={handleTogglePhase}
            />
          </>
        )}
      </View>
    </>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 10,
    paddingTop: 50,
    justifyContent: "center",
  },
});
