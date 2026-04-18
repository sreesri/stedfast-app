import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useLimitContext } from "../context/LimitContext";
import { COLORS } from "../utils/Constants";
import SafeScreen from "../components/SafeScreen";

const LimitConfigScreen = () => {
  const { setLimitConfig } = useLimitContext();
  const [calorieLimit, setCalorieLimit] = useState("2000");
  const [proteinLimit, setProteinLimit] = useState("150");
  const [carbsLimit, setCarbsLimit] = useState("200");
  const [fatLimit, setFatLimit] = useState("70");

  const onSave = async () => {
    try {
      await setLimitConfig({
        calorieLimit: parseInt(calorieLimit) || 0,
        proteinLimit: parseInt(proteinLimit) || 0,
        carbsLimit: parseInt(carbsLimit) || 0,
        fatLimit: parseInt(fatLimit) || 0,
      });
      console.log("limit config set and saved to backend");
    } catch (error) {
      console.error("Save failed in component:", error);
    }
  };

  return (
    <SafeScreen style={styles.container} scrollable={true}>
      <View style={styles.header}>
        <Text style={styles.title}>Intake Targets</Text>
        <Text style={styles.subtitle}>
          Set your daily nutritional and calorie goals
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Daily Calorie Limit (kcal)</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={calorieLimit}
            onChangeText={setCalorieLimit}
            keyboardType="number-pad"
          />
        </View>

        <Text style={styles.label}>Protein Target (g)</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={proteinLimit}
            onChangeText={setProteinLimit}
            keyboardType="number-pad"
          />
        </View>

        <Text style={styles.label}>Carbs Target (g)</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={carbsLimit}
            onChangeText={setCarbsLimit}
            keyboardType="number-pad"
          />
        </View>

        <Text style={styles.label}>Fat Target (g)</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={fatLimit}
            onChangeText={setFatLimit}
            keyboardType="number-pad"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveButtonText}>Start Journey</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
};

export default LimitConfigScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.primary,
    lineHeight: 22,
  },
  content: {
    width: "100%",
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.ascent,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.primary,
    backgroundColor: COLORS.input,
    borderRadius: 20,
    width: "100%",
    textAlign: "center",
    padding: 12,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 40,
    marginBottom: 50,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    width: "100%",
  },
  saveButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
