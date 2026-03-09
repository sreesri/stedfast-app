import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../utils/Constants";
import FastingTracker from "../components/FastingTracker";
import Divider from "../components/Divider";
import DailySummary from "../components/DailySummary";
import { getFastingStatus, updateFastingStatus } from "../utils/http";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";

const Homescreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [trackingState, setTrackingState] = useState("FASTING");
  const [startTime, setStartTime] = useState(new Date());

  const handleTogglePhase = async () => {
    try {
      const fastingStatus = await updateFastingStatus({
        userId: "user_1234",
        trackingState: trackingState === "FASTING" ? "EATING" : "FASTING",
        startTime: new Date().toISOString(),
      });
      console.log("Update success:", fastingStatus);

      setTrackingState(fastingStatus.status);
      setStartTime(new Date(fastingStatus.startTime));
      Toast.show({
        type: "success",
        text1: "Status Updated",
        text2: `You are now ${fastingStatus.status.toLowerCase()}.`,
        position: "bottom",
      });
    } catch (error) {
      console.error("Failed to update fasting status:", error);
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Something went wrong while updating your status.",
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    const fetchFastingStatus = async () => {
      try {
        const fastingStatus = await getFastingStatus();
        console.log("Fetch success:", fastingStatus);

        setTrackingState(fastingStatus.status);
        setStartTime(new Date(fastingStatus.startTime));
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch fasting status:", error);
        Toast.show({
          type: "error",
          text1: "Sync Failed",
          text2: "Couldn't retrieve your latest fasting status.",
          position: "bottom",
        });
      }
    };
    console.log("use effect");

    fetchFastingStatus();
  }, []);

  return (
    <>
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <>
            <FastingTracker
              trackingState={trackingState}
              startTime={startTime}
              onToggle={handleTogglePhase}
              fastRatio={18}
              eatRatio={6}
            />
            <Divider />
            <DailySummary consumed={1000} maxLimit={2000} mealLog={[]} />
          </>
        )}
      </View>
    </>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 10,
    justifyContent: "center",
  },
});
