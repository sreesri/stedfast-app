import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { COLORS, SCREEN } from "../utils/Constants";
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
  const { mealLogs, refetch, isRefreshing } = useMealLogs(selectedDate);

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
          <Ionicons name="chevron-back" size={16} color="#9397ab" />
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
          <Ionicons name="chevron-forward" size={16} color="#9397ab" />
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
        <MealLogContainer
          meal={mealLogs}
          onPressItem={handleEditMeal}
          fastEndTime={undefined}
        />
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
    borderColor: "rgba(233,233,237,0.14)",
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
    color: "rgba(233,233,237,0.5)",
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
    backgroundColor: "rgba(145,132,217,0.1)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 9,
    elevation: 4,
  },
});
