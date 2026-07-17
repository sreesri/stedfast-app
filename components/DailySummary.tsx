import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, SCREEN } from "../utils/Constants";
import Svg, { Circle } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";

const RING_RADIUS = 18;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

interface MacroEntry {
  consumed: number;
  limit: number;
}

interface DailySummaryProps {
  macros: {
    calories: MacroEntry;
    protein: MacroEntry;
    carbs: MacroEntry;
    fat: MacroEntry;
  };
}

interface TileProps {
  label: string;
  consumed: number;
  limit: number;
  unit: string;
}

const MacroRingTile: React.FC<TileProps> = ({ label, consumed, limit, unit }) => {
  const pct = Math.round(Math.min((consumed / limit) * 100, 100));
  const offset = RING_CIRCUMFERENCE * (1 - Math.min(consumed / limit, 1));
  const valueStr =
    unit === "kcal" ? `${Math.round(consumed)} kcal` : `${Math.round(consumed)}g`;

  return (
    <View style={styles.tile}>
      <View style={styles.ringContainer}>
        <Svg width={44} height={44} viewBox="0 0 44 44">
          <Circle
            cx={22}
            cy={22}
            r={RING_RADIUS}
            stroke={COLORS.track}
            strokeWidth={4}
            fill="none"
          />
          <Circle
            cx={22}
            cy={22}
            r={RING_RADIUS}
            stroke={COLORS.primary}
            strokeWidth={4}
            fill="none"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 22 22)"
          />
        </Svg>
        <Text style={styles.ringPct}>{pct}%</Text>
      </View>
      <View style={styles.tileLabels}>
        <Text style={styles.tileLabel}>{label}</Text>
        <Text style={styles.tileValue}>{valueStr}</Text>
      </View>
    </View>
  );
};

const DailySummary: React.FC<DailySummaryProps> = ({ macros }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={styles.grid}
      activeOpacity={0.9}
      onPress={() => navigation.navigate(SCREEN.meallogs)}
    >
      <MacroRingTile
        label="Calories"
        consumed={macros.calories.consumed}
        limit={macros.calories.limit}
        unit="kcal"
      />
      <MacroRingTile
        label="Protein"
        consumed={macros.protein.consumed}
        limit={macros.protein.limit}
        unit="g"
      />
      <MacroRingTile
        label="Carbs"
        consumed={macros.carbs.consumed}
        limit={macros.carbs.limit}
        unit="g"
      />
      <MacroRingTile
        label="Fat"
        consumed={macros.fat.consumed}
        limit={macros.fat.limit}
        unit="g"
      />
    </TouchableOpacity>
  );
};

export default DailySummary;

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 30,
  },
  tile: {
    flexBasis: "48%",
    flexGrow: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ringContainer: {
    width: 44,
    height: 44,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  ringPct: {
    position: "absolute",
    fontSize: 10,
    color: "rgba(233,233,237,0.7)",
    fontVariant: ["tabular-nums"],
  },
  tileLabels: {
    flex: 1,
    minWidth: 0,
  },
  tileLabel: {
    fontSize: 12,
    color: "rgba(233,233,237,0.55)",
  },
  tileValue: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.text,
    marginTop: 1,
    fontVariant: ["tabular-nums"],
  },
});
