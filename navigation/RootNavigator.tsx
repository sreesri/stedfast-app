import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { COLORS } from "../utils/Constants";
import { useAuth } from "../context/AuthContext";
import { useFastingContext } from "../context/FastingContext";
import { AuthNavigator } from "./AuthNavigator";
import { MainNavigator } from "./MainNavigator";
import FastingNavigator from "./FastingNavigator";
import { useLimitContext } from "../context/LimitContext";

export const RootNavigator = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const { isFastingConfigDone, isFastingConfigLoading } = useFastingContext();
  const { isLimitConfigDone, isLimitConfigLoading } = useLimitContext();

  if (
    isLoading ||
    (isLoggedIn && (isFastingConfigLoading || isLimitConfigLoading))
  ) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Which top-level flow should be showing right now.
  const flow = !isLoggedIn
    ? "auth"
    : isFastingConfigDone && isLimitConfigDone
      ? "main"
      : "onboarding";

  // react-native-screens backs each stack navigator with native
  // view-recycling optimizations. Swapping which top-level navigator is
  // mounted as NavigationContainer's child (auth -> onboarding -> main) is a
  // different component *type* each time, so React already unmounts the old
  // one -- but native screens has been observed to leave stale native views
  // behind in exactly this scenario, where the JS-side state and log output
  // are correct (both config flags true, MainNavigator returned) yet the
  // previous screen stays visible until a full app reload. Keying
  // NavigationContainer itself by the active flow forces a complete
  // teardown/recreation of the native view hierarchy on every flow change,
  // eliminating that class of stale-native-view bug.
  return (
    <NavigationContainer key={flow}>
      {flow === "auth" ? (
        <AuthNavigator />
      ) : flow === "main" ? (
        <MainNavigator />
      ) : (
        <FastingNavigator />
      )}
    </NavigationContainer>
  );
};
