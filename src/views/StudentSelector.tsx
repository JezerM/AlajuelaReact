import React, {
  createContext,
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialIcons";
import { registerStudent, unregisterStudent } from "../controllers/Student";
import { colors, stylesheet } from "../lib/styles";
import { getIsLandscape } from "../lib/utils";
import { Student } from "../models/Student";
import { CText, Heading2, Heading3, Heading4 } from "../components/CText";

type Props = {
  editMode: boolean;
  setEditMode: Dispatch<React.SetStateAction<boolean>>;
  setStudentToDelete: Dispatch<React.SetStateAction<Student | undefined>>;
};

export const StudentSelectionContext = createContext<Props | null>(null);

function StudentButton({ student }: { student: Student }) {
  const [_, setStudentCode] = useMMKVString("studentCode");
  const [_1, setStudentData] = useMMKVObject<Student>("studentData");

  const acronym = student.full_name.split(" ", 2).reduce((prev, curr) => {
    const s = curr.slice(0, 1);
    return prev + s;
  }, "");

  const { editMode, setEditMode, setStudentToDelete } = useContext(
    StudentSelectionContext,
  )!!;
  const [pressing, setPressing] = useState(false);

  const randomDelay = Math.random() * 250;
  const rotationOffset = 0.005;
  const rotation = useSharedValue(0);
  const translateOffset = 0.5;
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (editMode) {
      rotation.value = withDelay(
        randomDelay,
        withRepeat(
          withSequence(
            withTiming(rotationOffset, { duration: 175 }),
            withTiming(-rotationOffset, { duration: 175 }),
          ),
          -1,
          true,
        ),
      );
      translateX.value = withDelay(
        randomDelay,
        withRepeat(
          withSequence(
            withTiming(-translateOffset, { duration: 150 }),
            withTiming(translateOffset, { duration: 150 }),
          ),
          -1,
          true,
        ),
      );
      translateY.value = withDelay(
        randomDelay,
        withRepeat(
          withSequence(
            withTiming(translateOffset, { duration: 160 }),
            withTiming(-translateOffset, { duration: 160 }),
          ),
          -1,
          true,
        ),
      );
    } else {
      rotation.value = 0;
      translateX.value = 0;
      translateY.value = 0;
    }
  }, [editMode]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value * 360}deg` },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Pressable
      onPress={() => {
        setStudentCode(student.id.toString());
        setStudentData(student);
      }}
      onLongPress={() => setEditMode(!editMode)}
      onPressIn={() => setPressing(true)}
      onPressOut={() => setPressing(false)}>
      <Animated.View
        style={[
          stylesheet.circleButton,
          animatedStyle,
          {
            position: "relative",
            backgroundColor: pressing ? colors.primary : undefined,
          },
        ]}>
        <Heading2
          style={{
            color: pressing ? "white" : colors.text,
          }}>
          {acronym}
        </Heading2>
        <Pressable
          onPress={() => setStudentToDelete(student)}
          hitSlop={8}
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
      </Animated.View>
      <CText
        style={{
          fontSize: 11,
          marginTop: 4,
          width: 72,
          textAlign: "center",
          color: pressing ? colors.primary : colors.text,
        }}>
        {student.full_name}
      </CText>
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
          <Heading3
            style={{
              color: pressing ? "white" : colors.text,
            }}>
            <Icon name="add" size={32} />
          </Heading3>
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
            <Heading3
              style={{
                fontWeight: "700",
                textAlign: "center",
                marginBottom: 8,
              }}>
              Añadir estudiante
            </Heading3>

            <TextInput
              onChangeText={setCode}
              value={code}
              placeholder="Ingrese el código de estudiante"
              style={[stylesheet.textInput]}
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
                <CText style={{ color: "#FFFFFF", fontWeight: "600" }}>
                  Añadir
                </CText>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
                underlayColor={colors.primary_dimmed}
                style={[stylesheet.roundedButton]}>
                <CText style={{ color: "#FFFFFF", fontWeight: "600" }}>
                  Cancelar
                </CText>
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
  const [studentToDelete, setStudentToDelete] = useState<Student>();

  const bottomSheetModalReg = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (studentToDelete == undefined) {
      bottomSheetModalReg.current?.dismiss();
    } else {
      bottomSheetModalReg.current?.present();
    }
  }, [studentToDelete]);

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

    setStudentToDelete(undefined);
  }

  const opacity = useSharedValue(0);

  const renderBackdrop = useCallback(() => {
    return (
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#00000042",
          position: "absolute",
          opacity,
        }}
      />
    );
  }, []);

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
            <Heading2
              style={{
                textAlign: "center",
                marginBottom: 8,
              }}>
              Bienvenido a San Rafael de Alajuela
            </Heading2>

            <StudentSelectionContext.Provider
              value={{ editMode, setEditMode, setStudentToDelete }}>
              <StudentButtons registeredUsers={registeredUsers} />
            </StudentSelectionContext.Provider>
          </View>
        </ScrollView>

        <BottomSheetModal
          index={0}
          ref={bottomSheetModalReg}
          enableDynamicSizing={true}
          enableDismissOnClose={true}
          onAnimate={(from, to) => {
            if (from == -1) {
              opacity.value = withTiming(1);
            } else if (to == -1) {
              opacity.value = withTiming(0);
            }
          }}
          backdropComponent={renderBackdrop}
          onDismiss={() => setStudentToDelete(undefined)}
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
              <Heading4
                style={{
                  textAlign: "center",
                  marginBottom: 8,
                }}>
                ¿Quitar el estudiante {studentToDelete?.full_name}?
              </Heading4>

              <View style={[stylesheet.modalButtonGroup]}>
                <TouchableHighlight
                  onPress={() => tryUnregister(studentToDelete?.id ?? 0)}
                  activeOpacity={0.8}
                  underlayColor={colors.white_dimmed}
                  style={[stylesheet.modalButton]}>
                  <CText style={{ fontSize: 16, color: "red" }}>
                    Quitar estudiante
                  </CText>
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
                  onPress={() => setStudentToDelete(undefined)}
                  activeOpacity={0.8}
                  underlayColor={colors.white_dimmed}
                  style={[stylesheet.modalButton]}>
                  <CText style={{ fontSize: 16 }}>Cancelar</CText>
                </TouchableHighlight>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </KeyboardAvoidingView>
    </BottomSheetModalProvider>
  );
}
