import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, Text } from "react-native";
import { COLORS, SCREEN } from "../utils/Constants";
import Homescreen from "../screens/Homescreen";
import StatsScreen from "../screens/StatsScreen";
import MealLogsScreen from "../screens/MealLogsScreen";
import MealEditScreen from "../screens/MealEditScreen";
import { useAuth } from "../context/AuthContext";

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tabs.Navigator
      id="HomeTabsNavigator"
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.secondary,
        },
        headerShown: false,
        headerTintColor: COLORS.primary,
        headerTitleAlign: "center",
        tabBarActiveBackgroundColor: COLORS.secondary,
        tabBarInactiveBackgroundColor: COLORS.ascent,
        tabBarStyle: {
          position: "absolute",
        },
      }}
    >
      <Tabs.Screen
        name={SCREEN.homescreen}
        component={Homescreen}
        options={{
          title: "Home",
          // headerRight: () => {
          //   const { logout } = useAuth();
          //   return (
          //     <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
          //       <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
          //         Logout
          //       </Text>
          //     </TouchableOpacity>
          //   );
          // },
        }}
      />
      <Tabs.Screen name={SCREEN.statsscreen} component={StatsScreen} />
    </Tabs.Navigator>
  );
};

export const MainNavigator = () => {
  return (
    <Stack.Navigator
      id="RootStackNavigator"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
      <Stack.Screen
        name={SCREEN.meallogs}
        component={MealLogsScreen}
        options={{
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name={SCREEN.mealedit}
        component={MealEditScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
