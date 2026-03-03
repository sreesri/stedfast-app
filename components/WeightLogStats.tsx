import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../utils/Constants";
import { LineChart } from "react-native-gifted-charts";
import ChartPointer from "./ChartPointer";

const WeightLogStats = ({ weightData }) => {
  function renderPointer(items) {
    return <ChartPointer label={items[0].value} />;
  }

  return (
    <View style={styles.container}>
      <LineChart
        areaChart
        height={150}
        focusEnabled
        showStripOnFocus
        showDataPointOnFocus
        color={COLORS.primary}
        startFillColor={COLORS.primary}
        endFillColor={COLORS.primary}
        startOpacity={1}
        endOpacity={0.3}
        yAxisOffset={120}
        yAxisLabelWidth={50}
        hideRules={true}
        stepValue={0.5}
        noOfSections={3}
        pointerConfig={{ pointerLabelComponent: renderPointer }}
        data={weightData.map((item) => {
          return {
            value: item,
            label: item,
          };
        })}
      />
    </View>
  );
};

export default WeightLogStats;

const styles = StyleSheet.create({
  container: {
    width: "80%",
    height: 200,
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
