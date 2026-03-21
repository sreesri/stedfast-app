import React, { useState, useEffect, useMemo } from "react";
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
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import { COLORS } from "../utils/Constants";
import { MealLog } from "../utils/types";

interface MealEditModalProps {
  visible: boolean;
  editingMeal: MealLog | null;
  onClose: () => void;
  onSave: (data: { name: string; calories: string; dish: string }) => void;
  onDelete: () => void;
  isPending: boolean;
}

const MealEditModal: React.FC<MealEditModalProps> = ({
  visible,
  editingMeal,
  onClose,
  onSave,
  onDelete,
  isPending,
}) => {
  const [name, setName] = useState("BREAKFAST");
  const [calories, setCalories] = useState("");
  const [dish, setDish] = useState("");

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

  useEffect(() => {
    if (visible && editingMeal) {
      setName(editingMeal.mealType?.toUpperCase() || "BREAKFAST");
      setCalories(String(editingMeal.calories || ""));
      setDish(editingMeal.dish || "");
    } else {
      setName("BREAKFAST");
      setCalories("");
      setDish("");
    }
  }, [visible, editingMeal]);

  const handleSave = () => {
    onSave({ name, calories, dish });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContent}
          >
            <Text style={styles.modalTitle}>
              {editingMeal ? "Edit Meal" : "Add New Meal"}
            </Text>

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
                  onPress={onDelete}
                  disabled={isPending}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
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
                  <Text style={styles.saveButtonText}>
                    {editingMeal ? "Update" : "Save"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default MealEditModal;

const styles = StyleSheet.create({
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
