import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import { ConfirmationDialog } from "../components/SharedUIComponents";
import KeyboardAwareScrollScreen from "../components/KeyboardAwareScrollScreen";
import Icon, { IconMap } from "../components/Icons";
import { colors } from "../constants/colors";
import { screen } from "../constants/spacing";
import { fontStyles } from "../constants/typography";
import { changePassword } from "../services/user";
import { validatePassword } from "../utils/validation";
import MyText from "../components/MyText";
const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const requestChange = () => {
    const nextErrors = {
      currentPassword: validatePassword(currentPassword).replace(
        "Password",
        "Current password",
      ),
      newPassword: validatePassword(newPassword).replace(
        "Password",
        "New password",
      ),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    setConfirmVisible(true);
  };
  const submitChange = async () => {
    setSubmitting(true);
    const response = await changePassword({ currentPassword, newPassword });
    setSubmitting(false);
    setConfirmVisible(false);

    if (!response.success) {
      setErrors(current => ({
        ...current,
        form: response.message || "Unable to change password.",
      }));
      return;
    }

    setSuccessVisible(true);
  };

  return (
    <View style={styles.safe}>
      <KeyboardAwareScrollScreen
        style={styles.safe}
        contentContainerStyle={styles.content}
      >
        <View style={styles.form}>
          <AppInput
            label="Current Password"
            placeholder="Enter current password"
            value={currentPassword}
            secureTextEntry={!showCurrent}
            rightElement={
              <PasswordToggle
                visible={showCurrent}
                onPress={() => setShowCurrent(value => !value)}
              />
            }
            onChangeText={value => {
              setCurrentPassword(value);
              setErrors(current => ({
                ...current,
                currentPassword: "",
                form: "",
              }));
            }}
            error={errors.currentPassword}
          />

          <AppInput
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            secureTextEntry={!showNew}
            rightElement={
              <PasswordToggle
                visible={showNew}
                onPress={() => setShowNew(value => !value)}
              />
            }
            onChangeText={value => {
              setNewPassword(value);
              setErrors(current => ({ ...current, newPassword: "", form: "" }));
            }}
            error={errors.newPassword}
          />

          {errors.form ? (
            <MyText style={styles.formError}>{errors.form}</MyText>
          ) : null}
        </View>
        <AppButton
          label="Change Password"
          onPress={requestChange}
          disabled={submitting}
          loading={submitting}
          style={styles.button}
        />
      </KeyboardAwareScrollScreen>
      <ConfirmationDialog
        visible={confirmVisible}
        title="Change Password"
        message="Are you sure you want to change your password?"
        confirmLabel="Change"
        loading={submitting}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={submitChange}
      />

      <ConfirmationDialog
        visible={successVisible}
        title="Password Changed"
        message="Your password has been changed successfully."
        confirmLabel="Done"
        destructive={false}
        onConfirm={() => {
          setSuccessVisible(false);
          navigation.goBack();
        }}
      />
    </View>
  );
};
export default ChangePasswordScreen;
const PasswordToggle = ({ visible, onPress }) => {
  return (
    <Pressable onPress={onPress} hitSlop={10} style={styles.passwordToggle}>
      <Icon
        name={visible ? IconMap.eyeOff : IconMap.eye}
        color={colors.neutrals900}
        size={20}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: screen.horizontal,
    paddingTop: 28,
    paddingBottom: 34,
  },
  form: {
    gap: 12,
  },
  passwordToggle: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  formError: {
    color: colors.redText,
    ...fontStyles.smRegular,
  },
  button: {
    marginTop: 24,
  },
});
