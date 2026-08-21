import React from "react";
import { StyleSheet, Text } from "react-native";
import { colors } from "../constants/colors";

export const ICON_FONT_FAMILY = "icons";

export const IconMap = {
  threedotAlt: 0xE81E,
  eyeOff: 0xE833,
  eye: 0xE841,
  regentSprinke: 0xE806,
  document: 0xE808,
  pencil: 0xE80A,
  threedot: 0xE81E,
  rightArrow: 0xE801,
  leftArrow: 0xE800,
  rightOpen: 0xF006,
  leftOpen: 0xF007,
  dropDown: 0xF004,
  backArrowLeft: 0xF007,
  alert: 0xE809,
  check: 0xE80B,
  dustbin: 0xE80C,
  lock: 0xE80D,
  userPlaceholder: 0xE80F,
  message: 0xE810,
  phone: 0xE811,
  gender: 0xE812,
  gear: 0xE813,
  exitIcon: 0xE814,
  userRemove: 0xE80E,
  caution: 0xE815,
  cake: 0xE816,
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
