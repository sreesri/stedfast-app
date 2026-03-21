import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SCREEN } from "../utils/Constants";
import BaseConfigScreen from "../screens/BaseConfigScreen";

const Stack = createStackNavigator();

const BaseNavigator = () => {
  return (
    <Stack.Navigator
      id="BaseConfigNavigator"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={SCREEN.baseconfig} component={BaseConfigScreen} />
    </Stack.Navigator>
  );
};

export default BaseNavigator;
