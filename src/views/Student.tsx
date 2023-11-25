import { useEffect } from "react";
import {
  Linking,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import { colors, stylesheet } from "../lib/styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Student } from "../models/Student";
import { getStudentData } from "../controllers/Student";
import { CText, Heading1, Heading4 } from "../components/CText";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function StudentScreen() {
  const [code, setStudentCode] = useMMKVString("studentCode");
  const [student, setStudentData] = useMMKVObject<Student>("studentData");

  const safeInsets = useSafeAreaInsets();

  useEffect(() => {
    if (code == undefined) return;
    getStudentData(code).then(studentData => {
      setStudentData(studentData);
    });
  }, [code]);

  return (
    <ScrollView
      contentContainerStyle={{
        gap: 20,
        padding: 24,
        paddingLeft: 24 + safeInsets.left,
        paddingRight: 24 + safeInsets.right,
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}>
      <Heading1
        style={{
          textAlign: "center",
          alignSelf: "center",
          marginBottom: 16,
        }}>
        {student?.full_name}
      </Heading1>

      <Heading4 style={{ fontWeight: "600" }}>Detalles</Heading4>

      <View style={[stylesheet.contentRow]}>
        <Icon name="badge" size={20} color={colors.text} />

        <Heading4>
          Cédula:{" "}
          <Text style={{ fontWeight: "normal" }}>
            {student?.identification}
          </Text>
        </Heading4>
      </View>

      <View style={[stylesheet.contentRow]}>
        <Icon name="school" size={20} color={colors.text} />

        <Heading4>
          Sección:
          <Text style={{ fontWeight: "normal" }}> {student?.seccion}</Text>
        </Heading4>
      </View>

      <View style={[stylesheet.contentRow]}>
        <Icon name="person" size={20} color={colors.text} />

        <Heading4>
          Tutor(a):
          <Text style={{ fontWeight: "normal" }}> {student?.tutor}</Text>
        </Heading4>
      </View>

      <View style={[stylesheet.contentRow]}>
        <Icon name="call" size={20} color={colors.text} />

        <Heading4>
          Teléfono del tutor(a):{" "}
          <Text
            style={{ fontWeight: "normal", color: colors.primary }}
            onPress={() => Linking.openURL(`tel:${student?.phone_tutor}`)}>
            {student?.phone_tutor}
          </Text>
        </Heading4>
      </View>

      <TouchableHighlight
        onPress={() => setStudentCode(undefined)}
        activeOpacity={0.8}
        underlayColor={colors.primary_dimmed}
        style={[
          stylesheet.roundedButton,
          {
            width: "100%",
            marginTop: 16,
            alignSelf: "center",
          },
        ]}>
        <CText style={[stylesheet.roundedButtonText]}>Salir</CText>
      </TouchableHighlight>
    </ScrollView>
  );
}
