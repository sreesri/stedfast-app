import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { COLORS, SCREEN } from "../utils/Constants";
import Homescreen from "../screens/Homescreen";
import StatsScreen from "../screens/StatsScreen";
import FoodLibraryScreen from "../screens/FoodLibraryScreen";
import FoodEditorScreen from "../screens/FoodEditorScreen";
import SettingsScreen from "../screens/SettingsScreen";
import FastingConfigScreen from "../screens/FastingConfigScreen";
import LimitConfigScreen from "../screens/LimitConfigScreen";
import MealEditScreen from "../screens/MealEditScreen";
import MealLogsScreen from "../screens/MealLogsScreen";
import WorkoutLogsScreen from "../screens/WorkoutLogsScreen";
import WorkoutEditScreen from "../screens/WorkoutEditScreen";
import ExerciseLibraryScreen from "../screens/ExerciseLibraryScreen";
import ExerciseEditorScreen from "../screens/ExerciseEditorScreen";
import Ionicons from "@expo/vector-icons/Ionicons";

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tabs.Navigator
      id="HomeTabsNavigator"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopWidth: 1,
          borderTopColor: "rgba(233,233,237,0.08)",
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "400",
        },
      }}
    >
      <Tabs.Screen
        name={SCREEN.homescreen}
        component={Homescreen}
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name={SCREEN.statsscreen}
        component={StatsScreen}
        options={{
          title: "Stats",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "bar-chart" : "bar-chart-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name={SCREEN.foodlibrary}
        component={FoodLibraryScreen}
        options={{
          title: "Foods",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "fast-food" : "fast-food-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name={SCREEN.workoutlogs}
        component={WorkoutLogsScreen}
        options={{
          title: "Exercise",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "barbell" : "barbell-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name={SCREEN.settings}
        component={SettingsScreen}
        options={{
          title: "Settings",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={22}
              color={color}
            />
          ),
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
      <Stack.Screen name={SCREEN.meallogs} component={MealLogsScreen} />
      <Stack.Screen name={SCREEN.mealedit} component={MealEditScreen} />
      <Stack.Screen name={SCREEN.foodeditor} component={FoodEditorScreen} />
      <Stack.Screen name={SCREEN.fastingConfig} component={FastingConfigScreen} />
      <Stack.Screen name={SCREEN.limitConfig} component={LimitConfigScreen} />
      <Stack.Screen name={SCREEN.workoutedit} component={WorkoutEditScreen} />
      <Stack.Screen name={SCREEN.exerciselibrary} component={ExerciseLibraryScreen} />
      <Stack.Screen name={SCREEN.exerciseeditor} component={ExerciseEditorScreen} />
    </Stack.Navigator>
  );
};
