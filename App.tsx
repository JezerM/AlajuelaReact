import * as React from "react";
import { Pressable, StatusBar, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
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
        headerRight: ({ tintColor }) => (
          <Pressable
            onPress={() => navigation.push("Notifications")}
            android_ripple={{
              borderless: true,
              color: "#00000022",
              radius: 24,
              foreground: true,
            }}
            style={({ pressed }) => {
              return {
                paddingHorizontal: 16,
                paddingVertical: 8,
                opacity: pressed ? 0.85 : 1,
              };
            }}>
            <Icon name="notifications" color={tintColor} size={26} />
          </Pressable>
        ),
      }}>
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          title: "San Rafael de Alajuela",
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Estudiante"
        component={StudentScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="school" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Escuela"
        component={SchoolScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="notifications" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function NotificationContent() {
  return <Text>Notificaciones</Text>;
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
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
