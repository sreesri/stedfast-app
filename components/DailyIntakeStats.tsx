import React, { useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import { COLORS } from "../utils/Constants";
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
      const d = new Date(item.loggedDate + "T00:00:00");
      return {
        label: `${d.toLocaleDateString("en-US", { weekday: "short" })} ${d.getDate()}`,
        consumedCalories: item.consumedCalories,
        calorieLimit: item.calorieLimit,
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
        const avgLimit = items.reduce((s, i) => s + i.calorieLimit, 0) / items.length;
        return {
          label: `${d.getMonth() + 1}/${d.getDate()}`,
          consumedCalories: items.reduce((s, i) => s + i.consumedCalories, 0),
          calorieLimit: Math.round(avgLimit * 7),
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
      const avgLimit = items.reduce((s, i) => s + i.calorieLimit, 0) / items.length;
      return {
        label,
        consumedCalories: items.reduce((s, i) => s + i.consumedCalories, 0),
        calorieLimit: Math.round(avgLimit * items.length),
      };
    });
}

const PERIOD_TITLES: Record<Period, string> = {
  daily: "Caloric Intake — Last 7 Days",
  weekly: "Caloric Intake — Last 8 Weeks",
  monthly: "Caloric Intake — Last 6 Months",
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
      frontColor: exceeded ? "#ff4d4d" : COLORS.primary,
      topLabelComponent: () => (
        <Text style={{ fontSize: 9, color: COLORS.primary, marginBottom: 2 }}>
          {Math.round(item.consumedCalories)}
        </Text>
      ),
    };
  });

  const pointCount = barData.length;
  const barWidth = pointCount <= 7 ? 28 : pointCount <= 8 ? 22 : 30;
  const spacing = pointCount <= 7 ? 24 : pointCount <= 8 ? 16 : 24;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{PERIOD_TITLES[period]}</Text>
      <BarChart
        data={barData}
        height={180}
        barWidth={barWidth}
        spacing={spacing}
        roundedTop
        roundedBottom
        hideRules={true}
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{ color: COLORS.primary, fontSize: 10 }}
        noOfSections={4}
        maxValue={Math.max(referenceLine * 1.2, ...barData.map((d) => d.value))}
        showReferenceLine1
        referenceLine1Position={referenceLine}
        referenceLine1Config={{
          color: "rgba(255, 77, 77, 0.5)",
          dashWidth: 4,
          dashGap: 4,
        }}
      />
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
          <Text style={styles.legendText}>Under Limit</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#ff4d4d" }]} />
          <Text style={styles.legendText}>Over Limit</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: "rgba(255, 77, 77, 0.5)" }]} />
          <Text style={styles.legendText}>Goal ({referenceLine})</Text>
        </View>
      </View>
    </View>
  );
};

export default DailyIntakeStats;

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
    marginBottom: 20,
    textAlign: "center",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 20,
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendLine: {
    width: 16,
    height: 3,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
