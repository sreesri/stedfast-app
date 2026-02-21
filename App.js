import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, SCREEN } from "./utils/Constants";
import Homescreen from "./screens/Homescreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StatsScreen from "./screens/StatsScreen";
import MealLogsScreen from "./screens/MealLogsScreen";

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tabs.Navigator
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
        }}
      />
      <Tabs.Screen name={SCREEN.statsscreen} component={StatsScreen} />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeTabs" component={HomeTabs} />
          <Stack.Screen 
            name={SCREEN.meallogs} 
            component={MealLogsScreen} 
            options={{ headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({});
