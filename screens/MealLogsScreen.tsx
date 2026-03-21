import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "../utils/Constants";
import MealLogContainer from "../components/MealLogContainer";
import MealEditModal from "../components/MealEditModal";
import { useMealLogs } from "../hooks/useMealLogs";
import SafeScreen from "../components/SafeScreen";

const MealLogsScreen = () => {
  const {
    mealLogs,
    modalVisible,
    editingMeal,
    openModal,
    closeModal,
    handleSave,
    handleDelete,
    isPending,
  } = useMealLogs();

  return (
    <SafeScreen style={styles.container}>
      <Text style={styles.title}>Meal Logs</Text>
      <MealLogContainer meal={mealLogs} onPressItem={openModal} />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => openModal()}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <MealEditModal
        visible={modalVisible}
        editingMeal={editingMeal}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={handleDelete}
        isPending={isPending}
      />
    </SafeScreen>
  );
};

export default MealLogsScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
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
