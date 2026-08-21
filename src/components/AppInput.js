import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../constants/colors";
import { screen } from "../constants/spacing";
import { fontStyles } from "../constants/typography";
import { useKeyboardAwareScroll } from "./KeyboardAwareScrollScreen";
import Icon, { IconMap } from "./Icons";

export default function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  editable = true,
  secureTextEntry,
  keyboardType,
  autoCapitalize = "none",
  rightIcon,
  onRightPress,
  rightElement,
  onFocus,
  error
}) {
  const { scheduleScrollToFocusedInput } = useKeyboardAwareScroll();

  function handleFocus(event) {
    onFocus?.(event);
    scheduleScrollToFocusedInput();
  }

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputShell, !editable && styles.disabledShell, error && styles.errorShell]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.neutrals300}
          editable={editable}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          onFocus={handleFocus}
          style={styles.input}
        />
        {rightIcon === "edit" ? (
          <Pressable onPress={onRightPress} hitSlop={10}>
            <Icon name={IconMap.pencil} color={colors.neutrals900} size={18} />
          </Pressable>
        ) : null}
        {rightElement || null}
      </View>
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
    ...fontStyles.smBold,
  },
  inputShell: {
    height: screen.fieldHeight,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: colors.neutrals300,
    backgroundColor: colors.white,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center"
  },
  disabledShell: {
    backgroundColor: colors.inputDisabled
  },
  errorShell: {
    borderColor: colors.red
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 18,
    paddingVertical: 0
  },
  error: {
    color: colors.redText,
    fontSize: 13,
    marginTop: -4
  }
});
