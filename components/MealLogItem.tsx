import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, withOpacity } from "../utils/Constants";

interface MealLogItemProps {
  meal: any;
  onPress?: (meal: any) => void;
  isLast?: boolean;
}

const MealLogItem: React.FC<MealLogItemProps> = ({ meal, onPress, isLast }) => {
  const timeStr = new Date(meal.mealTime).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const dishesStr =
    meal.dishes?.map((d: any) => `${d.name} ×${d.quantity}`).join(" · ") || "";

  return (
    <TouchableOpacity
      onPress={() => onPress?.(meal)}
      activeOpacity={0.7}
      style={styles.row}
    >
      {/* Time column */}
      <View style={styles.timeCol}>
        <Text style={styles.time}>{timeStr}</Text>
      </View>

      {/* Rail column */}
      <View style={styles.rail}>
        <View style={styles.dot} />
        {!isLast && <View style={styles.line} />}
      </View>

      {/* Content column */}
      <View style={[styles.content, !isLast && styles.contentPadded]}>
        <View style={styles.contentHeader}>
          <Text style={styles.mealName}>{meal.notes || "Meal"}</Text>
          <Text style={styles.calories}>
            {meal.calories}
            <Text style={styles.caloriesUnit}> kcal</Text>
          </Text>
        </View>
        {dishesStr ? <Text style={styles.dishes}>{dishesStr}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

export default MealLogItem;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 16,
  },
  timeCol: {
    width: 58,
    alignItems: "flex-end",
    paddingTop: 2,
  },
  time: {
    fontSize: 11,
    color: withOpacity(COLORS.text, 0.5),
    fontVariant: ["tabular-nums"],
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
  mealName: {
    fontSize: 14.5,
    fontWeight: "500",
    color: COLORS.text,
  },
  calories: {
    fontSize: 13.5,
    fontWeight: "500",
    color: COLORS.text,
    fontVariant: ["tabular-nums"],
  },
  caloriesUnit: {
    fontSize: 10.5,
    color: withOpacity(COLORS.text, 0.45),
  },
  dishes: {
    fontSize: 12,
    color: withOpacity(COLORS.text, 0.5),
    marginTop: 3,
  },
});
