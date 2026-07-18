import React, { useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import WeightLogStats from "../components/WeightLogStats";
import DailyIntakeStats from "../components/DailyIntakeStats";
import MacroStats from "../components/MacroStats";
import PeriodToggle, { Period } from "../components/PeriodToggle";
import SafeScreen from "../components/SafeScreen";
import { getHealthStats, saveHealthStats, getIntakeSummary } from "../utils/http";
import { COLORS, withOpacity } from "../utils/Constants";
import Divider from "../components/Divider";

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

  const today = new Date();
  const dateRange = `${new Date(startDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${today.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  return (
    <SafeScreen
      style={styles.container}
      scrollable={true}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Trends</Text>
          <Text style={styles.dateRange}>{dateRange}</Text>
        </View>
        <PeriodToggle period={period} onChangePeriod={setPeriod} />
      </View>

      <DailyIntakeStats intakeData={intakeStats} period={period} />

      <Divider />

      <MacroStats intakeData={intakeStats} period={period} />

      <Divider />

      {/* Weight section */}
      <View style={styles.weightHeader}>
        <Text style={styles.weightKicker}>WEIGHT</Text>
      </View>
      <WeightLogStats healthStats={healthStats} period={period} />

      {/* Log weight */}
      <View style={styles.logWeightRow}>
        <View style={styles.weightInput}>
          <TextInput
            style={styles.weightInputText}
            value={weightInput}
            onChangeText={setWeightInput}
            keyboardType="decimal-pad"
            placeholder="Log today's weight"
            placeholderTextColor={COLORS.inactive}
          />
          <Text style={styles.weightUnit}>kg</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleSaveWeight}
          disabled={saveWeightMutation.isPending}
          activeOpacity={0.8}
        >
          {saveWeightMutation.isPending ? (
            <ActivityIndicator color={COLORS.primary} size="small" />
          ) : (
            <Text style={styles.addButtonText}>Add</Text>
          )}
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: -0.3,
    color: COLORS.text,
  },
  dateRange: {
    fontSize: 12.5,
    color: withOpacity(COLORS.text, 0.5),
    marginTop: 2,
  },
  weightHeader: {
    marginBottom: 12,
  },
  weightKicker: {
    fontSize: 12,
    letterSpacing: 1,
    color: COLORS.accent300,
  },
  logWeightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 18,
  },
  weightInput: {
    flex: 1,
    height: 42,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  weightInputText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  weightUnit: {
    fontSize: 12,
    color: withOpacity(COLORS.text, 0.45),
  },
  addButton: {
    height: 42,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
  },
});
