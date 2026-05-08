import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS, SCREEN } from "../utils/Constants";
import MacroTracker from "./MacroTracker";
import { useNavigation } from "@react-navigation/native";

const DailySummary = ({ macros }: any) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.9}
      onPress={() => navigation.navigate(SCREEN.meallogs)}
    >
      <View style={styles.header}>
        <Text style={styles.titleText}>Daily Overview</Text>
        <Text style={styles.tapText}>Tap for details</Text>
      </View>

      <View style={styles.macroGrid}>
        <MacroTracker
          label="Calories"
          consumed={macros.calories.consumed}
          limit={macros.calories.limit}
          unit="kcal"
          color={COLORS.secondary}
        />
        <MacroTracker
          label="Protein"
          consumed={macros.protein.consumed}
          limit={macros.protein.limit}
          unit="g"
          color={COLORS.secondary}
        />
        <MacroTracker
          label="Carbs"
          consumed={macros.carbs.consumed}
          limit={macros.carbs.limit}
          unit="g"
          color={COLORS.secondary}
        />
        <MacroTracker
          label="Fat"
          consumed={macros.fat.consumed}
          limit={macros.fat.limit}
          unit="g"
          color={COLORS.secondary}
        />
      </View>
    </TouchableOpacity>
  );
};

export default DailySummary;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.ascent,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  tapText: {
    fontSize: 12,
    color: COLORS.primary,
    opacity: 0.5,
  },
  macroGrid: {
    marginTop: 5,
    paddingTop: 5,
  },
});
