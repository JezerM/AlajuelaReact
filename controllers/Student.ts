import Toast from "react-native-toast-message";
import { storage } from "../lib/mmkv";
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
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function registerStudent(code: string): Promise<boolean> {
  if (code == "") {
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
