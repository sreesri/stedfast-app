import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS } from "../utils/Constants";

const Divider = () => {
  return <View style={styles.divider}></View>;
};

export default Divider;

const styles = StyleSheet.create({
  divider: {
    width: "100%",
    height: 2,
    backgroundColor: COLORS.ascent,
    margin: 5,
  },
});
