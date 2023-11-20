import { Text, View } from "react-native";

export function NotesScreen() {
  return (
    <View
      style={{
        flex: 1,
        gap: 16,
        padding: 24,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        backgroundColor: "white",
      }}>
      <Text>Notas</Text>
    </View>
  );
}
