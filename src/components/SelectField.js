import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { screen } from "../constants/spacing";
import { fontStyles } from "../constants/typography";

export default function SelectField({ label, value, placeholder, editable = true, onPress, error }) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable
        disabled={!editable}
        onPress={onPress}
        style={({ pressed }) => [
          styles.shell,
          !editable && styles.disabledShell,
          error && styles.errorShell,
          pressed && editable && styles.pressed
        ]}
      >
        <Text style={[styles.text, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10
  },
  label: {
    color: colors.neutrals900,
    ...fontStyles.smBold
  },
  shell: {
    height: screen.fieldHeight,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: colors.neutrals300,
    backgroundColor: colors.white,
    paddingHorizontal: 18,
    justifyContent: "center"
  },
  disabledShell: {
    backgroundColor: colors.inputDisabled
  },
  errorShell: {
    borderColor: colors.red
  },
  text: {
    color: colors.text,
    ...fontStyles.mdRegular
  },
  placeholderText: {
    color: colors.neutrals300
  },
  error: {
    color: colors.redText,
    fontSize: 13,
    marginTop: -4
  },
  pressed: {
    opacity: 0.76
  }
});
