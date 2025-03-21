/**
 * @format
 */

import "react-native-gesture-handler";
import { AppRegistry } from "react-native";
import App from "./src/App";
import messaging from "@react-native-firebase/messaging";
import { name as appName } from "./app.json";
import { increaseRecentNotifications } from "./src/lib/utils";

messaging().setBackgroundMessageHandler(async remoteMessage => {
  increaseRecentNotifications();
  console.log("Message handled in the background! ", remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
