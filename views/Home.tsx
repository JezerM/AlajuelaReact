import { Image, Text, View } from "react-native";

export function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}>
      <Image
        source={require("../assets/logo-alajuela.jpg")}
        style={{
          aspectRatio: 3 / 4,
          height: 200,
        }}
      />
      <Text>¡Inicio!</Text>
    </View>
  );
}
