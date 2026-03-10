import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../utils/Constants";
import CalorieTracker from "./CalorieTracker";
import Divider from "./Divider";
import MealLogContainer from "./MealLogContainer";

const DailySummary = ({ consumed, maxLimit, mealLog }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>DailySummary</Text>
      <CalorieTracker consumedCalories={consumed} maxCalories={maxLimit} />
      <Divider />
      <MealLogContainer meal={mealLog} />
    </View>
  );
};

export default DailySummary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 57,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary, // Using COLORS constant
  },
});
