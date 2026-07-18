import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { COLORS, withOpacity } from "../utils/Constants";
import { LineChart } from "react-native-gifted-charts";
import ChartPointer from "./ChartPointer";
import { BodyStat } from "../utils/types";

type Period = "daily" | "weekly" | "monthly";

interface WeightLogStatsProps {
  healthStats: BodyStat[];
  period: Period;
}

function getStartDate(period: Period): string {
  const today = new Date();
  const start = new Date(today);
  if (period === "daily") start.setDate(today.getDate() - 6);
  if (period === "weekly") start.setDate(today.getDate() - 55);
  if (period === "monthly") start.setDate(today.getDate() - 179);
  return start.toISOString().split("T")[0];
}

const WeightLogStats: React.FC<WeightLogStatsProps> = ({ healthStats, period }) => {
  const chartPoints = useMemo(() => {
    const startStr = getStartDate(period);
    const filtered = healthStats
      .filter((s) => s.loggedDate >= startStr)
      .sort((a, b) => a.loggedDate.localeCompare(b.loggedDate));

    if (period === "daily") {
      return filtered.map((s) => {
        const d = new Date(s.loggedDate + "T00:00:00");
        return {
          value: s.weightKg,
          label: d.toLocaleDateString("en-US", { weekday: "short" }),
        };
      });
    }

    if (period === "weekly") {
      const buckets = new Map<string, number[]>();
      filtered.forEach((s) => {
        const d = new Date(s.loggedDate + "T00:00:00");
        const dow = (d.getDay() + 6) % 7;
        const mon = new Date(d);
        mon.setDate(d.getDate() - dow);
        const key = mon.toISOString().split("T")[0];
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key)!.push(s.weightKg);
      });
      return Array.from(buckets.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-8)
        .map(([key, vals]) => {
          const d = new Date(key + "T00:00:00");
          return {
            value: parseFloat((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1)),
            label: `${d.getMonth() + 1}/${d.getDate()}`,
          };
        });
    }

    const buckets = new Map<string, number[]>();
    filtered.forEach((s) => {
      const key = s.loggedDate.substring(0, 7);
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key)!.push(s.weightKg);
    });
    return Array.from(buckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, vals]) => {
        const d = new Date(key + "-01T00:00:00");
        const label =
          d.toLocaleDateString("en-US", { month: "short" }) +
          " " +
          String(d.getFullYear()).slice(2);
        return {
          value: parseFloat((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1)),
          label,
        };
      });
  }, [healthStats, period]);

  function renderPointer(items: any[]) {
    return <ChartPointer label={items[0].value} />;
  }

  if (chartPoints.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No weight data for this period.</Text>
      </View>
    );
  }

  const minVal = Math.min(...chartPoints.map((p) => p.value));
  const yAxisOffset = Math.max(0, Math.floor(minVal) - 2);

  return (
    <View style={styles.container}>
      <LineChart
        areaChart
        height={110}
        focusEnabled
        showStripOnFocus
        showDataPointOnFocus
        color={COLORS.primary}
        startFillColor={COLORS.primary}
        endFillColor={COLORS.primary}
        startOpacity={0.35}
        endOpacity={0}
        yAxisOffset={yAxisOffset}
        yAxisLabelWidth={40}
        hideRules
        stepValue={0.5}
        noOfSections={3}
        pointerConfig={{ pointerLabelComponent: renderPointer }}
        data={chartPoints}
        xAxisLabelTextStyle={{ color: withOpacity(COLORS.text, 0.45), fontSize: 9 }}
        yAxisTextStyle={{ color: withOpacity(COLORS.text, 0.45), fontSize: 9 }}
        backgroundColor="transparent"
        dataPointsColor={COLORS.accent300}
        dataPointsRadius={4}
        xAxisThickness={0}
        yAxisThickness={0}
      />
    </View>
  );
};

export default WeightLogStats;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 130,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    width: "100%",
    minHeight: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: withOpacity(COLORS.text, 0.45),
    fontSize: 14,
  },
});
