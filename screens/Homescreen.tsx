import { ActivityIndicator, StyleSheet, View } from "react-native";
import React from "react";
import { COLORS } from "../utils/Constants";
import FastingTracker from "../components/FastingTracker";
import Divider from "../components/Divider";
import DailySummary from "../components/DailySummary";
import TimePicker from "../components/TimePicker";
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
    <SafeScreen style={styles.container} scrollable={true}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <FastingTracker
            trackingState={trackingState}
            startTime={startTime}
            onToggle={() => setTimePickerVisible(!isTimePickerVisible)}
            fastRatio={baseConfig?.fastingWindow}
            eatRatio={baseConfig?.eatingWindow}
          />
          
          {isTimePickerVisible && (
            <View style={styles.inlinePickerContainer}>
              <Text style={styles.pickerLabel}>
                Select {trackingState === "FASTING" ? "Eating" : "Fasting"} Start Time
              </Text>
              <TimePicker
                initialTime={new Date()}
                onTimeChange={handleTogglePhase}
              />
              <TouchableOpacity 
                style={styles.closePickerButton} 
                onPress={() => setTimePickerVisible(false)}
              >
                <Text style={styles.closePickerText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          <Divider />
          <DailySummary
            consumed={consumedCalories}
            maxLimit={baseConfig?.calorieLimit}
            mealLog={mealLogs}
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
  inlinePickerContainer: {
    marginVertical: 15,
    backgroundColor: COLORS.ascent,
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  closePickerButton: {
    marginTop: 10,
    alignItems: "center",
  },
  closePickerText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
