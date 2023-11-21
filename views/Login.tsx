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
import { registerStudent } from "../controllers/Student";
import { storage } from "../lib/mmkv";
import { colors, stylesheet } from "../lib/styles";
import { getIsLandscape } from "../lib/utils";

async function isRegistered(code: string): Promise<boolean> {
  const token = storage.getString("firebaseToken");
  if (!token) return false;

  const body = {
    identification: Number.parseInt(code),
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

export function LoginView() {
  const [code, setCode] = React.useState("");
  const [sendDisabled, setSendDisabled] = React.useState(false);

  React.useEffect(() => {
    setSendDisabled(code == "");
  }, [code]);

  async function tryLogin(code: string) {
    setSendDisabled(true);

    const registered = await registerStudent(code);

    if (registered) {
      setCode("");
      storage.set("studentCode", code);
    } else {
      setSendDisabled(false);
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
          style={[
            stylesheet.whiteRoundedCard,
            {
              width: 324,
            },
          ]}>
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
            onChangeText={setCode}
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
            style={[
              stylesheet.roundedButton,
              {
                backgroundColor: !sendDisabled ? colors.primary : "gray",
              },
            ]}>
            <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
              Ingresar
            </Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
