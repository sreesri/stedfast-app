import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../utils/Constants";

interface SafeScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: Edge[];
  statusBarStyle?: "auto" | "inverted" | "light" | "dark";
  backgroundColor?: string;
}

const SafeScreen: React.FC<SafeScreenProps> = ({
  children,
  style,
  edges = ["top", "left", "right", "bottom"],
  statusBarStyle = "auto",
  backgroundColor = COLORS.background,
}) => {
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }, style]}
      edges={edges}
    >
      <StatusBar style={statusBarStyle} />
      {children}
    </SafeAreaView>
  );
};

export default SafeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
