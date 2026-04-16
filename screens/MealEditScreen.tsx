import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import { COLORS } from "../utils/Constants";
import { MealLog } from "../utils/types";
import SafeScreen from "../components/SafeScreen";
import { useMealLogs } from "../hooks/useMealLogs";

const MealEditScreen = ({ route, navigation }: any) => {
  const editingMeal = route.params?.editingMeal as MealLog | null;
  const { handleSave, handleDelete, isPending } = useMealLogs();

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
    if (editingMeal) {
      setName(editingMeal.mealType?.toUpperCase() || "BREAKFAST");
      setCalories(String(editingMeal.calories || ""));
      setDish(editingMeal.dish || "");
    }
  }, [editingMeal]);

  const onSave = () => {
    handleSave({ name, calories, dish }, editingMeal);
  };

  return (
    <SafeScreen style={styles.container} scrollable={true}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {editingMeal ? "Edit Meal" : "Add New Meal"}
        </Text>
        <View style={{ width: 50 }} />
      </View>

      <Text style={styles.label}>Meal Type</Text>
      <RadioGroup
        radioButtons={radioButtons}
        onPress={setName}
        selectedId={name}
        layout="row"
        containerStyle={styles.radioGroup}
      />

      <Text style={styles.label}>Calorie Count</Text>
      <TextInput
        style={styles.input}
        placeholder="Calories"
        placeholderTextColor="#888"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Dish Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Dish (e.g. Apple)"
        placeholderTextColor="#888"
        value={dish}
        onChangeText={setDish}
      />

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={onSave}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {editingMeal ? "Update Meal" : "Save Meal"}
            </Text>
          )}
        </TouchableOpacity>

        {editingMeal && (
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => {
              handleDelete(editingMeal);
              navigation.goBack();
            }}
            disabled={isPending}
          >
            <Text style={styles.deleteButtonText}>Delete Meal</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeScreen>
  );
};

export default MealEditScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  backButton: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: "600",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  label: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 10,
  },
  radioGroup: {
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginBottom: 20,
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
    marginBottom: 20,
    fontSize: 16,
    color: COLORS.primary,
  },
  actions: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    width: "100%",
    borderRadius: 16,
  },
  deleteButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ff4d4d",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButtonText: {
    color: "#ff4d4d",
    fontSize: 16,
    fontWeight: "bold",
  },
});
