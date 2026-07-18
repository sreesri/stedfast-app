import React, { useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import { COLORS, withOpacity } from "../utils/Constants";
import { BarChart } from "react-native-gifted-charts";
import { UserIntakeSummary } from "../utils/types";
import { Period } from "./PeriodToggle";

interface DailyIntakeStatsProps {
  intakeData: UserIntakeSummary[];
  period: Period;
}

interface AggregatedBar {
  label: string;
  consumedCalories: number;
  calorieLimit: number;
}

function aggregateIntake(data: UserIntakeSummary[], period: Period): AggregatedBar[] {
  const sorted = [...data].sort((a, b) => a.loggedDate.localeCompare(b.loggedDate));

  if (period === "daily") {
    return sorted.map((item) => {
      const d = new Date(item.loggedDate.split("T")[0] + "T00:00:00");
      return {
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        consumedCalories: item.consumedCalories,
        calorieLimit: item.calorieLimit,
      };
    });
  }

  if (period === "weekly") {
    const buckets = new Map<string, UserIntakeSummary[]>();
    sorted.forEach((item) => {
      const d = new Date(item.loggedDate.split("T")[0] + "T00:00:00");
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
        const avgLimit = items.reduce((s, i) => s + i.calorieLimit, 0) / items.length;
        return {
          label: `${d.getMonth() + 1}/${d.getDate()}`,
          consumedCalories: items.reduce((s, i) => s + i.consumedCalories, 0),
          calorieLimit: Math.round(avgLimit * 7),
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
      const avgLimit = items.reduce((s, i) => s + i.calorieLimit, 0) / items.length;
      return {
        label,
        consumedCalories: items.reduce((s, i) => s + i.consumedCalories, 0),
        calorieLimit: Math.round(avgLimit * items.length),
      };
    });
}

const PERIOD_TITLES: Record<Period, string> = {
  daily: "Calories — Last 7 Days",
  weekly: "Calories — Last 8 Weeks",
  monthly: "Calories — Last 6 Months",
};

const DailyIntakeStats: React.FC<DailyIntakeStatsProps> = ({ intakeData, period }) => {
  const aggregated = useMemo(
    () => aggregateIntake(intakeData, period),
    [intakeData, period]
  );

  if (aggregated.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No intake data available.</Text>
      </View>
    );
  }

  const referenceLine = aggregated[aggregated.length - 1].calorieLimit;

  const barData = aggregated.map((item) => {
    const exceeded = item.consumedCalories > item.calorieLimit;
    return {
      value: item.consumedCalories || 0,
      label: item.label,
      frontColor: exceeded ? COLORS.accent300 : COLORS.primary,
      topLabelComponent: () => (
        <Text style={{ fontSize: 9, color: withOpacity(COLORS.text, 0.5), marginBottom: 2 }}>
          {Math.round(item.consumedCalories)}
        </Text>
      ),
    };
  });

  const pointCount = barData.length;
  const barWidth = pointCount <= 7 ? 26 : pointCount <= 8 ? 20 : 28;
  const spacing = pointCount <= 7 ? 22 : pointCount <= 8 ? 14 : 22;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.kicker}>{PERIOD_TITLES[period].toUpperCase()}</Text>
        <Text style={styles.goalText}>goal {referenceLine.toLocaleString()}</Text>
      </View>
      <BarChart
        data={barData}
        height={150}
        barWidth={barWidth}
        spacing={spacing}
        roundedTop
        hideRules
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{ color: withOpacity(COLORS.text, 0.45), fontSize: 9 }}
        noOfSections={3}
        maxValue={Math.max(referenceLine * 1.2, ...barData.map((d) => d.value))}
        showReferenceLine1
        referenceLine1Position={referenceLine}
        referenceLine1Config={{
          color: COLORS.inactive,
          dashWidth: 4,
          dashGap: 4,
          thickness: 1,
        }}
        backgroundColor="transparent"
      />
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: COLORS.primary }]} />
          <Text style={styles.legendText}>under goal</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSwatch, { backgroundColor: COLORS.accent300 }]} />
          <Text style={styles.legendText}>over goal</Text>
        </View>
      </View>
    </View>
  );
};

export default DailyIntakeStats;

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
    color: withOpacity(COLORS.text, 0.45),
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 14,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 1,
    color: COLORS.accent300,
  },
  goalText: {
    fontSize: 12,
    color: withOpacity(COLORS.text, 0.45),
    fontVariant: ["tabular-nums"],
  },
  legend: {
    flexDirection: "row",
    gap: 14,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendSwatch: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 11,
    color: withOpacity(COLORS.text, 0.5),
  },
});
