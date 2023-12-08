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

function diffDates(a: Date, b: Date) {
  return a.getTime() - b.getTime();
}
export function getRelativeTime(date: Date): string {
  const currentDate = new Date();
  const diff = diffDates(currentDate, date);

  const seconds = diff / 1000;
  if (seconds < 60) {
    return `Hace ${Math.round(seconds)} s`;
  }
  const minutes = seconds / 60;
  if (minutes < 60) {
    return `Hace ${Math.round(minutes)} m`;
  }
  const hours = minutes / 60;
  if (hours < 24) {
    return `Hace ${Math.round(hours)} h`;
  }
  const days = minutes / 24;
  if (days == 1) {
    return `Hace ${Math.round(days)} día`;
  } else if (days < 7) {
    return `Hace ${Math.round(days)} días`;
  }

  const dtf = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
  return dtf.format(date);
}
