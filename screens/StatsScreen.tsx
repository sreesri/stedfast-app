import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, Text } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import WeightLogStats from "../components/WeightLogStats";
import DailyIntakeStats from "../components/DailyIntakeStats";
import SafeScreen from "../components/SafeScreen";
import { getHealthStats, saveHealthStats, getIntakeSummary } from "../utils/http";
import { COLORS } from "../utils/Constants";

const StatsScreen = () => {
  const queryClient = useQueryClient();
  const [weightInput, setWeightInput] = useState("");

  const today = new Date();
  const pastWeek = new Date();
  pastWeek.setDate(today.getDate() - 6);
  const formattedToday = today.toISOString().split("T")[0];
  const formattedPastWeek = pastWeek.toISOString().split("T")[0];

  const { data: healthStats, isLoading: isHealthLoading } = useQuery({
    queryKey: ["healthStats"],
    queryFn: getHealthStats,
  });

  const { data: intakeStats, isLoading: isIntakeLoading } = useQuery({
    queryKey: ["intakeStats", formattedPastWeek, formattedToday],
    queryFn: () => getIntakeSummary(formattedPastWeek, formattedToday),
  });

  const saveWeightMutation = useMutation({
    mutationFn: (weight: number) => saveHealthStats({ weightKg: weight }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["healthStats"] });
      setWeightInput("");
      Toast.show({ type: "success", text1: "Weight logged!", position: "bottom" });
    },
    onError: () => {
      Toast.show({ type: "error", text1: "Failed to log weight", position: "bottom" });
    }
  });

  const handleSaveWeight = () => {
    const w = parseFloat(weightInput);
    if (!isNaN(w) && w > 0) {
      saveWeightMutation.mutate(w);
    } else {
      Toast.show({ type: "error", text1: "Enter a valid weight", position: "bottom" });
    }
  };

  const isLoading = isHealthLoading || isIntakeLoading;

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
    <SafeScreen style={styles.container} scrollable={true}>
      <DailyIntakeStats intakeData={intakeStats || []} />
      
      <View style={styles.weightCard}>
        <Text style={styles.title}>Weight Tracking</Text>
        <WeightLogStats weightData={weightData} />
      </View>
      
      <View style={styles.inputCard}>
        <Text style={styles.label}>Log Today's Weight</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={weightInput}
            onChangeText={setWeightInput}
            keyboardType="decimal-pad"
            placeholder="0.0"
            placeholderTextColor="#7a7a7a"
          />
          <Text style={styles.unitText}>kg</Text>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSaveWeight}
            disabled={saveWeightMutation.isPending}
          >
            {saveWeightMutation.isPending ? (
              <ActivityIndicator color={COLORS.background} />
            ) : (
              <Text style={styles.saveButtonText}>Add</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    paddingHorizontal: 15,
    paddingBottom: 40,
    paddingTop: 10,
  },
  weightCard: {
    backgroundColor: COLORS.ascent,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  inputCard: {
    backgroundColor: COLORS.ascent,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 18,
    color: COLORS.primary,
  },
  unitText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginHorizontal: 10,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
  },
});
