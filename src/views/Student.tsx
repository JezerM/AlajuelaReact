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

export function StudentScreen() {
  const [code, setStudentCode] = useMMKVString("studentCode");
  const [student, setStudentData] = useMMKVObject<Student>("studentData");

  useEffect(() => {
    if (code == undefined) return;
    getStudentData(code).then(studentData => {
      setStudentData(studentData);
    });
  }, [code]);

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        gap: 16,
        padding: 24,
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}>
      <Text
        style={{
          fontSize: 32,
          fontWeight: "600",
          textAlign: "center",
          alignSelf: "center",
          marginBottom: 16,
        }}>
        {student?.full_name}
      </Text>

      <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
        <Icon name="badge" size={20} />

        <Text style={{ fontSize: 18, fontWeight: "500" }}>
          Cédula:
          <Text style={{ fontWeight: "normal" }}>
            {" "}
            {student?.identification}
          </Text>
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
        <Icon name="school" size={20} />

        <Text style={{ fontSize: 18, fontWeight: "500" }}>
          Sección:
          <Text style={{ fontWeight: "normal" }}> {student?.seccion}</Text>
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
        <Icon name="person" size={20} />

        <Text style={{ fontSize: 18, fontWeight: "500" }}>
          Tutor(a):
          <Text style={{ fontWeight: "normal" }}> {student?.tutor}</Text>
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
        <Icon name="call" size={20} />

        <Text style={{ fontSize: 18, fontWeight: "500" }}>
          Teléfono del tutor(a):{" "}
          <Text
            style={{ fontWeight: "normal", color: colors.primary }}
            onPress={() => Linking.openURL(`tel:${student?.phone_tutor}`)}>
            {student?.phone_tutor}
          </Text>
        </Text>
      </View>

      <TouchableHighlight
        onPress={() => setStudentCode(undefined)}
        activeOpacity={0.8}
        underlayColor={colors.primary_dimmed}
        style={[
          stylesheet.roundedButton,
          {
            marginTop: 16,
            alignSelf: "center",
          },
        ]}>
        <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Salir</Text>
      </TouchableHighlight>
    </ScrollView>
  );
}
