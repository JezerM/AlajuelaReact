import * as React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "./views/Home";
import { StudentScreen } from "./views/Student";
import { SchoolScreen } from "./views/School";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Estudiante" component={StudentScreen} />
        <Tab.Screen name="Escuela" component={SchoolScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
