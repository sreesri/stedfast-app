import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import WeightLogStats from "../components/WeightLogStats";
import SafeScreen from "../components/SafeScreen";
import { getHealthStats } from "../utils/http";
import { COLORS } from "../utils/Constants";

const StatsScreen = () => {
  const { data: healthStats, isLoading } = useQuery({
    queryKey: ["healthStats"],
    queryFn: getHealthStats,
  });

  if (isLoading) {
    return (
      <SafeScreen style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeScreen>
    );
  }

  // Map the new BodyStat objects to the format expected by WeightLogStats
  const weightData = (healthStats || []).map(stat => ({
    date: stat.loggedDate,
    weight: stat.weightKg
  }));

  return (
    <SafeScreen>
      <WeightLogStats weightData={weightData} />
    </SafeScreen>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});
