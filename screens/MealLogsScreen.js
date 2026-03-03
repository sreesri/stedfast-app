import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "../utils/Constants";
import MealLogContainer from "../components/MealLogContainer";

const MealLogsScreen = () => {
  const [mealLogs, setMealLogs] = useState([
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
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [calories, setCalories] = useState("");
  const [dish, setDish] = useState("");

  const handleSave = () => {
    if (!name || !time || !calories || !dish) return;

    const newMeal = {
      id: Date.now(),
      name,
      time,
      calories: parseInt(calories) || 0,
      dish,
    };

    setMealLogs((prev) => [...prev, newMeal]);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setName("");
    setTime("");
    setCalories("");
    setDish("");
  };

  return (
    <View style={styles.container}>
      <MealLogContainer meal={mealLogs} />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContent}
            >
              <Text style={styles.modalTitle}>Add New Meal</Text>

              <TextInput
                style={styles.input}
                placeholder="Meal Name (e.g. Snack)"
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Time (e.g. 04:00 PM)"
                placeholderTextColor="#888"
                value={time}
                onChangeText={setTime}
              />
              <TextInput
                style={styles.input}
                placeholder="Calories"
                placeholderTextColor="#888"
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Dish (e.g. Apple)"
                placeholderTextColor="#888"
                value={dish}
                onChangeText={setDish}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default MealLogsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingTop: 10,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: COLORS.background,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.ascent,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: COLORS.primary,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
