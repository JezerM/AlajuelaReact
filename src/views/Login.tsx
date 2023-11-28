import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CText, Heading2 } from "../components/CText";
import { registerStudent } from "../controllers/Student";
import { colors, stylesheet } from "../lib/styles";
import { getIsLandscape } from "../lib/utils";

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
      // storage.set("studentCode", code);
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
          <Heading2
            style={{
              textAlign: "center",
              marginBottom: 8,
            }}>
            Bienvenido a San Rafael de Alajuela
          </Heading2>
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
            style={[stylesheet.textInput]}
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
            <CText style={[stylesheet.roundedButtonText]}>Ingresar</CText>
          </TouchableHighlight>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
