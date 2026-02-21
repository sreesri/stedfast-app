import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { COLORS } from "../utils/Constants";
import FastingTracker from "../components/FastingTracker";
import Divider from "../components/Divider";
import DailySummary from "../components/DailySummary";

const Homescreen = () => {
  const [trackingState, setTrackingState] = useState("FASTING");
  const [startTime, setStartTime] = useState(new Date("2026-2-20T23:30:05"));

  const handleTogglePhase = () => {
    setTrackingState((prev) => (prev === "FASTING" ? "EATING" : "FASTING"));
    setStartTime(Date.now());
  };

  return (
    <View style={styles.container}>
      <FastingTracker
        trackingState={trackingState}
        startTime={startTime}
        onToggle={handleTogglePhase}
        fastRatio={18}
        eatRatio={6}
      />
      <Divider />
      <DailySummary />
    </View>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 10,
  },
});
