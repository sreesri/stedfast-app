import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { COLORS, SCREEN } from "../utils/Constants";
import MealLogContainer from "../components/MealLogContainer";
import { useMealLogs } from "../hooks/useMealLogs";
import SafeScreen from "../components/SafeScreen";
import { useNavigation } from "@react-navigation/native";
import { MealLog } from "../utils/types";

const MealLogsScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const { mealLogs } = useMealLogs(selectedDate);

  const changeDate = (days: number) => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + days);
      return d.toISOString().split("T")[0];
    });
  };

  const handleEditMeal = (meal?: MealLog) => {
    navigation.navigate(SCREEN.mealedit, { editingMeal: meal });
  };

  return (
    <SafeScreen style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeDate(-1)} style={styles.dateBtn}>
          <Text style={styles.dateBtnText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {new Date(selectedDate).toLocaleDateString([], {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </Text>
        <TouchableOpacity onPress={() => changeDate(1)} style={styles.dateBtn}>
          <Text style={styles.dateBtnText}>{">"}</Text>
        </TouchableOpacity>
      </View>
      <MealLogContainer meal={mealLogs} onPressItem={handleEditMeal} />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => handleEditMeal()}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeScreen>
  );
};

export default MealLogsScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  dateBtn: {
    padding: 10,
    backgroundColor: COLORS.ascent,
    borderRadius: 8,
  },
  dateBtnText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabIcon: {
    fontSize: 32,
    color: "#fff",
    marginTop: -2,
  },
});
