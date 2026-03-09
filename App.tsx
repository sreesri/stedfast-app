import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { COLORS, SCREEN } from "./utils/Constants";
import Homescreen from "./screens/Homescreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StatsScreen from "./screens/StatsScreen";
import MealLogsScreen from "./screens/MealLogsScreen";
import Toast from "react-native-toast-message";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tabs.Navigator
      id="HomeTabsNavigator"
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.secondary,
        },
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
          headerRight: () => {
            const { logout } = useAuth();
            return (
              <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
                <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
                  Logout
                </Text>
              </TouchableOpacity>
            );
          },
        }}
      />
      <Tabs.Screen name={SCREEN.statsscreen} component={StatsScreen} />
    </Tabs.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      id="AuthStackNavigator"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={SCREEN.login} component={LoginScreen} />
      <Stack.Screen name={SCREEN.signup} component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
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
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.secondary,
          },
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
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
      {isLoggedIn ? <AuthenticatedStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
      <Toast />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({});
