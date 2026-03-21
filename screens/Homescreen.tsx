import { ActivityIndicator, StyleSheet, View } from "react-native";
import React from "react";
import { COLORS } from "../utils/Constants";
import FastingTracker from "../components/FastingTracker";
import Divider from "../components/Divider";
import DailySummary from "../components/DailySummary";
import TimePickerModal from "../components/TimePickerModal";
import { useBaseContext } from "../context/BaseContext";
import { useHomeLogic } from "../hooks/useHomeLogic";
import SafeScreen from "../components/SafeScreen";

const Homescreen = () => {
  const { baseConfig } = useBaseContext();
  const {
    isLoading,
    trackingState,
    startTime,
    mealLogs,
    consumedCalories,
    isTimePickerVisible,
    setTimePickerVisible,
    handleTogglePhase,
  } = useHomeLogic();

  return (
    <SafeScreen style={styles.container}>
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
    </SafeScreen>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: "center",
  },
});
