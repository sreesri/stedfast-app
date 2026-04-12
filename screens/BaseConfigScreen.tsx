import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import TimePicker from "../components/TimePicker";
import { COLORS } from "../utils/Constants";
import { useBaseContext } from "../context/BaseContext";
import ActionButton from "../components/ActionButton";

import SafeScreen from "../components/SafeScreen";
import RatioRoller from "../components/RatioRoller";

const BaseConfigScreen = () => {
  const { setBaseConfig } = useBaseContext();
  const [fastingWindow, setFastingWindow] = useState("18");
  const [eatingWindow, setEatingWindow] = useState("6");
  const [calorieLimit, setCalorieLimit] = useState("2000");

  // Initialize with a Date object for the picker
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setHours(20, 0, 0, 0);
    return d;
  });

  const handleFastingChange = (text: string) => {
    const val = parseInt(text) || 0;
    if (val <= 24) {
      setFastingWindow(text);
      setEatingWindow((24 - val).toString());
    }
  };

  const handleEatingChange = (text: string) => {
    const val = parseInt(text) || 0;
    if (val <= 24) {
      setEatingWindow(text);
      setFastingWindow((24 - val).toString());
    }
  };

  const handleCalorieLimitChange = (text: string) => {
    setCalorieLimit(text);
  };

  const handleSave = () => {
    setBaseConfig({
      fastingWindow: parseInt(fastingWindow),
      eatingWindow: parseInt(eatingWindow),
      fastingStartTime: {
        hour: date.getHours(),
        minute: date.getMinutes(),
      },
      calorieLimit: parseInt(calorieLimit),
    });
  };

  const formatDisplayTime = (d: Date) => {
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strMinutes = minutes < 10 ? "0" + minutes : minutes;
    return hours + ":" + strMinutes + " " + ampm;
  };

  return (
    <SafeScreen style={styles.container} scrollable={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Plan</Text>
        <Text style={styles.subtitle}>
          Choose your fasting and eating windows.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Daily Schedule</Text>
        <View style={styles.windowRow}>
          <RatioRoller
            onValueChange={(value) => {
              const [fast, eat] = value.split(" : ").map((v) => v.trim());
              setFastingWindow(fast);
              setEatingWindow(eat);
            }}
          />
        </View>

        <Text style={styles.label}>Fasting Start Time</Text>
        <TimePicker initialTime={date} onTimeChange={(d) => setDate(d)} />

        <Text style={styles.label}>Daily Calorie Limit</Text>
        <View>
          <TextInput
            style={styles.calorieInput}
            value={calorieLimit}
            keyboardType="numeric"
            maxLength={4}
            onChangeText={handleCalorieLimitChange}
          />
        </View>

        <View style={styles.footer}>
          <ActionButton
            title="Get Started"
            onPress={handleSave}
            backgroundColor={COLORS.primary}
          />
        </View>
      </View>
    </SafeScreen>
  );
};

export default BaseConfigScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    padding: 20,
  },

  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.primary,
    textAlign: "center",
    opacity: 0.8,
  },
  card: {
    backgroundColor: COLORS.ascent,
    padding: 20,
    borderRadius: 30,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.ascent,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    textAlign: "center",
  },
  windowRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  windowInputContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  windowInput: {
    fontSize: 48,
    fontWeight: "800",
    color: COLORS.primary,
    backgroundColor: COLORS.input,
    borderRadius: 20,
    marginBottom: 10,
    textAlign: "center",
    padding: 10,
    width: 80,
  },
  calorieInput: {
    fontSize: 48,
    fontWeight: "800",
    color: COLORS.primary,
    backgroundColor: COLORS.input,
    borderRadius: 20,
    marginBottom: 10,
    textAlign: "center",
    padding: 10,
  },
  windowLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.secondary,
    marginTop: -5,
  },
  separator: {
    fontSize: 48,
    fontWeight: "300",
    color: COLORS.primary,
    marginHorizontal: 15,
    marginTop: -10,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.ascent + "40",
    marginVertical: 32,
  },
  timePickerButton: {
    backgroundColor: COLORS.ascent + "20",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.ascent + "40",
  },
  displayTime: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  changeText: {
    fontSize: 14,
    color: COLORS.secondary,
    marginTop: 4,
    fontWeight: "600",
  },
  footer: {
    marginTop: 40,
  },
  inlinePickerContainer: {
    marginVertical: 15,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    overflow: "hidden",
  },
});
