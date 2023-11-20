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
import Toast from "react-native-toast-message";
import { useMMKVString } from "react-native-mmkv";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { storage } from "../lib/mmkv";
import { colors } from "../lib/styles";
import { getIsLandscape } from "../lib/utils";

async function isRegistered(code: string): Promise<boolean> {
  const token = storage.getString("firebaseToken");
  if (!token) return false;

  const body = {
    identification: Number.parseInt(code),
    token: token,
  };

  console.log(body);

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

    console.log(response);

    if (!response.ok) {
      // const result = await response.text();
      // console.error(result);
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }

  return true;
}

export function LoginScreen() {
  const [code, onChangeCode] = React.useState("");
  const [sendDisabled, onChangeSendDisabled] = React.useState(false);

  const [_, setStudentCode] = useMMKVString("studentCode");

  React.useEffect(() => {
    onChangeSendDisabled(code == "");
  }, [code]);

  async function tryLogin(code: string) {
    onChangeSendDisabled(true);
    if (code == "") {
      onChangeSendDisabled(false);
      return;
    }

    const registered = await isRegistered(code);

    if (registered) {
      onChangeCode("");
      setStudentCode(code);
    } else {
      onChangeSendDisabled(false);
      Toast.show({
        type: "error",
        position: "bottom",
        visibilityTime: 5000,
        text1: "Error al ingresar",
        text2: `El estudiante con ID "${code}" no existe`,
      });
    }
  }

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
            onPress={() => tryLogin(code)}
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
