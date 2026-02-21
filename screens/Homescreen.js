import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../utils/Constants";
import WeightLogStats from "../components/WeightLogStats";
import FastingTracker from "../components/FastingTracker";
import Divider from "../components/Divider";
import DailySummary from "../components/DailySummary";

const Homescreen = () => {
  return (
    <View style={styles.container}>
      <FastingTracker />
      <Divider />
      <DailySummary />
    </View>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 10,
  },
});
