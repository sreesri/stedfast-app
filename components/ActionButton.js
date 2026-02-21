import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { COLORS } from "../utils/Constants";

const ActionButton = ({ title, onPress, backgroundColor }) => {
  return (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  actionButton: {
    marginTop: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  actionText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "bold",
  },
});
