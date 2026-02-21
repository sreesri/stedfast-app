import { StyleSheet, Text, View } from "react-native";
import React from "react";
import WeightLogStats from "../components/WeightLogStats";

const StatsScreen = () => {
  const WEIGHT_DATA = [120.7, 120.9, 120.5, 120.1, 120.3];

  return (
    <View>
      <WeightLogStats weightData={WEIGHT_DATA} />
    </View>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({});
