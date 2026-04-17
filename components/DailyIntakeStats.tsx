import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { COLORS } from "../utils/Constants";
import { BarChart } from "react-native-gifted-charts";
import { UserIntakeSummary } from "../utils/types";

interface DailyIntakeStatsProps {
  intakeData: UserIntakeSummary[];
}

const DailyIntakeStats: React.FC<DailyIntakeStatsProps> = ({ intakeData }) => {
  // Sort data by date just in case
  const sortedData = [...intakeData].sort((a, b) => 
    new Date(a.loggedDate).getTime() - new Date(b.loggedDate).getTime()
  );

  // Map to BarChart format
  const barData = sortedData.map((item) => {
    // Format date like 'Mon 12'
    const dateObj = new Date(item.loggedDate);
    const label = `${dateObj.toLocaleDateString('en-US', { weekday: 'short' })} ${dateObj.getDate()}`;
    
    // Check if exceeded limit
    const exceeded = item.consumedCalories > item.calorieLimit;

    return {
      value: item.consumedCalories || 0,
      label,
      frontColor: exceeded ? "#ff4d4d" : COLORS.primary,
      topLabelComponent: () => (
        <Text style={{ fontSize: 10, color: COLORS.primary, marginBottom: 4 }}>
          {Math.round(item.consumedCalories)}
        </Text>
      ),
    };
  });

  if (barData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No intake data available.</Text>
      </View>
    );
  }

  // Get max limit to potentially show a limit line
  const referenceLine = sortedData.length > 0 ? sortedData[0].calorieLimit : 2000;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Caloric Intake (Last 7 Days)</Text>
      <BarChart
        data={barData}
        height={180}
        barWidth={28}
        spacing={24}
        roundedTop
        roundedBottom
        hideRules={true}
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{ color: COLORS.primary, fontSize: 10 }}
        noOfSections={4}
        maxValue={Math.max(
          referenceLine * 1.2, 
          ...barData.map(d => d.value)
        )}
        showReferenceLine1
        referenceLine1Position={referenceLine}
        referenceLine1Config={{
          color: 'rgba(255, 77, 77, 0.5)',
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
          <View style={[styles.legendLine, { backgroundColor: 'rgba(255, 77, 77, 0.5)' }]} />
          <Text style={styles.legendText}>Daily Goal ({referenceLine})</Text>
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
    fontSize: 18,
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
