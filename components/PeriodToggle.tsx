import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, withOpacity } from "../utils/Constants";

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
            style={[styles.chip, isActive && styles.activeChip]}
            onPress={() => onChangePeriod(opt.value)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, isActive && styles.activeChipText]}>
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
    gap: 6,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: withOpacity(COLORS.text, 0.1),
  },
  activeChip: {
    backgroundColor: withOpacity(COLORS.primary, 0.14),
    borderColor: COLORS.accent700,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.inactive,
  },
  activeChipText: {
    color: COLORS.accent300,
    fontWeight: "500",
  },
});
