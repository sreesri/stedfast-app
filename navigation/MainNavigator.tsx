import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, Text } from "react-native";
import { COLORS, SCREEN } from "../utils/Constants";
import Homescreen from "../screens/Homescreen";
import StatsScreen from "../screens/StatsScreen";
import MealLogsScreen from "../screens/MealLogsScreen";
import FoodLibraryScreen from "../screens/FoodLibraryScreen";
import FoodEditorScreen from "../screens/FoodEditorScreen";
import SettingsScreen from "../screens/SettingsScreen";
import FastingConfigScreen from "../screens/FastingConfigScreen";
import LimitConfigScreen from "../screens/LimitConfigScreen";
import MealEditScreen from "../screens/MealEditScreen";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

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
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarActiveBackgroundColor: COLORS.background,
        tabBarInactiveBackgroundColor: COLORS.background,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: COLORS.background,
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: 300,
        },
      }}
    >
      <Tabs.Screen
        name={SCREEN.homescreen}
        component={Homescreen}
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => {
            return <FontAwesome name="home" size={24} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name={SCREEN.statsscreen}
        component={StatsScreen}
        options={{
          title: "Stats",
          tabBarIcon: ({ color }) => {
            return <Ionicons name="stats-chart" size={24} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name={SCREEN.foodlibrary}
        component={FoodLibraryScreen}
        options={{
          title: "My Foods",
          tabBarIcon: ({ color }) => {
            return <FontAwesome6 name="bowl-food" size={24} color={color} />;
          },
        }}
      />
      <Tabs.Screen
        name={SCREEN.settings}
        component={SettingsScreen}
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => {
            return <Ionicons name="settings" size={24} color={color} />;
          },
        }}
      />
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
      <Stack.Screen
        name={SCREEN.foodeditor}
        component={FoodEditorScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={SCREEN.fastingConfig}
        component={FastingConfigScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={SCREEN.limitConfig}
        component={LimitConfigScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
