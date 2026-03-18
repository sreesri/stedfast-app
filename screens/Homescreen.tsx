import { ActivityIndicator, StyleSheet, View } from "react-native";
import React, { useCallback, useState } from "react";
import { COLORS } from "../utils/Constants";
import FastingTracker from "../components/FastingTracker";
import Divider from "../components/Divider";
import DailySummary from "../components/DailySummary";
import TimePickerModal from "../components/TimePickerModal";
import { getUserSummary, updateFastingStatus } from "../utils/http";
import Toast from "react-native-toast-message";
import { useBaseContext } from "../context/BaseContext";
import { useFocusEffect } from "@react-navigation/native";

const Homescreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [trackingState, setTrackingState] = useState("FASTING");
  const [startTime, setStartTime] = useState(new Date());
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [mealLogs, setMealLogs] = useState([]);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const { baseConfig } = useBaseContext();

  const fetchUserSummary = useCallback(async () => {
    try {
      setLoading(true);
      const userSummary = await getUserSummary();
      setTrackingState(userSummary.fasting.status);
      setStartTime(new Date(userSummary.fasting.startTime));
      setMealLogs(userSummary.mealLogs ?? []);
      setConsumedCalories(userSummary.totalCalories ?? 0);
    } catch (error) {
      console.error("Failed to fetch user summary:", error);
      Toast.show({
        type: "error",
        text1: "Load Failed",
        text2: "Could not refresh your dashboard.",
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTogglePhase = async (selectedTime: Date) => {
    try {
      const fastingStatus = await updateFastingStatus({
        trackingState: trackingState === "FASTING" ? "EATING" : "FASTING",
        startTime: selectedTime.toISOString(),
      });

      setTrackingState(fastingStatus.status);
      setStartTime(new Date(fastingStatus.startTime));
      setTimePickerVisible(false);
      Toast.show({
        type: "success",
        text1: "Status Updated",
        text2: `You are now ${fastingStatus.status.toLowerCase()}.`,
        position: "bottom",
      });
    } catch (error) {
      console.error("Failed to update fasting status:", error);
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Something went wrong while updating your status.",
        position: "bottom",
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserSummary();
    }, [fetchUserSummary]),
  );

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
