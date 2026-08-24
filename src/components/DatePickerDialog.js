import React, { useEffect, useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors } from "../constants/colors";
import { fontStyles } from "../constants/typography";
import { getDateOnlyValue } from "../utils/date";

export default function DatePickerDialog({
  visible,
  title = "Select Date",
  value,
  maximumDate,
  onCancel,
  onConfirm
}) {
  const [selectedDate, setSelectedDate] = useState(getDateOnlyValue(value));

  useEffect(() => {
    if (visible) {
      setSelectedDate(getDateOnlyValue(value));
    }
  }, [value, visible]);

  function handleChange(event, date) {
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
  }

  function confirmSelection() {
    onConfirm(selectedDate);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
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
              <Pressable onPress={confirmSelection} style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}>
                <Text style={styles.primaryText}>Done</Text>
              </Pressable>
              <Pressable onPress={onCancel} style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}>
                <Text style={styles.secondaryText}>Cancel</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.32)",
    paddingHorizontal: 24
  },
  card: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 8,
    backgroundColor: colors.white,
    padding: 22
  },
  title: {
    color: colors.neutrals900,
    ...fontStyles.lgBold,
    textAlign: "center",
    marginBottom: 14
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16
  },
  primaryAction: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary500
  },
  secondaryAction: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border
  },
  primaryText: {
    color: colors.white,
    ...fontStyles.smRegular
  },
  secondaryText: {
    color: colors.neutrals900,
    ...fontStyles.smRegular
  },
  pressed: {
    opacity: 0.76
  }
});
