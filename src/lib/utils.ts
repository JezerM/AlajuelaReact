import { useWindowDimensions } from "react-native";

export function getIsLandscape() {
  const dimensions = useWindowDimensions();
  const isLandscape = dimensions.width > dimensions.height;
  return isLandscape;
}
