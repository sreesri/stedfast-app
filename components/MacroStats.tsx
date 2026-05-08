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
        label: `${d.toLocaleDateString("en-US", { weekday: "short" })} ${d.getDate()}`,
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
        const avgProteinLimit = items.reduce((s, i) => s + i.proteinLimit, 0) / items.length;
        const avgCarbsLimit = items.reduce((s, i) => s + i.carbsLimit, 0) / items.length;
        const avgFatLimit = items.reduce((s, i) => s + i.fatLimit, 0) / items.length;
        return {
          label: `${d.getMonth() + 1}/${d.getDate()}`,
          protein: items.reduce((s, i) => s + i.consumedProtein, 0),
          carbs: items.reduce((s, i) => s + i.consumedCarbs, 0),
          fat: items.reduce((s, i) => s + i.consumedFat, 0),
          proteinLimit: Math.round(avgProteinLimit * 7),
          carbsLimit: Math.round(avgCarbsLimit * 7),
          fatLimit: Math.round(avgFatLimit * 7),
        };
      });
  }

  // Monthly
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
      const avgProteinLimit = items.reduce((s, i) => s + i.proteinLimit, 0) / items.length;
      const avgCarbsLimit = items.reduce((s, i) => s + i.carbsLimit, 0) / items.length;
      const avgFatLimit = items.reduce((s, i) => s + i.fatLimit, 0) / items.length;
      return {
        label,
        protein: items.reduce((s, i) => s + i.consumedProtein, 0),
        carbs: items.reduce((s, i) => s + i.consumedCarbs, 0),
        fat: items.reduce((s, i) => s + i.consumedFat, 0),
        proteinLimit: Math.round(avgProteinLimit * items.length),
        carbsLimit: Math.round(avgCarbsLimit * items.length),
        fatLimit: Math.round(avgFatLimit * items.length),
      };
    });
}

interface MacroChartProps {
  title: string;
  barColor: string;
  data: { label: string; value: number; limit: number }[];
  pointCount: number;
}

const MacroChart: React.FC<MacroChartProps> = ({ title, barColor, data, pointCount }) => {
  const refLine = data.length > 0 ? data[data.length - 1].limit : 0;
  const barWidth = pointCount <= 7 ? 26 : pointCount <= 8 ? 20 : 28;
  const spacing = pointCount <= 7 ? 22 : pointCount <= 8 ? 14 : 22;

  const barData = data.map((item) => ({
    value: item.value || 0,
    label: item.label,
    frontColor: item.value > item.limit ? "#ff4d4d" : barColor,
  }));

  return (
    <View style={macroStyles.macroSection}>
      <Text style={macroStyles.macroTitle}>{title}</Text>
      <BarChart
        data={barData}
        height={110}
        barWidth={barWidth}
        spacing={spacing}
        roundedTop
        roundedBottom
        hideRules={true}
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{ color: COLORS.primary, fontSize: 9 }}
        noOfSections={3}
        maxValue={Math.max((refLine || 1) * 1.2, ...barData.map((d) => d.value), 1)}
        showReferenceLine1={refLine > 0}
        referenceLine1Position={refLine}
        referenceLine1Config={{
          color: "rgba(255, 77, 77, 0.5)",
          dashWidth: 4,
          dashGap: 4,
        }}
      />
    </View>
  );
};

const macroStyles = StyleSheet.create({
  macroSection: {
    marginBottom: 16,
  },
  macroTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 8,
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

  const proteinData = aggregated.map((i) => ({ label: i.label, value: i.protein, limit: i.proteinLimit }));
  const carbsData = aggregated.map((i) => ({ label: i.label, value: i.carbs, limit: i.carbsLimit }));
  const fatData = aggregated.map((i) => ({ label: i.label, value: i.fat, limit: i.fatLimit }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Macronutrient Trends</Text>
      <MacroChart title="Protein (g)" barColor="#5B8DB8" data={proteinData} pointCount={aggregated.length} />
      <MacroChart title="Carbs (g)" barColor={COLORS.secondary} data={carbsData} pointCount={aggregated.length} />
      <MacroChart title="Fat (g)" barColor="#E0913A" data={fatData} pointCount={aggregated.length} />
    </View>
  );
};

export default MacroStats;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.ascent,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    width: "100%",
  },
  emptyContainer: {
    backgroundColor: COLORS.ascent,
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: "center",
  },
});
