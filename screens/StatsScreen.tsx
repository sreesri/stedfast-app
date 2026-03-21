import React from "react";
import WeightLogStats from "../components/WeightLogStats";
import SafeScreen from "../components/SafeScreen";

const StatsScreen = () => {
  const WEIGHT_DATA = [];

  return (
    <SafeScreen>
      <WeightLogStats weightData={WEIGHT_DATA} />
    </SafeScreen>
  );
};

export default StatsScreen;
