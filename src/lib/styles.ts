import { StyleSheet } from "react-native";

export const colors = {
  primary: "#2196F3",
  primary_dimmed: "#1976D2",
  background: "#FFFFFF",
  background_dimmed: "#F4F4F4",
  white_dimmed: "#E3E3E3",
  separator_color: "#C5C5C7",
  text: "#000000",
} as const;

export const sizes = {
  icon: {
    small: 24,
    medium: 28,
    big: 32,
  },
};

export const stylesheet = StyleSheet.create({
  paragraph: {
    fontSize: 14,
    color: colors.text,
  },
  heading1: {
    fontSize: 32,
    fontWeight: "700",
  },
  heading2: {
    fontSize: 24,
    fontWeight: "700",
  },
  heading3: {
    fontSize: 20,
    fontWeight: "600",
  },
  heading4: {
    fontSize: 18,
    fontWeight: "500",
  },
  textInput: {
    padding: 12,
    width: "100%",
    maxWidth: 300,
    borderBottomWidth: 2,
    borderColor: "gray",
    textAlign: "center",
    color: colors.text,
  },
  whiteRoundedCard: {
    padding: 24,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    borderRadius: 16,
    borderCurve: "continuous",
  },
  contentRow: {
    paddingHorizontal: 8,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  bottomModalContent: {
    padding: 16,
    gap: 16,
    backgroundColor: colors.background_dimmed,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderCurve: "continuous",
  },
  modalButtonGroup: {
    width: "100%",
    flexDirection: "column",
    backgroundColor: colors.background,
    borderRadius: 12,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  modalButton: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  roundedButton: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: colors.primary,
    borderRadius: 8,
    borderCurve: "continuous",
  },
  roundedButtonText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "600",
  },
  circleButton: {
    width: 72,
    height: 72,
    borderRadius: 72,
    borderColor: colors.primary,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});
