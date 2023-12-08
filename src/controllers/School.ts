import { storage } from "../lib/mmkv";
import { Notification } from "../models/Notification";

export async function getSchoolNotifications(): Promise<Notification[]> {
  const token = storage.getString("firebaseToken");
  if (!token) return [];

  try {
    const response = await fetch(
      "https://lsalajuela.inversionesalcedo.com/public/api/get-notification",
    );

    if (!response.ok) {
      return [];
    }
    const notifications = (await response.json()) as Notification[];
    if (!Array.isArray(notifications)) return [];
    return notifications.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      const diff = dateA.getTime() - dateB.getTime();
      if (diff > 0) return -1;
      else if (diff < 1) return 1;
      else return 0;
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}
