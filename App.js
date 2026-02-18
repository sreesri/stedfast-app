import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, SCREEN } from "./utils/Constants";
import Homescreen from "./screens/Homescreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.secondary,
            },
            headerTintColor: COLORS.primary,
            headerTitleAlign: "center",
          }}
        >
          <Stack.Screen
            name={SCREEN.homescreen}
            component={Homescreen}
            options={{
              title: "Stats",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({});
