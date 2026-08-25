import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import ErrorMessage from "../components/ErrorMessage";
import Icon, { IconMap } from "../components/Icons";
import KeyboardAwareScrollScreen from "../components/KeyboardAwareScrollScreen";
import MyText from "../components/MyText";
import { ConfirmationDialog } from "../components/SharedUIComponents";
import { colors } from "../constants/colors";
import { screen } from "../constants/spacing";
import { fontStyles } from "../constants/typography";
import { ROUTES } from "../navigation/routes";
import { resetPassword } from "../services/auth";
import { REQUEST_STATES } from "../types/auth";
import { validateOtp, validatePassword } from "../utils/validation";

const ResetPasswordScreen = ({ navigation, route }) => {
  const email = route?.params?.email || "";
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [successVisible, setSuccessVisible] = useState(false);
  const [state, setState] = useState(REQUEST_STATES.IDLE);

  const clearSensitiveState = () => {
    setOtp("");
    setPassword("");
    setConfirmPassword("");
  };

  const submit = async () => {
    const nextErrors = {
      otp: validateOtp(otp),
      password: validatePassword(password, "New password"),
      confirmPassword: validatePassword(
        confirmPassword,
        "Confirm password",
      ),
    };

    if (!nextErrors.confirmPassword && password !== confirmPassword) {
      nextErrors.confirmPassword =
        "New password and confirm password do not match.";
    }

    setErrors(nextErrors);
    setApiError(null);

    if (Object.values(nextErrors).some(Boolean)) return;

    setState(REQUEST_STATES.LOADING);
    const response = await resetPassword({
      email,
      otp,
      password,
    });
    setState(response.success ? REQUEST_STATES.SUCCESS : REQUEST_STATES.ERROR);

    if (!response.success) {
      setApiError({ message: response.message, detail: response.detail });
      return;
    }

    setSuccessVisible(true);
  };

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollScreen
        style={styles.screen}
        contentContainerStyle={styles.content}
      >
        <View style={styles.copyBlock}>
          <MyText style={styles.title}>Reset Password</MyText>
          <MyText style={styles.subtitle}>
            Enter the OTP sent to {email || "your email"} and choose a new
            password.
          </MyText>
        </View>

        <View style={styles.form}>
          <AppInput
            label="OTP"
            value={otp}
            onChangeText={value => {
              setOtp(value.replace(/[^\d]/g, "").slice(0, 6));
              setErrors(current => ({ ...current, otp: "" }));
              setApiError(null);
            }}
            placeholder="Enter 6 digit OTP"
            keyboardType="number-pad"
            error={errors.otp}
          />

          <AppInput
            label="New Password"
            value={password}
            onChangeText={value => {
              setPassword(value);
              setErrors(current => ({ ...current, password: "" }));
              setApiError(null);
            }}
            placeholder="Enter new password"
            secureTextEntry={!showPassword}
            rightElement={
              <PasswordToggle
                visible={showPassword}
                onPress={() => setShowPassword(value => !value)}
              />
            }
            error={errors.password}
          />

          <AppInput
            label="Re-enter New Password"
            value={confirmPassword}
            onChangeText={value => {
              setConfirmPassword(value);
              setErrors(current => ({ ...current, confirmPassword: "" }));
              setApiError(null);
            }}
            placeholder="Re-enter new password"
            secureTextEntry={!showConfirmPassword}
            rightElement={
              <PasswordToggle
                visible={showConfirmPassword}
                onPress={() => setShowConfirmPassword(value => !value)}
              />
            }
            error={errors.confirmPassword}
          />

          {apiError ? (
            <ErrorMessage
              message={apiError.message}
              detail={apiError.detail}
              compact
            />
          ) : null}
        </View>

        <AppButton
          label="Reset Password"
          onPress={submit}
          loading={state === REQUEST_STATES.LOADING}
          style={styles.button}
        />
      </KeyboardAwareScrollScreen>

      <ConfirmationDialog
        visible={successVisible}
        title="Password Reset"
        message="Your password has been reset successfully."
        confirmLabel="Login"
        destructive={false}
        onConfirm={() => {
          setSuccessVisible(false);
          clearSensitiveState();
          navigation.reset({
            index: 0,
            routes: [{ name: ROUTES.LOGIN, params: { email } }],
          });
        }}
      />
    </View>
  );
};

export default ResetPasswordScreen;

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
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: screen.horizontal,
    paddingTop: 28,
    paddingBottom: 34,
  },
  copyBlock: {
    marginBottom: 25,
  },
  title: {
    color: colors.neutrals900,
    ...fontStyles.lgBold,
  },
  subtitle: {
    color: colors.neutrals900,
    ...fontStyles.smRegular,
    marginTop: 10,
  },
  successText: {
    color: colors.primary500,
    ...fontStyles.xsmRegular,
    marginTop: 12,
  },
  form: {
    gap: 15,
  },
  passwordToggle: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 25,
  },
});
