import React, {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Icon from "react-native-vector-icons/MaterialIcons";
import { registerStudent, unregisterStudent } from "../controllers/Student";
import { colors, stylesheet } from "../lib/styles";
import { getIsLandscape } from "../lib/utils";
import { Student } from "../models/Student";

type Props = {
  editMode: boolean;
  setEditMode: Dispatch<React.SetStateAction<boolean>>;
  setDeleteModal: Dispatch<React.SetStateAction<Student | undefined>>;
};

export const StudentSelectionContext = createContext<Props | null>(null);

function StudentButton({ student }: { student: Student }) {
  const [_, setStudentCode] = useMMKVString("studentCode");

  const acronym = student.full_name.split(" ", 2).reduce((prev, curr) => {
    const s = curr.slice(0, 1);
    return prev + s;
  }, "");

  const { editMode, setEditMode, setDeleteModal } = useContext(
    StudentSelectionContext,
  )!!;
  const [pressing, setPressing] = useState(false);

  return (
    <Pressable
      onPress={() => {
        setStudentCode(student.id.toString());
      }}
      onLongPress={() => setEditMode(!editMode)}
      onPressIn={() => setPressing(true)}
      onPressOut={() => setPressing(false)}>
      <View
        style={[
          stylesheet.circleButton,
          {
            position: "relative",
            backgroundColor: pressing ? colors.primary : undefined,
          },
        ]}>
        <Text
          style={{
            fontWeight: "600",
            fontSize: 24,
            color: pressing ? "white" : "black",
          }}>
          {acronym}
        </Text>
        <Pressable
          onPress={() => setDeleteModal(student)}
          style={{
            position: "absolute",
            display: editMode ? "flex" : "none",
            top: -2,
            left: -2,
            padding: 4,
            backgroundColor: "red",
            borderRadius: 52,
          }}>
          <Icon name="close" size={14} color="white" />
        </Pressable>
      </View>
      <Text
        style={{
          fontSize: 11,
          marginTop: 4,
          width: 72,
          textAlign: "center",
          color: pressing ? colors.primary : "black",
        }}>
        {student.full_name}
      </Text>
    </Pressable>
  );
}

function AddNewStudentButton() {
  const [code, setCode] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [pressing, setPressing] = useState(false);

  const [sendDisabled, setSendDisabled] = useState(false);

  useEffect(() => {
    setSendDisabled(code == "");
  }, [code]);

  async function tryRegister(code: string) {
    setSendDisabled(true);

    const registered = await registerStudent(code);

    if (registered) {
      setCode("");
      setModalVisible(false);
    } else {
      setSendDisabled(false);
    }
  }

  return (
    <View>
      <Pressable
        onPress={() => {
          setModalVisible(true);
        }}
        onPressIn={() => setPressing(true)}
        onPressOut={() => setPressing(false)}>
        <View
          style={[
            stylesheet.circleButton,
            {
              backgroundColor: pressing ? colors.primary : undefined,
            },
          ]}>
          <Text
            style={{
              fontWeight: "500",
              fontSize: 20,
              color: pressing ? "white" : "black",
            }}>
            <Icon name="add" size={32} />
          </Text>
        </View>
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#00000032",
          }}>
          <View style={[stylesheet.whiteRoundedCard, { width: 300 }]}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                textAlign: "center",
                marginBottom: 8,
              }}>
              Añadir estudiante
            </Text>

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

            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableHighlight
                onPress={() => tryRegister(code)}
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
                  Añadir
                </Text>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
                underlayColor={colors.primary_dimmed}
                style={[stylesheet.roundedButton]}>
                <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
                  Cancelar
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function StudentButtons({
  registeredUsers = [],
}: {
  registeredUsers: Student[] | undefined;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 16,
      }}>
      {registeredUsers.map(student => (
        <StudentButton key={student.id} student={student} />
      ))}

      <AddNewStudentButton />
    </View>
  );
}

export function StudentSelectorView() {
  const safeInsets = useSafeAreaInsets();
  const isLandscape = getIsLandscape();

  const [registeredUsers] = useMMKVObject<Student[]>("registeredUsers");
  const [editMode, setEditMode] = useState(false);
  const [deleteModal, setDeleteModal] = useState<Student>();

  const bottomSheetModalReg = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["30%"], []);

  useEffect(() => {
    if (deleteModal == undefined) {
      bottomSheetModalReg.current?.dismiss();
    } else {
      bottomSheetModalReg.current?.present();
    }
  }, [deleteModal]);

  async function tryUnregister(code: number) {
    const deleted = await unregisterStudent(code);
    if (deleted) {
      Toast.hide();
    } else {
      Toast.show({
        type: "error",
        position: "bottom",
        visibilityTime: 5000,
        text1: "Error al ingresar",
        text2: `El estudiante con ID "${code}" no pudo ser eliminado`,
      });
    }

    setDeleteModal(undefined);
  }

  return (
    <BottomSheetModalProvider>
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

            <StudentSelectionContext.Provider
              value={{ editMode, setEditMode, setDeleteModal }}>
              <StudentButtons registeredUsers={registeredUsers} />
            </StudentSelectionContext.Provider>
          </View>
        </ScrollView>

        <BottomSheetModal
          index={0}
          ref={bottomSheetModalReg}
          enableDynamicSizing={true}
          enableDismissOnClose={true}
          onDismiss={() => setDeleteModal(undefined)}
          backgroundStyle={{ backgroundColor: colors.background_dimmed }}>
          <BottomSheetView>
            <View
              style={[
                stylesheet.bottomModalContent,
                {
                  marginLeft: safeInsets.left,
                  marginRight: safeInsets.right,
                  marginBottom: safeInsets.bottom,
                },
              ]}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "500",
                  textAlign: "center",
                  marginBottom: 8,
                }}>
                ¿Quitar el estudiante {deleteModal?.full_name}?
              </Text>

              <View style={[stylesheet.modalButtonGroup]}>
                <TouchableHighlight
                  onPress={() => tryUnregister(deleteModal?.id ?? 0)}
                  activeOpacity={0.8}
                  underlayColor={colors.white_dimmed}
                  style={[stylesheet.modalButton]}>
                  <Text style={{ fontSize: 16, color: "red" }}>
                    Quitar estudiante
                  </Text>
                </TouchableHighlight>

                <View
                  style={{
                    width: "auto",
                    marginHorizontal: 16,
                    backgroundColor: colors.separator_color,
                    height: 0.5,
                  }}
                />

                <TouchableHighlight
                  onPress={() => setDeleteModal(undefined)}
                  activeOpacity={0.8}
                  underlayColor={colors.white_dimmed}
                  style={[stylesheet.modalButton]}>
                  <Text style={{ fontSize: 16 }}>Cancelar</Text>
                </TouchableHighlight>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </KeyboardAvoidingView>
    </BottomSheetModalProvider>
  );
}
