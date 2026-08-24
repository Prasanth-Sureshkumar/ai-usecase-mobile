import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "../constants/colors";
import MyText from "./MyText";
const LoadingIndicator = ({ label = "Loading..." }) => {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={colors.primary500} />
      <MyText style={styles.text}>{label}</MyText>
    </View>
  );
};
export default LoadingIndicator;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: colors.white,
  },
  text: {
    color: colors.muted,
    fontSize: 15,
  },
});
