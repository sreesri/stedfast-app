import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import SafeScreen from "../components/SafeScreen";
import { COLORS, SCREEN } from "../utils/Constants";
import RatioRoller from "../components/RatioRoller";
import TimePicker from "../components/TimePicker";
import { useFastingContext } from "../context/FastingContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";

const FastingConfigScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { setFastingConfig } = useFastingContext();
  const [fastingWindow, setFastingWindow] = useState("18");
  const [eatingWindow, setEatingWindow] = useState("6");

  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
  });

  const onSave = async () => {
    try {
      await setFastingConfig({
        fastingWindow: parseInt(fastingWindow),
        eatingWindow: parseInt(eatingWindow),
        fastingStartTime: {
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDate(),
          hour: date.getHours(),
          minute: date.getMinutes(),
        },
      });
      navigation.navigate(SCREEN.limitConfig);
    } catch (error) {
      // Toast or error feedback could be added here
      console.error("Save failed in component:", error);
    }
  };

  return (
    <SafeScreen style={styles.container} scrollable={true}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Plan</Text>
        <Text style={styles.subtitle}>
          Configure your fasting schedule and daily goals
        </Text>
      </View>

      <View style={styles.content}>
        <RatioRoller
          onValueChange={(val) => {
            const [f, e] = val.split(" : ");
            setFastingWindow(f.trim());
            setEatingWindow(e.trim());
          }}
        />

        <Text style={styles.label}>
          Fasting Start Time {date.toISOString()}
        </Text>
        <TimePicker initialTime={date} onTimeChange={(d) => setDate(d)} />

        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveButtonText}>Set Intake Targets</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
};

export default FastingConfigScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
  },
  header: {
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
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.ascent,
    borderRadius: 20,
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginTop: 30,
    marginBottom: 15,
    textAlign: "center",
  },

  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 40,
    marginBottom: 50,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "bold",
  },
});
