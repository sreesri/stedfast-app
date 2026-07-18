import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS, withOpacity } from "../utils/Constants";
import WorkoutLogItem from "./WorkoutLogItem";
import { WorkoutLog } from "../utils/types";

interface WorkoutLogContainerProps {
  workoutLogs: WorkoutLog[];
  onPressItem: (workoutLog: WorkoutLog) => void;
}

const WorkoutLogContainer: React.FC<WorkoutLogContainerProps> = ({
  workoutLogs,
  onPressItem,
}) => {
  if (!workoutLogs || workoutLogs.length === 0) {
    return <Text style={styles.emptyText}>No workouts logged for this day</Text>;
  }

  return (
    <View style={styles.timeline}>
      {workoutLogs.map((item, index) => (
        <WorkoutLogItem
          key={item.id}
          workoutLog={item}
          onPress={onPressItem}
          isLast={index === workoutLogs.length - 1}
        />
      ))}
    </View>
  );
};

export default WorkoutLogContainer;

const styles = StyleSheet.create({
  timeline: {
    paddingBottom: 20,
  },
  emptyText: {
    color: withOpacity(COLORS.text, 0.4),
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
  },
});
