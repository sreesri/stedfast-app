import React, { useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import { COLORS } from "../utils/Constants";
import { BarChart } from "react-native-gifted-charts";
import { UserIntakeSummary } from "../utils/types";
import { Period } from "./PeriodToggle";

interface MacroStatsProps {
  intakeData: UserIntakeSummary[];
  period: Period;
}

interface AggregatedMacroBar {
  label: string;
  protein: number;
  carbs: number;
  fat: number;
  proteinLimit: number;
  carbsLimit: number;
  fatLimit: number;
}

function aggregateMacros(data: UserIntakeSummary[], period: Period): AggregatedMacroBar[] {
  const sorted = [...data].sort((a, b) => a.loggedDate.localeCompare(b.loggedDate));

  if (period === "daily") {
    return sorted.map((item) => {
      const d = new Date(item.loggedDate + "T00:00:00");
      return {
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        protein: item.consumedProtein,
        carbs: item.consumedCarbs,
        fat: item.consumedFat,
        proteinLimit: item.proteinLimit,
        carbsLimit: item.carbsLimit,
        fatLimit: item.fatLimit,
      };
    });
  }

  if (period === "weekly") {
    const buckets = new Map<string, UserIntakeSummary[]>();
    sorted.forEach((item) => {
      const d = new Date(item.loggedDate + "T00:00:00");
      const dow = (d.getDay() + 6) % 7;
      const mon = new Date(d);
      mon.setDate(d.getDate() - dow);
      const key = mon.toISOString().split("T")[0];
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key)!.push(item);
    });
    return Array.from(buckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8)
      .map(([key, items]) => {
        const d = new Date(key + "T00:00:00");
        return {
          label: `${d.getMonth() + 1}/${d.getDate()}`,
          protein: items.reduce((s, i) => s + i.consumedProtein, 0),
          carbs: items.reduce((s, i) => s + i.consumedCarbs, 0),
          fat: items.reduce((s, i) => s + i.consumedFat, 0),
          proteinLimit: Math.round(items.reduce((s, i) => s + i.proteinLimit, 0) / items.length * 7),
          carbsLimit: Math.round(items.reduce((s, i) => s + i.carbsLimit, 0) / items.length * 7),
          fatLimit: Math.round(items.reduce((s, i) => s + i.fatLimit, 0) / items.length * 7),
        };
      });
  }

  const buckets = new Map<string, UserIntakeSummary[]>();
  sorted.forEach((item) => {
    const key = item.loggedDate.substring(0, 7);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(item);
  });
  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, items]) => {
      const d = new Date(key + "-01T00:00:00");
      const label =
        d.toLocaleDateString("en-US", { month: "short" }) +
        " " +
        String(d.getFullYear()).slice(2);
      return {
        label,
        protein: items.reduce((s, i) => s + i.consumedProtein, 0),
        carbs: items.reduce((s, i) => s + i.consumedCarbs, 0),
        fat: items.reduce((s, i) => s + i.consumedFat, 0),
        proteinLimit: Math.round(items.reduce((s, i) => s + i.proteinLimit, 0) / items.length * items.length),
        carbsLimit: Math.round(items.reduce((s, i) => s + i.carbsLimit, 0) / items.length * items.length),
        fatLimit: Math.round(items.reduce((s, i) => s + i.fatLimit, 0) / items.length * items.length),
      };
    });
}

interface MacroChartProps {
  title: string;
  lastValue: string;
  data: { label: string; value: number; limit: number }[];
  pointCount: number;
}

const MacroChart: React.FC<MacroChartProps> = ({ title, lastValue, data, pointCount }) => {
  const refLine = data.length > 0 ? data[data.length - 1].limit : 0;
  const barWidth = pointCount <= 7 ? 18 : pointCount <= 8 ? 14 : 20;
  const spacing = pointCount <= 7 ? 18 : pointCount <= 8 ? 12 : 18;

  const barData = data.map((item) => ({
    value: item.value || 0,
    label: item.label,
    frontColor: item.value > item.limit ? COLORS.accent300 : "#796cbf",
  }));

  return (
    <View style={macroStyles.section}>
      <View style={macroStyles.header}>
        <View>
          <Text style={macroStyles.title}>{title}</Text>
          <Text style={macroStyles.last}>{lastValue}</Text>
        </View>
      </View>
      <BarChart
        data={barData}
        height={56}
        barWidth={barWidth}
        spacing={spacing}
        hideRules
        xAxisThickness={0}
        yAxisThickness={0}
        hideYAxisText
        noOfSections={2}
        maxValue={Math.max((refLine || 1) * 1.2, ...barData.map((d) => d.value), 1)}
        backgroundColor="transparent"
      />
    </View>
  );
};

const macroStyles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 6,
  },
  title: {
    fontSize: 13.5,
    fontWeight: "500",
    color: COLORS.text,
  },
  last: {
    fontSize: 11,
    color: "rgba(233,233,237,0.45)",
    marginTop: 2,
    fontVariant: ["tabular-nums"],
  },
});

const MacroStats: React.FC<MacroStatsProps> = ({ intakeData, period }) => {
  const aggregated = useMemo(
    () => aggregateMacros(intakeData, period),
    [intakeData, period]
  );

  if (aggregated.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No macro data available.</Text>
      </View>
    );
  }

  const last = aggregated[aggregated.length - 1];
  const proteinData = aggregated.map((i) => ({ label: i.label, value: i.protein, limit: i.proteinLimit }));
  const carbsData = aggregated.map((i) => ({ label: i.label, value: i.carbs, limit: i.carbsLimit }));
  const fatData = aggregated.map((i) => ({ label: i.label, value: i.fat, limit: i.fatLimit }));

  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>MACROS</Text>
      <MacroChart
        title="Protein"
        lastValue={`${Math.round(last.protein)} g · goal ${last.proteinLimit}`}
        data={proteinData}
        pointCount={aggregated.length}
      />
      <MacroChart
        title="Carbs"
        lastValue={`${Math.round(last.carbs)} g · goal ${last.carbsLimit}`}
        data={carbsData}
        pointCount={aggregated.length}
      />
      <MacroChart
        title="Fat"
        lastValue={`${Math.round(last.fat)} g · goal ${last.fatLimit}`}
        data={fatData}
        pointCount={aggregated.length}
      />
    </View>
  );
};

export default MacroStats;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  emptyContainer: {
    padding: 30,
    marginBottom: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "rgba(233,233,237,0.45)",
    fontSize: 14,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1,
    color: COLORS.accent300,
    marginBottom: 14,
  },
});
