import { View } from "react-native";
import { Heading4 } from "./CText";

type ItemProps = { text: string };

export function EmptyListItem({ text }: ItemProps) {
  return (
    <View
      style={{
        paddingHorizontal: 24,
        paddingVertical: 12,
      }}>
      <Heading4>{text}</Heading4>
    </View>
  );
}
