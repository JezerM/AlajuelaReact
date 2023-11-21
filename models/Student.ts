export interface Student {
  id: number;
  full_name: string;
  identification: string;
  seccion: string;
  tutor: string;
  phone_tutor: string;
  beca_comedor: string;
  beca_avancemos: string;
}

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
