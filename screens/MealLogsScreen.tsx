import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { COLORS, SCREEN, withOpacity } from "../utils/Constants";
import MealLogContainer from "../components/MealLogContainer";
import { useMealLogs } from "../hooks/useMealLogs";
import SafeScreen from "../components/SafeScreen";
import { useNavigation } from "@react-navigation/native";
import { MealLog } from "../utils/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFastingContext } from "../context/FastingContext";

const MealLogsScreen = () => {
  const navigation = useNavigation<any>();
  const { fastingConfig } = useFastingContext();
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const { mealLogs, isError, refetch, isRefreshing } = useMealLogs(selectedDate);

  const changeDate = (days: number) => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + days);
      return d.toISOString().split("T")[0];
    });
  };

  const handleEditMeal = (meal?: MealLog) => {
    navigation.navigate(SCREEN.mealedit, { editingMeal: meal });
  };

  const dateLabel = new Date(selectedDate + "T00:00:00").toLocaleDateString(
    "en-US",
    { weekday: "long", month: "short", day: "numeric" }
  );

  const totalCal = mealLogs?.reduce((s: number, m: any) => s + (m.calories || 0), 0) ?? 0;
  const mealCount = mealLogs?.length ?? 0;

  // Fast end time from fasting config
  const fastEndLabel = fastingConfig
    ? (() => {
        const now = new Date(selectedDate + "T00:00:00");
        // Approximate fast end as end of day eating window — show a generic label
        return null; // simplified: no fast end time shown
      })()
    : null;

  return (
    <SafeScreen style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => changeDate(-1)}
          style={styles.navBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={16} color={COLORS.navIcon} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.dateTitle}>{dateLabel}</Text>
          <Text style={styles.dateSubtitle}>
            {mealCount} {mealCount === 1 ? "meal" : "meals"} ·{" "}
            {totalCal.toLocaleString()} kcal
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => changeDate(1)}
          style={styles.navBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={16} color={COLORS.navIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refetch}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {isError ? (
          <View style={styles.errorState}>
            <Text style={styles.errorTitle}>Couldn't load meal logs</Text>
            <Text style={styles.errorSubtitle}>
              Something went wrong fetching this day's meals. Pull down to
              try again.
            </Text>
          </View>
        ) : (
          <MealLogContainer
            meal={mealLogs}
            onPressItem={handleEditMeal}
            fastEndTime={undefined}
          />
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => handleEditMeal()}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </SafeScreen>
  );
};

export default MealLogsScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: withOpacity(COLORS.text, 0.14),
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    alignItems: "center",
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
  },
  dateSubtitle: {
    fontSize: 11.5,
    color: withOpacity(COLORS.text, 0.5),
    marginTop: 1,
    fontVariant: ["tabular-nums"],
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 80,
  },
  fab: {
    position: "absolute",
    bottom: 28,
    right: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  errorState: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    alignItems: "center",
    marginTop: 20,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  errorSubtitle: {
    marginTop: 8,
    fontSize: 12.5,
    color: withOpacity(COLORS.text, 0.5),
    textAlign: "center",
  },
});
