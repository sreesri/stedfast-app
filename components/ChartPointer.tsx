import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../utils/Constants";

const ChartPointer = ({ label }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default ChartPointer;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
  },
  label: {
    fontSize: 11,
    color: COLORS.text,
    fontVariant: ["tabular-nums"],
  },
});
