import Toast from "react-native-toast-message";
import { storage } from "../lib/mmkv";
import { Attendance } from "../models/Attendance";
import { Notification } from "../models/Notification";
import { Student } from "../models/Student";

export async function getStudentData(
  code: string,
): Promise<Student | undefined> {
  return {
    identification: "test",
    id: 1,
    tutor: "Juan",
    seccion: "01A",
    full_name: "Marcos Pérez",
    phone_tutor: "",
    beca_comedor: "",
    beca_avancemos: "",
  };

  const url =
    "https://lsalajuela.inversionesalcedo.com/public/api/student/identification?identification=" +
    code;
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

async function registerToken(code: string): Promise<[boolean, string?]> {
  // const token = storage.getString("firebaseToken");
  // if (!token) return [false, "No se pudo obtener el token de Firebase"];

  return [true, "No hay servidor"];

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
      return [false, "El servidor no pudo proveer un token válido"];
    }
  } catch (error) {
    console.error(error);
    return [false, "No se pudo completar la solicitud"];
  }

  return [true];
}
async function unregisterToken(id: number) {
  return false;
  try {
    const response = await fetch(
      "https://lsalajuela.inversionesalcedo.com/public/api/student/destroy-token?id=" +
        id,
      {
        method: "DELETE",
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

  const [registered, error] = await registerToken(code);
  if (!registered) {
    Toast.show({
      type: "error",
      position: "bottom",
      visibilityTime: 5000,
      text1: "Error al ingresar",
      text2: error,
    });
    return false;
  }

  const registeredUsers: Student[] = JSON.parse(
    storage.getString("registeredUsers") ?? "null",
  );

  const studentData = await getStudentData(code);

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

export async function unregisterStudent(id: number): Promise<boolean> {
  const registeredUsers: Student[] = JSON.parse(
    storage.getString("registeredUsers") ?? "null",
  );

  if (registeredUsers) {
    const newUsers = registeredUsers.filter(v => v.id != id);
    storage.set("registeredUsers", JSON.stringify(newUsers));

    await unregisterToken(id);
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

export async function getStudentAttendances(
  code: string,
): Promise<Attendance[]> {
  const token = storage.getString("firebaseToken");
  if (!token) return [];

  const body = {
    identification: code,
    token: token,
  };

  try {
    const response = await fetch(
      "https://lsalajuela.inversionesalcedo.com/public/api/get/student-attendance",
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
    const attendances = await response.json();
    if ("message" in attendances) {
      return [];
    }
    return attendances;
  } catch (error) {
    console.error(error);
    return [];
  }
}
