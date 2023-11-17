import * as React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "./views/Home";
import { StudentScreen } from "./views/Student";
import { SchoolScreen } from "./views/School";
import styles from "./lib/styles";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: styles.primary.color,
          headerTintColor: "#FFFFFF",
          headerStyle: {
            backgroundColor: styles.primary.color,
          },
        }}>
        <Tab.Screen
          name="Inicio"
          options={{ title: "San Rafael de Alajuela" }}
          component={HomeScreen}
        />
        <Tab.Screen name="Estudiante" component={StudentScreen} />
        <Tab.Screen name="Escuela" component={SchoolScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
