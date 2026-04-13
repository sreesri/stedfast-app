import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SCREEN } from "../utils/Constants";
import FastingConfigScreen from "../screens/FastingConfigScreen";
import LimitConfigScreen from "../screens/LimitConfigScreen";
import { useFastingContext } from "../context/FastingContext";

const Stack = createStackNavigator();

const FastingNavigator = () => {
  const { isFastingConfigDone } = useFastingContext();

  return (
    <Stack.Navigator
      id="FastingConfigNavigator"
      screenOptions={{ headerShown: false }}
      initialRouteName={
        !isFastingConfigDone ? SCREEN.fastingconfig : SCREEN.limitConfig
      }
    >
      <Stack.Screen
        name={SCREEN.fastingconfig}
        component={FastingConfigScreen}
      />
      <Stack.Screen name={SCREEN.limitConfig} component={LimitConfigScreen} />
    </Stack.Navigator>
  );
};

export default FastingNavigator;
