import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../utils/Constants";
import MealLogItem from "./MealLogItem";

interface MealLogContainerProps {
  meal: any[];
  onPressItem: (meal: any) => void;
  fastEndTime?: string;
}

const MealLogContainer: React.FC<MealLogContainerProps> = ({
  meal,
  onPressItem,
  fastEndTime,
}) => {
  if (!meal || meal.length === 0) {
    return (
      <Text style={styles.emptyText}>No meals logged for this day</Text>
    );
  }

  return (
    <View style={styles.timeline}>
      {meal.map((item, index) => (
        <MealLogItem
          key={item?.id ?? item?._id ?? index}
          meal={item}
          onPress={onPressItem}
          isLast={index === meal.length - 1 && !fastEndTime}
        />
      ))}

      {/* Fast begins marker */}
      {fastEndTime && (
        <View style={styles.fastMarkerRow}>
          <View style={styles.timeCol}>
            <Text style={styles.fastTime}>{fastEndTime}</Text>
          </View>
          <View style={styles.rail}>
            <View style={styles.fastDot} />
          </View>
          <View style={styles.fastLabel}>
            <Text style={styles.fastText}>Fast begins</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default MealLogContainer;

const styles = StyleSheet.create({
  timeline: {
    paddingBottom: 20,
  },
  emptyText: {
    color: "rgba(233,233,237,0.4)",
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
  },
  fastMarkerRow: {
    flexDirection: "row",
    gap: 16,
  },
  timeCol: {
    width: 58,
    alignItems: "flex-end",
    paddingTop: 2,
  },
  fastTime: {
    fontSize: 11,
    color: "rgba(233,233,237,0.35)",
    fontVariant: ["tabular-nums"],
  },
  rail: {
    alignItems: "center",
    width: 8,
  },
  fastDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.inactive,
    marginTop: 2,
  },
  fastLabel: {
    flex: 1,
  },
  fastText: {
    fontSize: 12,
    color: "rgba(233,233,237,0.4)",
  },
});
