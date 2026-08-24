import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { colors } from "../constants/colors";
import { font, weights } from "../constants/typography";
import MyText from "./MyText";
const AppLogo = ({
  variant = "generic",
  size = 108,
  showName = false,
  style,
  logoUrl = null,
}) => {
  if (variant === "crest") {
    return (
      <View style={[styles.crestWrap, style]}>
        <Image source={{ uri: logoUrl }} style={styles.crestImage} />
      </View>
    );
  }

  return (
    <View style={[styles.logoWrap, style]}>
      <View
        style={[
          styles.logoShadow,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      />
      <View
        style={[
          styles.logoCircle,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <MyText
          style={[styles.logoText, { fontSize: Math.round(size * 0.34) }]}
        >
          logo
        </MyText>
      </View>
      {showName ? <MyText style={styles.appName}>App Name</MyText> : null}
    </View>
  );
};
export default AppLogo;

const styles = StyleSheet.create({
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoShadow: {
    position: "absolute",
    backgroundColor: "#D7D7D7",
    transform: [{ translateX: 12 }, { translateY: -4 }],
  },
  logoCircle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: "#214EBC",
  },
  logoText: {
    color: colors.white,
    fontWeight: weights.medium,
  },
  appName: {
    marginTop: 28,
    color: colors.navy,
    fontFamily: font.serif,
    fontSize: 32,
    textTransform: "uppercase",
  },
  crestWrap: {
    alignItems: "center",
  },
  crestImage: {
    width: 120,
    height: 120,
  },
  crest: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.navy,
    borderWidth: 2,
    borderColor: "#D5A51B",
  },
  crestLetter: {
    color: colors.white,
    fontFamily: font.serif,
    lineHeight: 58,
  },
  crestSmall: {
    color: colors.white,
    fontFamily: font.serif,
    marginTop: -6,
  },
  schoolName: {
    marginTop: 24,
    color: colors.navy,
    fontFamily: font.serif,
    fontSize: 31,
    textTransform: "uppercase",
  },
});
