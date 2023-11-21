import { StyleSheet } from "react-native";

export const colors = {
  primary: "#2196F3",
  primary_dimmed: "#1976D2",
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
  roundedButton: {
    paddingVertical: 12,
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
