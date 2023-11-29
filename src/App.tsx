import * as React from "react";
import { Platform, StatusBar, View } from "react-native";
import {
  createNavigationContainerRef,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import { StudentScreen } from "./views/Student";
import { NotificationsScreen } from "./views/Notifications";
import { colors, sizes } from "./lib/styles";
import { PermissionsAndroid } from "react-native";
import messaging from "@react-native-firebase/messaging";
import {
  getIsLandscape,
  increaseRecentNotifications,
  resetRecentNotifications,
} from "./lib/utils";
import { LoginView } from "./views/Login";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { AttendancesScreen } from "./views/Attendances";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Student } from "./models/Student";
import { StudentSelectorView } from "./views/StudentSelector";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { storage } from "./lib/mmkv";

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
  const insets = useSafeAreaInsets();

  // const [recentNotifications] = useMMKVNumber("recentNotifications");

  return (
    <Tab.Navigator
      initialRouteName="Estudiante"
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: {
          height:
            (isLandscape
              ? Platform.select({ ios: 40, default: 40 })
              : Platform.select({ ios: 50, default: 60 })) + insets.bottom,
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
        name="Asistencias"
        component={AttendancesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="hub" color={color} size={sizes.icon.medium} />
          ),
        }}
      />
      <Tab.Screen
        name="Notificaciones"
        component={NotificationsScreen}
        listeners={{
          tabPress: () => {
            resetRecentNotifications();
          },
        }}
        options={{
          // tabBarBadge:
          //   recentNotifications != undefined && recentNotifications != 0
          //     ? recentNotifications
          //     : undefined,
          tabBarBadgeStyle: {
            top: -2,
            right: 0,
          },
          tabBarIcon: ({ color }) => (
            <Icon name="notifications" color={color} size={sizes.icon.medium} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function LoginScreen() {
  const [registeredUsers] = useMMKVObject<Student[]>("registeredUsers");

  const entering = ZoomIn.withInitialValues({ transform: [{ scale: 0.5 }] });
  const exiting = ZoomOut.withInitialValues({ transform: [{ scale: 0.5 }] });

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      {(!registeredUsers || registeredUsers.length == 0) && (
        <Animated.View
          entering={entering}
          exiting={exiting}
          style={{ flex: 1 }}>
          <LoginView />
        </Animated.View>
      )}
      {registeredUsers && registeredUsers.length > 0 && (
        <Animated.View
          entering={entering}
          exiting={exiting}
          style={{ flex: 1 }}>
          <StudentSelectorView />
        </Animated.View>
      )}
    </View>
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

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "white",
  },
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
      increaseRecentNotifications();
      console.log("A new FCM message arrived: ", remoteMessage);
    });

    return unsubscribe;
  }, []);

  const [studentCode] = useMMKVString("studentCode");
  const navigationRef = createNavigationContainerRef<RootStackParamList>();

  const savedStateString = storage.getString("savedState");
  let initialState = undefined;

  if (Platform.OS !== "web") {
    const state = savedStateString ? JSON.parse(savedStateString) : undefined;
    if (state !== undefined) {
      initialState = state;
    }
  }

  React.useEffect(() => {
    let route: keyof RootStackParamList = "Login";
    if (studentCode != undefined) {
      route = "Home";
    } else {
      route = "Login";
    }
    if (navigationRef.isReady()) {
      navigationRef.navigate(route);
    }
  }, [studentCode]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer
        ref={navigationRef}
        initialState={initialState}
        onStateChange={state => {
          storage.set("savedState", JSON.stringify(state));
        }}
        theme={MyTheme}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={ops => {
            return {
              navigationBarColor:
                ops.route.name == "Home" ? "white" : colors.primary,
              gestureEnabled: false,
              headerShown: false,
              headerBackTitle: "Atrás",
              headerTintColor: "#FFFFFF",
              headerStyle: {
                backgroundColor: colors.primary,
              },
            };
          }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={MainTabContent} />
        </Stack.Navigator>
        <Toast config={ToastConfig} />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
