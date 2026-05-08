import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../utils/Constants";

interface MacroTrackerProps {
  label: string;
  consumed: number;
  limit: number;
  unit: string;
  color: string;
}

const MacroTracker = ({
  label,
  consumed,
  limit,
  unit,
  color,
}: MacroTrackerProps) => {
  const percentage = Math.round((consumed / limit) * 100);
  const isOverLimit = consumed > limit;

  const basePercentage = Math.min((consumed / limit) * 100, 100);

  let baseWidth = basePercentage;
  let overageWidth = 0;

  if (isOverLimit) {
    baseWidth = (limit / consumed) * 100;
    overageWidth = 100 - baseWidth;
  }

  const textColor = isOverLimit ? "#E63946" : COLORS.primary;

  return (
    <View style={styles.viewContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.percentageText, { color: textColor }]}>
          {percentage}%
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${baseWidth}%`, backgroundColor: color },
            ]}
          />
          {isOverLimit && (
            <View
              style={[
                styles.progressBarFill,
                styles.overageFill,
                { width: `${overageWidth}%` },
              ]}
            />
          )}
        </View>
        <Text style={styles.endText}>
          {isOverLimit ? Math.round(consumed) : limit}
        </Text>
      </View>

      <View style={styles.metricsRow}>
        <Text style={styles.consumedText}>
          {Math.round(consumed)} {unit} consumed
        </Text>
      </View>
    </View>
  );
};

export default MacroTracker;

const styles = StyleSheet.create({
  viewContainer: {
    width: "100%",
    marginVertical: 5,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
  },
  percentageText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricsRow: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  consumedText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  progressBarBackground: {
    flex: 1,
    flexDirection: "row",
    height: 12,
    backgroundColor: COLORS.primary + "15",
    borderRadius: 6,
    marginRight: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
  },
  overageFill: {
    backgroundColor: "#E63946",
  },
  endText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
