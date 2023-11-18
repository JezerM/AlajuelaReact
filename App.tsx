import * as React from "react";
import {
  Platform,
  Pressable,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
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
import { colors, sizes } from "./lib/styles";
import { EdgeInsets } from "react-native-safe-area-context";
import { SafeAreaProviderCompat } from "@react-navigation/elements";

type RootStackParamList = {
  Home: undefined;
  Notifications: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabContent({ navigation }: Props) {
  console.log(SafeAreaProviderCompat.initialMetrics);
  const dimensions = useWindowDimensions();
  const isLandscape = dimensions.width > dimensions.height;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: {
          height: isLandscape
            ? Platform.select({ ios: 52, default: 42 })
            : Platform.select({ ios: 82, default: 62 }),
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarIconStyle: {
          maxHeight: sizes.icon.big,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
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
            <Icon
              name="notifications"
              color={tintColor}
              size={sizes.icon.medium}
            />
          </Pressable>
        ),
      }}>
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          title: "San Rafael de Alajuela",
          tabBarLabel: "Inicio",
          tabBarIcon: ({ color }) => (
            <Icon name="home" color={color} size={sizes.icon.medium} />
          ),
        }}
      />
      <Tab.Screen
        name="Estudiante"
        component={StudentScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="school" color={color} size={sizes.icon.medium} />
          ),
        }}
      />
      <Tab.Screen
        name="Escuela"
        component={SchoolScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="notifications" color={color} size={sizes.icon.medium} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function NotificationContent() {
  return (
    <View style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
      <Text>Notificaciones</Text>
    </View>
  );
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
