import { Button, Text, View } from "react-native";
import { useMMKVString } from "react-native-mmkv";

export function StudentScreen() {
  const [_, setStudentCode] = useMMKVString("studentCode");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}>
      <Text>¡Estudiante!</Text>

      <Button title="Salir" onPress={() => setStudentCode(undefined)} />
    </View>
  );
}
