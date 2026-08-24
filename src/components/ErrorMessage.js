import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../constants/colors";
import { fontStyles } from "../constants/typography";
import Icon, { IconMap } from "./Icons";
import MyText from "./MyText";
const ErrorMessage = ({ message, detail, compact = false }) => {
  if (!message) return null;
  return (
    <View style={[styles.errorBox, compact && styles.compactBox]}>
      <Icon
        name={IconMap.alert}
        color={colors.red700}
        size={25}
        style={styles.icon}
      />
      <MyText style={styles.message}>{message}</MyText>
      {detail ? <MyText style={styles.detail}>{detail}</MyText> : null}
    </View>
  );
};
export default ErrorMessage;

const styles = StyleSheet.create({
  errorBox: {
    minHeight: 102,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.red700,
    backgroundColor: colors.redSoft,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  compactBox: {
    minHeight: 74,
    paddingVertical: 16,
  },
  icon: {
    paddingHorizontal: 2,
  },
  message: {
    flex: 1,
    color: colors.red700,
    ...fontStyles.smRegular,
  },
  detail: {
    color: colors.neutrals900,
    ...fontStyles.smRegular,
    textAlign: "center",
  },
});
