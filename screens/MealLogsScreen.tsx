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
  ActivityIndicator,
} from "react-native";
import React, { useState, useMemo } from "react";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import { COLORS } from "../utils/Constants";
import MealLogContainer from "../components/MealLogContainer";
import { createMealLog, updateMealLog, deleteMealLog, getMealLogs } from "../utils/http";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const MealLogsScreen = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const { data: mealLogsData } = useQuery({
    queryKey: ['mealLogs'],
    queryFn: getMealLogs,
  });
  const mealLogs = mealLogsData?.mealLogs ?? mealLogsData ?? [];

  const [modalVisible, setModalVisible] = useState(false);
  const [editingMeal, setEditingMeal] = useState<any>(null);
  const [name, setName] = useState("BREAKFAST");
  const [time, setTime] = useState("");

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: "BREAKFAST",
        label: "Breakfast",
        value: "Breakfast",
        color: COLORS.primary,
        labelStyle: { color: COLORS.primary },
      },
      {
        id: "LUNCH",
        label: "Lunch",
        value: "Lunch",
        color: COLORS.primary,
        labelStyle: { color: COLORS.primary },
      },
      {
        id: "DINNER",
        label: "Dinner",
        value: "Dinner",
        color: COLORS.primary,
        labelStyle: { color: COLORS.primary },
      },
      {
        id: "SNACK",
        label: "Snacks",
        value: "Snacks",
        color: COLORS.primary,
        labelStyle: { color: COLORS.primary },
      },
    ],
    [],
  );
  const [calories, setCalories] = useState("");
  const [dish, setDish] = useState("");

  const handleEditPress = (meal: any) => {
    setEditingMeal(meal);
    setName(meal.mealType?.toUpperCase() || "BREAKFAST");
    setCalories(String(meal.calories || ""));
    setDish(meal.dish || "");
    setModalVisible(true);
  };

  const createMealMutation = useMutation({
    mutationFn: createMealLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSummary'] });
      queryClient.invalidateQueries({ queryKey: ['mealLogs'] });
      Toast.show({
        type: "success",
        text1: "Meal saved",
        position: "bottom",
      });
      handleCloseModal();
      navigation.goBack();
    },
    onError: (error) => {
      console.error("Failed to save meal:", error);
      Toast.show({
        type: "error",
        text1: "Save failed",
        text2: "Could not save your meal. Please try again.",
        position: "bottom",
      });
    }
  });

  const updateMealMutation = useMutation({
    mutationFn: updateMealLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSummary'] });
      queryClient.invalidateQueries({ queryKey: ['mealLogs'] });
      Toast.show({ type: "success", text1: "Meal updated", position: "bottom" });
      handleCloseModal();
    },
    onError: (error) => {
      console.error("Failed to update meal:", error);
      Toast.show({ type: "error", text1: "Update failed", text2: "Could not update your meal. Please try again.", position: "bottom" });
    }
  });

  const deleteMealMutation = useMutation({
    mutationFn: deleteMealLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSummary'] });
      queryClient.invalidateQueries({ queryKey: ['mealLogs'] });
      Toast.show({ type: "success", text1: "Meal deleted", position: "bottom" });
      handleCloseModal();
    },
    onError: (error) => {
      console.error("Failed to delete meal:", error);
      Toast.show({ type: "error", text1: "Delete failed", text2: "Could not delete your meal. Please try again.", position: "bottom" });
    }
  });

  const handleSave = () => {
    if (!name || !calories || !dish) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter both calories and the dish name.",
        position: "bottom",
      });
      return;
    }

    if (editingMeal) {
      updateMealMutation.mutate({
        id: editingMeal.id || editingMeal._id,
        name,
        time: editingMeal.mealTime || new Date().toISOString(),
        calories: parseInt(calories) || 0,
        dish,
      });
    } else {
      createMealMutation.mutate({
        name,
        time: new Date().toISOString(),
        calories: parseInt(calories) || 0,
        dish,
      });
    }
  };

  const handleDelete = () => {
    if (editingMeal) {
      deleteMealMutation.mutate(editingMeal.id || editingMeal._id);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingMeal(null);
    setName("BREAKFAST");
    setTime("");
    setCalories("");
    setDish("");
  };

  const isPending = createMealMutation.isPending || updateMealMutation.isPending || deleteMealMutation.isPending;

  return (
    <View style={styles.container}>
      <MealLogContainer meal={mealLogs} onPressItem={handleEditPress} />

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
              <Text style={styles.modalTitle}>{editingMeal ? "Edit Meal" : "Add New Meal"}</Text>

              <Text style={styles.label}>Meal Type</Text>
              <RadioGroup
                radioButtons={radioButtons}
                onPress={setName}
                selectedId={name}
                layout="row"
                containerStyle={styles.radioGroup}
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
                {editingMeal && (
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={handleDelete}
                    disabled={isPending}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCloseModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSave}
                  disabled={isPending}
                >
                  {isPending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>{editingMeal ? "Update" : "Save"}</Text>
                  )}
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
    backgroundColor: "rgba(0,0,0,0.0)",
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
  label: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  radioGroup: {
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginBottom: 15,
    width: "100%",
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
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    marginLeft: 5,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    marginRight: 5,
  },
  cancelButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
