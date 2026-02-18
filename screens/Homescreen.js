import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../utils/Constants";
import WeightLogStats from "../components/WeightLogStats";

const Homescreen = () => {
  const WEIGHT_DATA = [120.7, 120.9, 120.5, 120.1, 120.3];

  return (
    <View style={styles.container}>
      <WeightLogStats weightData={WEIGHT_DATA} />
    </View>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
});
