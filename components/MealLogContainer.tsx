import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../utils/Constants";
import MealLogItem from "./MealLogItem";

const MealLogContainer = ({ meal, onPressItem }) => {
  return (
    <View style={styles.mealLogContainer}>
      {meal && meal.length > 0 ? (
        meal.map((item, index) => (
          <MealLogItem
            key={item?.id ?? item?._id ?? index}
            meal={item}
            onPress={onPressItem}
          />
        ))
      ) : (
        <Text style={styles.noMealText}>No meals logged for today</Text>
      )}
    </View>
  );
};

export default MealLogContainer;

const styles = StyleSheet.create({
  mealLogContainer: {
    paddingBottom: 20,
  },
  noMealText: {
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
    opacity: 0.7,
  },
});
