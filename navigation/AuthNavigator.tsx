import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SCREEN } from "../utils/Constants";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";

const Stack = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      id="AuthStackNavigator"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={SCREEN.login} component={LoginScreen} />
      <Stack.Screen name={SCREEN.signup} component={SignupScreen} />
    </Stack.Navigator>
  );
};
