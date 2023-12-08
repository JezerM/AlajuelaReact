import { useEffect, useRef, useState } from "react";
import { AppState, FlatList, View } from "react-native";
import { Notification } from "../models/Notification";
import messaging from "@react-native-firebase/messaging";
import { CText, Heading4 } from "../components/CText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyListItem } from "../components/EmptyListItem";
import { getSchoolNotifications } from "../controllers/School";
import { getRelativeTime } from "../lib/utils";

type ItemProps = { notification: Notification };

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

export function SchoolScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const appState = useRef(AppState.currentState);
  const [refreshing, setRefreshing] = useState(false);

  const safeInsets = useSafeAreaInsets();

  function updateNotifications() {
    getSchoolNotifications()
      .then(v => {
        setNotifications(v);
      })
      .finally(() => setRefreshing(false));
  }

  useEffect(() => {
    updateNotifications();
  }, []);

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
        contentContainerStyle={{ paddingVertical: 12 }}
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
