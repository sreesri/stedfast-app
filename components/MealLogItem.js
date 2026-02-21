import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../utils/Constants";

const MealLogItem = ({ meal }) => {
  return (
    <View style={styles.contianer}>
      <View style={styles.mealLogItem}>
        <View style={styles.mealLogItemHeader}>
          <Text style={styles.mealLogItemTitle}>{meal.name}</Text>
        </View>
        <View style={styles.mealLogItemBody}>
          <Text style={styles.mealLogItemTime}>{meal.time}</Text>
          <Text style={styles.mealLogItemDish}>{meal.dish}</Text>
        </View>
      </View>
      <View style={styles.calorieContainer}>
        <Text style={styles.mealLogItemCalories}>{meal.calories}</Text>
      </View>
    </View>
  );
};

export default MealLogItem;

const styles = StyleSheet.create({
  contianer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.ascent,
    borderRadius: 15,
    marginBottom: 5,
    width: "100%",
  },
  mealLogItem: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    flex: 0.8,
  },
  mealLogItemHeader: {
    alignItems: "flex-start",
    width: "100%",
  },
  mealLogItemBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  mealLogItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    color: COLORS.primary,
  },
  mealLogItemTime: {
    fontSize: 10,
    color: COLORS.primary,
    marginLeft: 5,
  },
  mealLogItemCalories: {
    fontSize: 14,
    color: COLORS.primary,
  },
  mealLogItemDish: {
    fontSize: 14,
    color: COLORS.primary,
    flex: 1,
    textAlign: "center",
  },
  calorieContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    flex: 0.2,
  },
});
