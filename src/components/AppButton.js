import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { colors } from "../constants/colors";
import { screen } from "../constants/spacing";
import { weights } from "../constants/typography";

export default function AppButton({ label, onPress, disabled, loading, icon = false, style }) {
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && !loading && styles.pressed,
        style
      ]}
    >
      {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.text}>{label}</Text>}
      {!loading && icon ? <ArrowRight size={22} color={colors.white} strokeWidth={1.8} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: screen.buttonHeight,
    borderRadius: 29,
    backgroundColor: colors.primary500,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12
  },
  pressed: {
    opacity: 0.86
  },
  disabled: {
    opacity: 0.62
  },
  text: {
    color: colors.white,
    fontSize: 18,
    fontWeight: weights.regular
  }
});
