import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { COLORS, SCREEN } from "../utils/Constants";
import { useAuth } from "../context/AuthContext";
import { useBaseContext } from "../context/BaseContext";
import { AuthNavigator } from "./AuthNavigator";
import { MainNavigator } from "./MainNavigator";
import BaseNavigator from "./BaseNavigator";

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const { isBaseConfigDone, isBaseConfigLoading } = useBaseContext();

  if (isLoading || (isLoggedIn && isBaseConfigLoading)) {
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
        isBaseConfigDone ? (
          <MainNavigator />
        ) : (
          <BaseNavigator />
        )
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};
