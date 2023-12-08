import { useEffect, useRef, useState } from "react";
import { AppState, FlatList, View } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { getStudentNotifications } from "../controllers/Student";
import { Notification } from "../models/Notification";
import messaging from "@react-native-firebase/messaging";
import { CText, Heading4 } from "../components/CText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyListItem } from "../components/EmptyListItem";

type ItemProps = { notification: Notification };

function diffDates(a: Date, b: Date) {
  return a.getTime() - b.getTime();
}
function getRelativeTime(date: Date): string {
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
  if (hours == 1) {
    return `Hace ${Math.round(days)} día`;
  } else if (hours < 7) {
    return `Hace ${Math.round(days)} días`;
  }

  const dtf = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
  return dtf.format(date);
}

function RelativeTimeItem({ date }: { date: Date }) {
  const t = getRelativeTime(date);
  const [relativeTime, setRelativeTime] = useState(t);

  useEffect(() => {
    const timer = setInterval(() => {
      const t = getRelativeTime(date);
      setRelativeTime(t);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return <CText>{relativeTime}</CText>;
}

function NotificationItem({ notification }: ItemProps) {
  const notificationDate = new Date(notification.created_at);

  return (
    <View
      style={{
        flexDirection: "column",
        gap: 4,
        paddingHorizontal: 24,
        paddingVertical: 12,
      }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Heading4>{notification.title}</Heading4>
        <RelativeTimeItem date={notificationDate} />
      </View>
      <CText>{notification.message}</CText>
    </View>
  );
}

export function NotificationsScreen() {
  const [code] = useMMKVString("studentCode");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const appState = useRef(AppState.currentState);
  const [refreshing, setRefreshing] = useState(false);

  const safeInsets = useSafeAreaInsets();

  function updateNotifications() {
    if (code == undefined) return;
    getStudentNotifications(code)
      .then(v => {
        setNotifications(v);
      })
      .finally(() => setRefreshing(false));
  }

  useEffect(() => {
    if (code == undefined) return;
    updateNotifications();
  }, [code]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", state => {
      if (
        (appState.current == "background" || appState.current == "inactive") &&
        state === "active"
      ) {
        updateNotifications();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async () => {
      updateNotifications();
    });

    return unsubscribe;
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        marginLeft: safeInsets.left,
        marginRight: safeInsets.right,
      }}>
      <FlatList
        style={{ paddingTop: 12 }}
        data={notifications}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          updateNotifications();
        }}
        ListEmptyComponent={<EmptyListItem text="No hay notificaciones" />}
      />
    </View>
  );
}
