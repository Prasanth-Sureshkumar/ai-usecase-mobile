import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

export default function LoadingIndicator({ label = "Loading..." }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={colors.primary500} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: colors.white
  },
  text: {
    color: colors.muted,
    fontSize: 15
  }
});
