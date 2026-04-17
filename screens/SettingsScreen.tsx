import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SafeScreen from "../components/SafeScreen";
import { COLORS, SCREEN } from "../utils/Constants";
import { useAuth } from "../context/AuthContext";

const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const { logout } = useAuth();

  return (
    <SafeScreen style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.menuGroup}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate(SCREEN.fastingconfig)}
        >
          <Text style={styles.menuItemText}>Fasting Configuration</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate(SCREEN.limitConfig)}
        >
          <Text style={styles.menuItemText}>Macro Limits Configuration</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeScreen>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 30,
  },
  menuGroup: {
    backgroundColor: COLORS.ascent,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 40,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  chevron: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ff4d4d",
    alignItems: "center",
  },
  logoutText: {
    color: "#ff4d4d",
    fontSize: 18,
    fontWeight: "bold",
  },
});
