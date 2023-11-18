import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../lib/styles";
import { getIsLandscape } from "../lib/utils";

export function HomeScreen() {
  const [code, onChangeCode] = React.useState("");
  const [sendDisabled, onChangeSendDisabled] = React.useState(false);

  React.useEffect(() => {
    onChangeSendDisabled(code == "");
  });

  const safeInsets = useSafeAreaInsets();
  const isLandscape = getIsLandscape();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        alignItems: "stretch",
        justifyContent: "center",
        backgroundColor: "white",
      }}>
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          marginTop: safeInsets.top,
          marginBottom: safeInsets.bottom,
          gap: 16,
          flex: !isLandscape ? 1 : 0,
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Image
          source={require("../assets/logo-alajuela.jpg")}
          style={{
            aspectRatio: 3 / 4,
            height: 200,
          }}
        />
        <TextInput
          onChangeText={onChangeCode}
          value={code}
          placeholder="Ingrese el código de estudiante"
          style={{
            padding: 12,
            width: "100%",
            maxWidth: 300,
            borderBottomWidth: 2,
            borderColor: "gray",
            textAlign: "center",
          }}
          placeholderTextColor="gray"
          keyboardType="number-pad"
        />
        <TouchableHighlight
          onPress={() => console.log("SEND " + code)}
          activeOpacity={0.8}
          underlayColor={colors.primary_dimmed}
          disabled={sendDisabled}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: !sendDisabled ? colors.primary : "gray",
            borderRadius: 8,
            borderCurve: "continuous",
          }}>
          <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Enviar</Text>
        </TouchableHighlight>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
