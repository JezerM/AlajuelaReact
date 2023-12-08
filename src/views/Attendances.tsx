import { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CText, Heading4 } from "../components/CText";
import { EmptyListItem } from "../components/EmptyListItem";
import { getStudentAttendances } from "../controllers/Student";
import { Attendance } from "../models/Attendance";

type ItemProps = { attendance: Attendance };

function AttendanceItem({ attendance }: ItemProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 4,
        paddingHorizontal: 24,
        paddingVertical: 12,
      }}>
      <View style={{ flexDirection: "column", gap: 4 }}>
        <Heading4>Hora de entrada: {attendance.entry_time}</Heading4>
        <CText>Hora de salida: {attendance.departure_time}</CText>
      </View>
      <View
        style={{
          flexDirection: "column",
          gap: 4,
          alignSelf: "flex-end",
          alignItems: "flex-end",
        }}>
        <CText>Fecha</CText>
        <Heading4>{attendance.date}</Heading4>
      </View>
    </View>
  );
}

export function AttendancesScreen() {
  const [code] = useMMKVString("studentCode");
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  function updateAttendances() {
    if (code == undefined) return;
    getStudentAttendances(code)
      .then(v => {
        setAttendances(v);
      })
      .finally(() => setRefreshing(false));
  }

  useEffect(() => {
    if (code == undefined) return;
    updateAttendances();
  }, [code]);

  const safeInsets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        marginLeft: safeInsets.left,
        marginRight: safeInsets.right,
      }}>
      <FlatList
        style={{ paddingTop: 12 }}
        data={attendances}
        renderItem={({ item }) => <AttendanceItem attendance={item} />}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          updateAttendances();
        }}
        ListEmptyComponent={<EmptyListItem text="No hay asistencias" />}
      />
    </View>
  );
}
