import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useLimitContext } from "../context/LimitContext";
import { COLORS, withOpacity } from "../utils/Constants";
import SafeScreen from "../components/SafeScreen";

const LimitConfigScreen = () => {
  const navigation = useNavigation<any>();
  const { setLimitConfig } = useLimitContext();
  const [calorieLimit, setCalorieLimit] = useState("2000");
  const [proteinLimit, setProteinLimit] = useState("150");
  const [carbsLimit, setCarbsLimit] = useState("200");
  const [fatLimit, setFatLimit] = useState("70");
  const [isSaving, setIsSaving] = useState(false);

  const onSave = async () => {
    setIsSaving(true);
    try {
      await setLimitConfig({
        calorieLimit: parseInt(calorieLimit) || 0,
        proteinLimit: parseInt(proteinLimit) || 0,
        carbsLimit: parseInt(carbsLimit) || 0,
        fatLimit: parseInt(fatLimit) || 0,
      });
      // Reached from Settings to edit existing targets (pushed onto
      // MainNavigator's stack) -> just return to where they came from.
      // Reached during first-time onboarding (root screen of
      // FastingNavigator, nothing to go back to) -> RootNavigator swaps
      // to MainNavigator automatically once isFastingConfigDone &&
      // isLimitConfigDone are both true, so there's nothing else to do here.
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (error) {
      console.error("Save failed in component:", error);
      Toast.show({
        type: "error",
        text1: "Couldn't save your targets",
        text2: "Check your connection and try again",
        position: "bottom",
      });
    } finally {
      setIsSaving(false);
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

        <TouchableOpacity
          style={styles.saveButton}
          onPress={onSave}
          disabled={isSaving}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <ActivityIndicator color={COLORS.text} />
          ) : (
            <Text style={styles.saveButtonText}>Start Journey</Text>
          )}
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
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: withOpacity(COLORS.text, 0.55),
    lineHeight: 22,
  },
  content: {
    width: "100%",
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 10,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    fontSize: 28,
    fontWeight: "500",
    color: COLORS.text,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: "100%",
    textAlign: "center",
    padding: 12,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 40,
    marginBottom: 50,
    width: "100%",
  },
  saveButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
