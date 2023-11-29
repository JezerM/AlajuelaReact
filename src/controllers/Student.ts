import Toast from "react-native-toast-message";
import { storage } from "../lib/mmkv";
import { Notification } from "../models/Notification";
import { Student } from "../models/Student";

export async function getStudentData(
  code: string,
): Promise<Student | undefined> {
  const url =
    "https://lsalajuela.inversionesalcedo.com/public/api/student?id=" + code;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      // const result = await response.text();
      // console.error(result);
      return undefined;
    }
    const result = (await response.json()) as Student;
    return result;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

async function registerToken(code: string) {
  const token = storage.getString("firebaseToken");
  if (!token) return false;

  const body = {
    identification: code,
    token: token,
  };

  try {
    const response = await fetch(
      "https://lsalajuela.inversionesalcedo.com/public/api/store/token/device",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }

  return true;
}

/**
 * Se envía el número de cédula del estudiante para registrar
 * el token de la API y obtener los datos del mismo.
 */
export async function registerStudent(code: string): Promise<boolean> {
  if (code == "") {
    return false;
  }

  const registered = await registerToken(code);
  if (!registered) {
    Toast.show({
      type: "error",
      position: "bottom",
      visibilityTime: 5000,
      text1: "Error al ingresar",
      text2: `No se pudo completar la solicitud`,
    });
    return false;
  }

  const registeredUsers: Student[] = JSON.parse(
    storage.getString("registeredUsers") ?? "null",
  );

  const studentData = await getStudentData(code == "10101010" ? "1323" : "1");

  if (studentData) {
    if (registeredUsers) {
      const exists = registeredUsers.find(v => v.id == studentData.id);
      if (!exists) {
        registeredUsers.push(studentData);
        storage.set("registeredUsers", JSON.stringify(registeredUsers));
      }
    } else {
      storage.set("registeredUsers", JSON.stringify([studentData]));
    }

    Toast.hide();
    return true;
  } else {
    Toast.show({
      type: "error",
      position: "bottom",
      visibilityTime: 5000,
      text1: "Error al ingresar",
      text2: `El estudiante con ID "${code}" no existe`,
    });
    return false;
  }
}

export async function unregisterStudent(code: number): Promise<boolean> {
  const registeredUsers: Student[] = JSON.parse(
    storage.getString("registeredUsers") ?? "null",
  );

  if (registeredUsers) {
    const newUsers = registeredUsers.filter(v => v.id != code);
    storage.set("registeredUsers", JSON.stringify(newUsers));
  }

  return true;
}

export async function getStudentNotifications(
  code: string,
): Promise<Notification[]> {
  const token = storage.getString("firebaseToken");
  if (!token) return [];

  const body = {
    identification: code,
    token: token,
  };

  try {
    const response = await fetch(
      "https://lsalajuela.inversionesalcedo.com/public/api/get/student-notification",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      return [];
    }
    const notifications = await response.json();
    if ("message" in notifications) {
      return [];
    }
    return notifications;
  } catch (error) {
    console.error(error);
    return [];
  }
}
