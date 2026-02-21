import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, SCREEN } from "./utils/Constants";
import Homescreen from "./screens/Homescreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StatsScreen from "./screens/StatsScreen";

const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Tabs.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.secondary,
              height: 50,
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
            }}
          />
          <Tabs.Screen name={SCREEN.statsscreen} component={StatsScreen} />
        </Tabs.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({});
