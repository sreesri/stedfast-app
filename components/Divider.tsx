import { StyleSheet, View } from "react-native";
import React from "react";
import { COLORS, withOpacity } from "../utils/Constants";

const Divider = () => {
  return <View style={styles.divider} />;
};

export default Divider;

const styles = StyleSheet.create({
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: withOpacity(COLORS.text, 0.1),
    marginVertical: 22,
  },
});
