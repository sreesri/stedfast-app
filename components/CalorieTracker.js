import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, SCREEN } from "../utils/Constants";
import { useNavigation } from "@react-navigation/native";

const CalorieTracker = ({ consumedCalories, maxCalories }) => {
  const navigation = useNavigation();
  const percentage = Math.round((consumedCalories / maxCalories) * 100);
  const isOverLimit = consumedCalories > maxCalories;

  const basePercentage = Math.min((consumedCalories / maxCalories) * 100, 100);

  let baseWidth = basePercentage;
  let overageWidth = 0;

  if (isOverLimit) {
    baseWidth = (maxCalories / consumedCalories) * 100;
    overageWidth = 100 - baseWidth;
  }

  const textColor = isOverLimit ? "#E63946" : COLORS.primary;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => navigation.navigate(SCREEN.meallogs)}
    >
      <Text style={[styles.percentageText, { color: textColor }]}>
        {percentage}%
      </Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              styles.baseFill,
              { width: `${baseWidth}%` },
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
          {isOverLimit ? consumedCalories : maxCalories}
        </Text>
      </View>

      <View style={styles.metricsRow}>
        <Text style={styles.consumedText}>
          {consumedCalories} kcal consumed
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CalorieTracker;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.ascent,
    borderRadius: 15,
    marginVertical: 5,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  percentageText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricsRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  consumedText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
  progressBarBackground: {
    flex: 1,
    flexDirection: "row", // added so the stacked bars sit side by side
    height: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 7,
    marginRight: 10,
    overflow: "hidden", // ensures rounded corners clip the inner fills
  },
  progressBarFill: {
    height: "100%",
  },
  baseFill: {
    backgroundColor: COLORS.secondary,
  },
  overageFill: {
    backgroundColor: "#E63946",
  },
  endText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
