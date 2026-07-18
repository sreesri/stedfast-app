import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { COLORS } from "../utils/Constants";
import { useAuth } from "../context/AuthContext";
import { useFastingContext } from "../context/FastingContext";
import { AuthNavigator } from "./AuthNavigator";
import { MainNavigator } from "./MainNavigator";
import FastingNavigator from "./FastingNavigator";
import { useLimitContext } from "../context/LimitContext";

const Stack = createStackNavigator();

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

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        isFastingConfigDone && isLimitConfigDone ? (
          <MainNavigator />
        ) : (
          <FastingNavigator />
        )
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};
