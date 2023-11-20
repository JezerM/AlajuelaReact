import * as React from "react";
import { Alert, Platform, StatusBar } from "react-native";
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
import { PermissionsAndroid } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { getIsLandscape } from "./lib/utils";
import { LoginScreen } from "./views/Login";

async function requestUserPermission() {
  if (Platform.OS == "android") {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
  }
}

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabContent({ navigation }: Props) {
  const isLandscape = getIsLandscape();

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
        name="Notificaciones"
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

export default function App() {
  requestUserPermission();

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <Stack.Navigator
        initialRouteName="Login" // Change to Login
        screenOptions={{
          headerShown: false,
          headerBackTitle: "Atrás",
          headerTintColor: "#FFFFFF",
          headerStyle: {
            backgroundColor: colors.primary,
          },
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={MainTabContent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
