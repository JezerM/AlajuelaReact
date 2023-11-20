import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../lib/styles";
import { getIsLandscape } from "../lib/utils";

export function LoginScreen() {
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
        backgroundColor: colors.primary,
      }}>
      <ScrollView
        contentContainerStyle={{
          marginTop: safeInsets.top,
          marginBottom: safeInsets.bottom,
          flex: !isLandscape ? 1 : 0,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}>
        <View
          style={{
            padding: 24,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
            width: 324,
            borderRadius: 16,
            borderCurve: "continuous",
          }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              textAlign: "center",
              marginBottom: 8,
            }}>
            Bienvenido a San Rafael de Alajuela
          </Text>
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
            <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
              Ingresar
            </Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
