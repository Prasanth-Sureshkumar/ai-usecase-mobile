import React, { useEffect, useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors } from "../constants/colors";
import { fontStyles } from "../constants/typography";
import { getDateOnlyValue } from "../utils/date";
import MyText from "./MyText";
const DatePickerDialog = ({
  visible,
  title = "Select Date",
  value,
  maximumDate,
  onCancel,
  onConfirm,
}) => {
  const [selectedDate, setSelectedDate] = useState(getDateOnlyValue(value));

  useEffect(() => {
    if (visible) {
      setSelectedDate(getDateOnlyValue(value));
    }
  }, [value, visible]);
  const handleChange = (event, date) => {
    if (Platform.OS === "android") {
      if (event.type === "set" && date) {
        onConfirm(date);
      } else {
        onCancel();
      }
      return;
    }

    if (date) {
      setSelectedDate(date);
    }
  };
  const confirmSelection = () => {
    onConfirm(selectedDate);
  };

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
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={maximumDate}
            onChange={handleChange}
            textColor={colors.neutrals900}
          />

          {Platform.OS === "ios" ? (
            <View style={styles.actions}>
              <Pressable
                onPress={confirmSelection}
                style={({ pressed }) => [
                  styles.primaryAction,
                  pressed && styles.pressed,
                ]}
              >
                <MyText style={styles.primaryText}>Done</MyText>
              </Pressable>
              <Pressable
                onPress={onCancel}
                style={({ pressed }) => [
                  styles.secondaryAction,
                  pressed && styles.pressed,
                ]}
              >
                <MyText style={styles.secondaryText}>Cancel</MyText>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};
export default DatePickerDialog;

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
    marginBottom: 14,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  primaryAction: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary500,
  },
  secondaryAction: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryText: {
    color: colors.white,
    ...fontStyles.smRegular,
  },
  secondaryText: {
    color: colors.neutrals900,
    ...fontStyles.smRegular,
  },
  pressed: {
    opacity: 0.76,
  },
});
