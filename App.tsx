import * as React from "react";
import { Alert, Platform, StatusBar } from "react-native";
import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import { HomeScreen } from "./views/Home";
import { StudentScreen } from "./views/Student";
import { SchoolScreen } from "./views/School";
import { colors, sizes } from "./lib/styles";
import { PermissionsAndroid } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { getIsLandscape } from "./lib/utils";
import { LoginScreen } from "./views/Login";
import { useMMKVString } from "react-native-mmkv";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabContent() {
  const isLandscape = getIsLandscape();

  return (
    <Tab.Navigator
      initialRouteName="Estudiante"
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
        name="Estudiante"
        component={StudentScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="school" color={color} size={sizes.icon.medium} />
          ),
        }}
      />
      <Tab.Screen
        name="Notas"
        component={StudentScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="notes" color={color} size={sizes.icon.medium} />
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

const ToastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      text1Style={{
        fontSize: 16,
        fontWeight: "400",
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 16,
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
};

export default function App() {
  const [_, setToken] = useMMKVString("firebaseToken");

  requestUserPermission().then(() => {
    messaging()
      .getToken()
      .then(token => {
        setToken(token);
        console.log("FCM Token: ", token);
      });
  });

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  const [studentCode] = useMMKVString("studentCode");
  const navigationRef = createNavigationContainerRef<RootStackParamList>();

  let initialRouteName: keyof RootStackParamList = "Login";

  React.useEffect(() => {
    if (studentCode != undefined) {
      initialRouteName = "Home";
    } else {
      initialRouteName = "Login";
    }
    if (navigationRef.isReady()) {
      navigationRef.navigate(initialRouteName);
    }
  }, [studentCode]);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          gestureEnabled: false,
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
      <Toast config={ToastConfig} />
    </NavigationContainer>
  );
}
