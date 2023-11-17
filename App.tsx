import * as React from "react";
import { Button, StatusBar, Text } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { HomeScreen } from "./views/Home";
import { StudentScreen } from "./views/Student";
import { SchoolScreen } from "./views/School";
import { colors } from "./lib/styles";

type RootStackParamList = {
  Home: undefined;
  Notifications: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabContent({ navigation }: Props) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerTintColor: "#FFFFFF",
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerRight: () => (
          <Button
            onPress={() => navigation.push("Notifications")}
            title="OWO"
            color="#fff"
          />
        ),
      }}>
      <Tab.Screen
        name="Inicio"
        options={{ title: "San Rafael de Alajuela", tabBarLabel: "Inicio" }}
        component={HomeScreen}
      />
      <Tab.Screen name="Estudiante" component={StudentScreen} />
      <Tab.Screen name="Escuela" component={SchoolScreen} />
    </Tab.Navigator>
  );
}

function NotificationContent() {
  return <Text>Notificaciones</Text>;
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator
        screenOptions={({ route }) => {
          return {
            headerShown: route.name == "Notifications",
            headerBackTitle: "Atrás",
            tabBarActiveTintColor: colors.primary,
            headerTintColor: "#FFFFFF",
            headerStyle: {
              backgroundColor: colors.primary,
            },
          };
        }}>
        <Stack.Screen name="Home" component={MainTabContent} />
        <Stack.Screen
          name="Notifications"
          options={{ title: "Notificaciones" }}
          component={NotificationContent}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
