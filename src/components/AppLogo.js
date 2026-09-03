import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { font } from "../constants/typography";
import { APP_DISPLAY_NAME } from "../constants/branding";
import { useTheme } from "../context/AppConfigContext";
import MyText from "./MyText";

const arkAiLogo = require("../assets/images/ark-ai-logo.png");

const AppLogo = ({
  variant = "generic",
  size = 108,
  showName = false,
  style,
  logoUrl = null,
  name = "",
}) => {
  const { colors } = useTheme();
  const displayName = name || APP_DISPLAY_NAME;

  if (variant === "crest") {
    return (
      <View style={StyleSheet.compose(styles.crestWrap, style)}>
        <Image
          source={logoUrl ? { uri: logoUrl } : arkAiLogo}
          resizeMode="contain"
          style={StyleSheet.compose(styles.crestImage, {
            width: size,
            height: size,
          })}
        />
        {showName ? (
          <MyText style={StyleSheet.compose(styles.appName, { color: colors.navy })}>
            {displayName}
          </MyText>
        ) : null}
      </View>
    );
  }

  return (
    <View style={StyleSheet.compose(styles.logoWrap, style)}>
      <Image
        source={arkAiLogo}
        resizeMode="contain"
        style={StyleSheet.compose(styles.logoImage, {
          width: size,
          height: size,
        })}
      />
      {showName ? (
        <MyText style={StyleSheet.compose(styles.appName, { color: colors.navy })}>
          {displayName}
        </MyText>
      ) : null}
    </View>
  );
};
export default AppLogo;

const styles = StyleSheet.create({
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 108,
    height: 108,
  },
  appName: {
    marginTop: 28,
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
});
