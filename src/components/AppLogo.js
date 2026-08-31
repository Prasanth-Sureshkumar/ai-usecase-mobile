import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { font, weights } from "../constants/typography";
import { useTheme } from "../context/AppConfigContext";
import MyText from "./MyText";
const AppLogo = ({
  variant = "generic",
  size = 108,
  showName = false,
  style,
  logoUrl = null,
  name = "",
}) => {
  const { colors } = useTheme();

  if (variant === "crest") {
    return (
      <View style={StyleSheet.compose(styles.crestWrap, style)}>
        {logoUrl ? (
          <Image
            source={{ uri: logoUrl }}
            resizeMode="contain"
            style={StyleSheet.compose(styles.crestImage, {
              width: size,
              height: size,
            })}
          />
        ) : (
          <View
            style={[
              styles.logoCircle,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: colors.primary,
                borderColor: colors.primaryDark,
              },
            ]}
          >
            <MyText
              style={[
                styles.logoText,
                {
                  color: colors.white,
                  fontSize: Math.round(size * 0.24),
                },
              ]}
            >
              logo
            </MyText>
          </View>
        )}
        {showName ? (
          <MyText style={StyleSheet.compose(styles.appName, { color: colors.navy })}>
            {name}
          </MyText>
        ) : null}
      </View>
    );
  }

  return (
    <View style={StyleSheet.compose(styles.logoWrap, style)}>
      <View
        style={StyleSheet.compose(styles.logoShadow, {
          width: size,
          height: size,
          borderRadius: size / 2,
        })}
      />
      <View
        style={StyleSheet.compose(styles.logoCircle, {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primary,
          borderColor: colors.primaryDark,
        })}
      >
        <MyText
          style={StyleSheet.compose(styles.logoText, {
            color: colors.white,
            fontSize: Math.round(size * 0.34),
          })}
        >
          logo
        </MyText>
      </View>
      {showName ? (
        <MyText style={StyleSheet.compose(styles.appName, { color: colors.navy })}>
          {name}
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
  logoShadow: {
    position: "absolute",
    backgroundColor: "#D7D7D7",
    transform: [{ translateX: 12 }, { translateY: -4 }],
  },
  logoCircle: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  logoText: {
    fontWeight: weights.medium,
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
