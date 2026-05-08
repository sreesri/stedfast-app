import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../utils/Constants";

export type Period = "daily" | "weekly" | "monthly";

interface PeriodToggleProps {
  period: Period;
  onChangePeriod: (p: Period) => void;
}

const OPTIONS: { label: string; value: Period }[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

const PeriodToggle: React.FC<PeriodToggleProps> = ({ period, onChangePeriod }) => {
  return (
    <View style={styles.container}>
      {OPTIONS.map((opt) => {
        const isActive = period === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.option, isActive && styles.activeOption]}
            onPress={() => onChangePeriod(opt.value)}
            activeOpacity={0.8}
          >
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default PeriodToggle;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.ascent,
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 20,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activeOption: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  activeLabel: {
    color: COLORS.background,
  },
});
