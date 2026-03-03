import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { COLORS } from "../utils/Constants";
import MealLogItem from "./MealLogItem";

const MealLogContainer = ({ meal }) => {
  return (
    <View style={styles.mealLogContainer}>
      <FlatList
        data={meal}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MealLogItem meal={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MealLogContainer;

const styles = StyleSheet.create({
  mealLogContainer: {
    flex: 1,
  },
});
