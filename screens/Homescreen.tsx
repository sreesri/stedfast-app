import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { COLORS, SCREEN } from "../utils/Constants";
import FastingTracker from "../components/FastingTracker";
import Divider from "../components/Divider";
import DailySummary from "../components/DailySummary";
import TimePicker from "../components/TimePicker";
import { useFastingContext } from "../context/FastingContext";
import { useHomeLogic } from "../hooks/useHomeLogic";
import SafeScreen from "../components/SafeScreen";
import { useLimitContext } from "../context/LimitContext";
import { useNavigation } from "@react-navigation/native";

const Homescreen = () => {
  const { fastingConfig } = useFastingContext();
  const { limitConfig } = useLimitContext();

  const {
    isLoading,
    trackingState,
    startTime,
    macros,
    rawTrackingState,
    activeScheduleId,
    refetch,
    isRefreshing,
  } = useHomeLogic();

  const navigation = useNavigation<any>();

  const onToggleFast = () => {
    navigation.navigate(SCREEN.mealedit, {
      isFastingToggle: true,
      trackingState: rawTrackingState,
      activeScheduleId,
    });
  };

  return (
    <SafeScreen style={styles.container} scrollable={true} onRefresh={refetch} refreshing={isRefreshing}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <FastingTracker
            trackingState={trackingState}
            startTime={startTime}
            onToggle={onToggleFast}
            fastRatio={fastingConfig?.fastingWindow}
            eatRatio={fastingConfig?.eatingWindow}
          />

          <Divider />
          <DailySummary macros={macros} />
        </>
      )}
    </SafeScreen>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: "center",
  },
});
