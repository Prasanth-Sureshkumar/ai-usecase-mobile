import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CircleAlert } from "lucide-react-native";
import { colors } from "../constants/colors";
import { fontStyles } from "../constants/typography";

export default function ErrorMessage({ message, detail, compact = false }) {
  if (!message) return null;
  return (
    <View style={[styles.errorBox, compact && styles.compactBox]}>
      <CircleAlert size={34} color={colors.red} fill={colors.red} stroke={colors.white} strokeWidth={2.4} />
      <Text style={styles.message}>{message}</Text>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
    </View>
  );
}

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
    gap: 15
  },
  compactBox: {
    minHeight: 74,
    paddingVertical: 16
  },
  message: {
    flex: 1,
    color: colors.red700,
    ...fontStyles.smRegular,
  },
  detail: {
    color: colors.neutrals900,
    ...fontStyles.smRegular,
    textAlign: "center"
  }
});
