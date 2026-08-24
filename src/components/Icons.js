import React from "react";
import { StyleSheet } from "react-native";
import { colors } from "../constants/colors";
import MyText from "./MyText";

export const ICON_FONT_FAMILY = "icons";

export const IconMap = {
  threedotAlt: 0xe81e,
  eyeOff: 0xe833,
  eye: 0xe841,
  regentSprinke: 0xe806,
  document: 0xe808,
  pencil: 0xe80a,
  threedot: 0xe81e,
  rightArrow: 0xe801,
  leftArrow: 0xe800,
  rightOpen: 0xf006,
  leftOpen: 0xf007,
  dropDown: 0xf004,
  backArrowLeft: 0xf007,
  alert: 0xe809,
  check: 0xe80b,
  dustbin: 0xe80c,
  lock: 0xe80d,
  userPlaceholder: 0xe80f,
  message: 0xe810,
  phone: 0xe811,
  gender: 0xe812,
  gear: 0xe813,
  exitIcon: 0xe814,
  userRemove: 0xe80e,
  caution: 0xe815,
  cake: 0xe816,
  web: 0xe819,
  location: 0xe817,
  doorExit: 0xe818,
};
export const getIconGlyph = name => {
  const codepoint = typeof name === "number" ? name : IconMap[name];
  return typeof codepoint === "number" ? String.fromCodePoint(codepoint) : "";
};
const Icon = ({ name, color = colors.navy, size = 28, style }) => {
  const glyph = getIconGlyph(name);

  if (!glyph) {
    return null;
  }

  return (
    <MyText
      allowFontScaling={false}
      style={StyleSheet.compose(
        StyleSheet.compose(styles.icon, {
          color,
          fontSize: size,
          lineHeight: size,
        }),
        style,
      )}
    >
      {glyph}
    </MyText>
  );
};
export default Icon;

const styles = StyleSheet.create({
  icon: {
    fontFamily: ICON_FONT_FAMILY,
    includeFontPadding: false,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
