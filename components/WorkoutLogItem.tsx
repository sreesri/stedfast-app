import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, MUSCLE_GROUP_LABELS, withOpacity } from "../utils/Constants";
import { WorkoutLog } from "../utils/types";

interface WorkoutLogItemProps {
  workoutLog: WorkoutLog;
  onPress?: (workoutLog: WorkoutLog) => void;
  isLast?: boolean;
}

const WorkoutLogItem: React.FC<WorkoutLogItemProps> = ({
  workoutLog,
  onPress,
  isLast,
}) => {
  const muscleGroupsStr = (workoutLog.muscleGroups ?? [])
    .map((group) => MUSCLE_GROUP_LABELS[group] ?? group)
    .join(" · ");
  const exercisesStr =
    workoutLog.exercises
      ?.map((e) => `${e.name} ${e.sets}x${e.reps}`)
      .join(" · ") || "";
  const exerciseCount = workoutLog.exercises?.length ?? 0;

  return (
    <TouchableOpacity
      onPress={() => onPress?.(workoutLog)}
      activeOpacity={0.7}
      style={styles.row}
    >
      <View style={styles.rail}>
        <View style={styles.dot} />
        {!isLast && <View style={styles.line} />}
      </View>

      <View style={[styles.content, !isLast && styles.contentPadded]}>
        <View style={styles.contentHeader}>
          <Text style={styles.title}>{muscleGroupsStr || "Workout"}</Text>
          <Text style={styles.count}>
            {exerciseCount}
            <Text style={styles.countUnit}>
              {" "}
              {exerciseCount === 1 ? "exercise" : "exercises"}
            </Text>
          </Text>
        </View>
        {exercisesStr ? <Text style={styles.exercises}>{exercisesStr}</Text> : null}
        {workoutLog.notes ? <Text style={styles.notes}>{workoutLog.notes}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

export default WorkoutLogItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 16,
  },
  rail: {
    alignItems: "center",
    width: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 2,
  },
  line: {
    width: 1,
    flex: 1,
    backgroundColor: withOpacity(COLORS.text, 0.12),
    marginTop: 4,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  contentPadded: {
    paddingBottom: 26,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  title: {
    fontSize: 14.5,
    fontWeight: "500",
    color: COLORS.text,
  },
  count: {
    fontSize: 13.5,
    fontWeight: "500",
    color: COLORS.text,
    fontVariant: ["tabular-nums"],
  },
  countUnit: {
    fontSize: 10.5,
    color: withOpacity(COLORS.text, 0.45),
  },
  exercises: {
    fontSize: 12,
    color: withOpacity(COLORS.text, 0.5),
    marginTop: 3,
  },
  notes: {
    fontSize: 11.5,
    color: withOpacity(COLORS.text, 0.4),
    marginTop: 3,
    fontStyle: "italic",
  },
});
