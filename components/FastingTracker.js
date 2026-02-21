import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../utils/Constants";

const FastingTracker = () => {
  return (
    <View style={styles.container}>
      <Text>FastingTracker</Text>
    </View>
  );
};

export default FastingTracker;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 500,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
  },
});
