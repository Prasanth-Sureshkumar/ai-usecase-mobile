import React from "react";
import { StyleSheet, Text } from "react-native";
import { colors } from "../constants/colors";

export const ICON_FONT_FAMILY = "icons";

export const IconMap = {
  regentSprinkle: 0xE806,
  regentSprinke: 0xE806,
  sparkles: 0xE806,
  document: 0xE808,
  "file-text": 0xE808,
  pencil: 0xE807,
  threedot: 0xE81E,
  "more-horizontal": 0xE81E
};

export function getIconGlyph(name) {
  const codepoint = typeof name === "number" ? name : IconMap[name];
  return typeof codepoint === "number" ? String.fromCodePoint(codepoint) : "";
}

export default function Icon({
  name,
  color = colors.navy,
  size = 28,
  style
}) {
  const glyph = getIconGlyph(name);

  if (!glyph) {
    return null;
  }

  return (
    <Text
      allowFontScaling={false}
      style={[
        styles.icon,
        {
          color,
          fontSize: size,
          lineHeight: size
        },
        style
      ]}
    >
      {glyph}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontFamily: ICON_FONT_FAMILY,
    includeFontPadding: false,
    textAlign: "center",
    textAlignVertical: "center"
  }
});
