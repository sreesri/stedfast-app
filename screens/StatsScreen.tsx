import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, Text } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import WeightLogStats from "../components/WeightLogStats";
import DailyIntakeStats from "../components/DailyIntakeStats";
import MacroStats from "../components/MacroStats";
import PeriodToggle, { Period } from "../components/PeriodToggle";
import SafeScreen from "../components/SafeScreen";
import { getHealthStats, saveHealthStats, getIntakeSummary } from "../utils/http";
import { COLORS } from "../utils/Constants";

function getDateRange(period: Period) {
  const today = new Date();
  const start = new Date(today);
  if (period === "daily") start.setDate(today.getDate() - 6);
  if (period === "weekly") start.setDate(today.getDate() - 55);
  if (period === "monthly") start.setDate(today.getDate() - 179);
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return { startDate: fmt(start), endDate: fmt(today) };
}

const StatsScreen = () => {
  const queryClient = useQueryClient();
  const [weightInput, setWeightInput] = useState("");
  const [period, setPeriod] = useState<Period>("daily");

  const { startDate, endDate } = getDateRange(period);

  const { data: healthStats = [], isLoading: isHealthLoading, refetch: refetchHealth, isRefetching: isHealthRefetching } = useQuery({
    queryKey: ["healthStats"],
    queryFn: getHealthStats,
  });

  const { data: intakeStats = [], isLoading: isIntakeLoading, refetch: refetchIntake, isRefetching: isIntakeRefetching } = useQuery({
    queryKey: ["intakeStats", startDate, endDate],
    queryFn: () => getIntakeSummary(startDate, endDate),
  });

  const onRefresh = () => Promise.all([refetchHealth(), refetchIntake()]);
  const isRefreshing = isHealthRefetching || isIntakeRefetching;

  const saveWeightMutation = useMutation({
    mutationFn: (weight: number) => saveHealthStats({ weightKg: weight }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["healthStats"] });
      setWeightInput("");
      Toast.show({ type: "success", text1: "Weight logged!", position: "bottom" });
    },
    onError: () => {
      Toast.show({ type: "error", text1: "Failed to log weight", position: "bottom" });
    },
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

  return (
    <SafeScreen style={styles.container} scrollable={true} onRefresh={onRefresh} refreshing={isRefreshing}>
      <PeriodToggle period={period} onChangePeriod={setPeriod} />

      <DailyIntakeStats intakeData={intakeStats} period={period} />

      <MacroStats intakeData={intakeStats} period={period} />

      <View style={styles.weightCard}>
        <Text style={styles.title}>Weight Tracking</Text>
        <WeightLogStats healthStats={healthStats} period={period} />
      </View>

      <View style={styles.inputCard}>
        <Text style={styles.inputLabel}>Log Today's Weight</Text>
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
    marginBottom: 20,
  },
  inputLabel: {
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
