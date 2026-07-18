import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { COLORS, SCREEN, withOpacity } from "../utils/Constants";
import FastingTracker from "../components/FastingTracker";
import DailySummary from "../components/DailySummary";
import { useFastingContext } from "../context/FastingContext";
import { useHomeLogic } from "../hooks/useHomeLogic";
import SafeScreen from "../components/SafeScreen";
import { useLimitContext } from "../context/LimitContext";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

const Homescreen = () => {
  const { fastingConfig } = useFastingContext();
  const { limitConfig } = useLimitContext();

  const {
    isLoading,
    trackingState,
    startTime,
    scheduleStartTime,
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

  const now = new Date();
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = now.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return (
    <SafeScreen
      style={styles.container}
      scrollable={true}
      onRefresh={refetch}
      refreshing={isRefreshing}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.dayName}>{dayName}</Text>
          <Text style={styles.dateStr}>{dateStr}</Text>
        </View>
        {/*<TouchableOpacity style={styles.avatarButton} activeOpacity={0.7}>*/}
        {/*  <Ionicons name="person-outline" size={17} color={COLORS.navIcon} />*/}
        {/*</TouchableOpacity>*/}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : (
        <>
          <FastingTracker
            trackingState={trackingState}
            startTime={startTime}
            onToggle={onToggleFast}
            fastRatio={fastingConfig?.fastingWindow}
            eatRatio={fastingConfig?.eatingWindow}
            scheduleStartTime={scheduleStartTime}
          />
          <DailySummary macros={macros} />
        </>
      )}
    </SafeScreen>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 8,
  },
  dayName: {
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: -0.3,
    color: COLORS.text,
  },
  dateStr: {
    fontSize: 12.5,
    color: withOpacity(COLORS.text, 0.5),
    marginTop: 2,
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: withOpacity(COLORS.text, 0.16),
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
});
