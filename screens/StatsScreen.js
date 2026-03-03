import { StyleSheet, Text, View } from "react-native";
import React from "react";
import WeightLogStats from "../components/WeightLogStats";

const StatsScreen = () => {
  const WEIGHT_DATA = [];

  return (
    <View>
      <WeightLogStats weightData={WEIGHT_DATA} />
    </View>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({});
