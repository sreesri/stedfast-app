import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../utils/Constants";
import CalorieTracker from "./CalorieTracker";
import Divider from "./Divider";
import MealLogContainer from "./MealLogContainer";

const DailySummary = ({ consumed, maxLimit, mealLog }) => {
  // Hardcoded test variables in the parent meant to simulate API data eventually

  const mealLogs = [
    {
      id: 1,
      name: "Breakfast",
      time: "09:30 AM",
      calories: 500,
      dish: "Idli, Sambar, Chutney",
    },
    {
      id: 2,
      name: "Lunch",
      time: "01:00 PM",
      calories: 500,
      dish: "Idli, Sambar, Chutney",
    },
    {
      id: 3,
      name: "Dinner",
      time: "06:00 PM",
      calories: 500,
      dish: "Idli, Sambar, Chutney",
    },
    {
      id: 4,
      name: "Breakfast",
      time: "09:30 AM",
      calories: 500,
      dish: "Idli, Sambar, Chutney",
    },
    {
      id: 5,
      name: "Lunch",
      time: "01:00 PM",
      calories: 500,
      dish: "Idli, Sambar, Chutney",
    },
    {
      id: 6,
      name: "Dinner",
      time: "06:00 PM",
      calories: 500,
      dish: "Idli, Sambar, Chutney",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>DailySummary</Text>
      <CalorieTracker consumedCalories={consumed} maxCalories={maxLimit} />
      <Divider />
      <MealLogContainer meal={mealLogs} />
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
