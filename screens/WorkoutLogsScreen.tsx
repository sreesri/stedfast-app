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
import WorkoutLogContainer from "../components/WorkoutLogContainer";
import { useWorkoutLogs } from "../hooks/useWorkoutLogs";
import SafeScreen from "../components/SafeScreen";
import { useNavigation } from "@react-navigation/native";
import { WorkoutLog } from "../utils/types";
import Ionicons from "@expo/vector-icons/Ionicons";

const WorkoutLogsScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const { workoutLogs, refetch, isRefreshing } = useWorkoutLogs(selectedDate);

  const changeDate = (days: number) => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + days);
      return d.toISOString().split("T")[0];
    });
  };

  const handleEditWorkout = (workoutLog?: WorkoutLog) => {
    navigation.navigate(SCREEN.workoutedit, { editingLog: workoutLog });
  };

  const dateLabel = new Date(selectedDate + "T00:00:00").toLocaleDateString(
    "en-US",
    { weekday: "long", month: "short", day: "numeric" }
  );

  const exerciseCount = workoutLogs?.reduce(
    (s: number, w: WorkoutLog) => s + (w.exercises?.length || 0),
    0
  ) ?? 0;
  const logCount = workoutLogs?.length ?? 0;

  return (
    <SafeScreen style={styles.container}>
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
            {logCount} {logCount === 1 ? "workout" : "workouts"} ·{" "}
            {exerciseCount} {exerciseCount === 1 ? "exercise" : "exercises"}
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

      <View style={styles.libraryLinkRow}>
        <TouchableOpacity
          style={styles.libraryLink}
          onPress={() => navigation.navigate(SCREEN.exerciselibrary)}
          activeOpacity={0.7}
        >
          <Ionicons name="list-outline" size={14} color={COLORS.accent300} />
          <Text style={styles.libraryLinkText}>Exercise library</Text>
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
        <WorkoutLogContainer
          workoutLogs={workoutLogs}
          onPressItem={handleEditWorkout}
        />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => handleEditWorkout()}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </SafeScreen>
  );
};

export default WorkoutLogsScreen;

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
  libraryLinkRow: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  libraryLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  libraryLinkText: {
    fontSize: 12.5,
    color: COLORS.accent300,
    fontWeight: "500",
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
});
