import { StyleSheet } from "react-native";

export const colors = {
  primary: "#2196F3",
  primary_dimmed: "#1976D2",
  background: "#FFFFFF",
  background_dimmed: "#F4F4F4",
  white_dimmed: "#E3E3E3",
  separator_color: "#C5C5C7",
};

export const sizes = {
  icon: {
    small: 24,
    medium: 28,
    big: 32,
  },
};

export const stylesheet = StyleSheet.create({
  primary: {
    color: colors.primary,
  },
  whiteRoundedCard: {
    padding: 24,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    borderRadius: 16,
    borderCurve: "continuous",
  },
  bottomModalContent: {
    padding: 16,
    gap: 16,
    backgroundColor: "#F4F4F4",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderCurve: "continuous",
  },
  modalButtonGroup: {
    width: "100%",
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  modalButton: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  roundedButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: colors.primary,
    borderRadius: 8,
    borderCurve: "continuous",
  },
  circleButton: {
    width: 72,
    height: 72,
    borderRadius: 72,
    borderColor: colors.primary,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
