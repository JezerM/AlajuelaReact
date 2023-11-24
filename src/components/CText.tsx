import { Text, TextProps, ViewProps } from "react-native";
import { stylesheet } from "../lib/styles";

export function CText(props: TextProps) {
  return (
    <Text {...props} style={[stylesheet.paragraph, props.style]}>
      {props.children}
    </Text>
  );
}

export function Heading1(props: TextProps) {
  return (
    <Text
      {...props}
      style={[stylesheet.paragraph, stylesheet.heading1, props.style]}>
      {props.children}
    </Text>
  );
}

export function Heading2(props: TextProps) {
  return (
    <Text
      {...props}
      style={[stylesheet.paragraph, stylesheet.heading2, props.style]}>
      {props.children}
    </Text>
  );
}

export function Heading3(props: TextProps) {
  return (
    <Text
      {...props}
      style={[stylesheet.paragraph, stylesheet.heading3, props.style]}>
      {props.children}
    </Text>
  );
}

export function Heading4(props: TextProps) {
  return (
    <Text
      {...props}
      style={[stylesheet.paragraph, stylesheet.heading4, props.style]}>
      {props.children}
    </Text>
  );
}
