import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { colors } from "../constants/colors";
import { fontStyles } from "../constants/typography";
import MyText from "./MyText";
const OptionPickerDialog = ({
  visible,
  title,
  options,
  onCancel,
  onSelect,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <MyText style={styles.title}>{title}</MyText>
          {options.map(option => (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={({ pressed }) => [
                styles.optionRow,
                pressed && styles.pressed,
              ]}
            >
              <MyText style={styles.optionText}>{option.label}</MyText>
            </Pressable>
          ))}
          <Pressable onPress={onCancel} style={styles.cancelAction}>
            <MyText style={styles.cancelText}>Cancel</MyText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
export default OptionPickerDialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.32)",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 8,
    backgroundColor: colors.white,
    padding: 22,
  },
  title: {
    color: colors.neutrals900,
    ...fontStyles.lgBold,
    textAlign: "center",
    marginBottom: 16,
  },
  optionRow: {
    minHeight: 50,
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  optionText: {
    color: colors.neutrals900,
    ...fontStyles.mdRegular,
  },
  cancelAction: {
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
    paddingHorizontal: 24,
  },
  cancelText: {
    color: colors.neutrals900,
    ...fontStyles.smRegular,
  },
  pressed: {
    opacity: 0.76,
  },
});
