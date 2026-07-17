import { StyleSheet, View } from "react-native";
import React from "react";

const Divider = () => {
  return <View style={styles.divider} />;
};

export default Divider;

const styles = StyleSheet.create({
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(233,233,237,0.1)",
    marginVertical: 22,
  },
});
