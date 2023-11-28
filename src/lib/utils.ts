import { useWindowDimensions } from "react-native";
import { storage } from "./mmkv";

export function getIsLandscape() {
  const dimensions = useWindowDimensions();
  const isLandscape = dimensions.width > dimensions.height;
  return isLandscape;
}

export function increaseRecentNotifications() {
  const quantity = storage.getNumber("recentNotifications");
  if (quantity) {
    storage.set("recentNotifications", quantity + 1);
  } else {
    storage.set("recentNotifications", 1);
  }
}
export function resetRecentNotifications() {
  storage.set("recentNotifications", 0);
}
