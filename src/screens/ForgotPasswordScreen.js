import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import ErrorMessage from "../components/ErrorMessage";
import KeyboardAwareScrollScreen from "../components/KeyboardAwareScrollScreen";
import MyText from "../components/MyText";
import { colors } from "../constants/colors";
import { screen } from "../constants/spacing";
import { fontStyles } from "../constants/typography";
import { ROUTES } from "../navigation/routes";
import { forgotPassword } from "../services/auth";
import { REQUEST_STATES } from "../types/auth";
import { validateEmail } from "../utils/validation";

const ForgotPasswordScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState(route?.params?.email || "");
  const [emailError, setEmailError] = useState("");
  const [apiError, setApiError] = useState(null);
  const [state, setState] = useState(REQUEST_STATES.IDLE);

  const submit = async () => {
    const validationError = validateEmail(email);
    setEmailError(validationError);
    setApiError(null);

    if (validationError || state === REQUEST_STATES.LOADING) return;

    setState(REQUEST_STATES.LOADING);
    const response = await forgotPassword(email);
    setState(response.success ? REQUEST_STATES.SUCCESS : REQUEST_STATES.ERROR);

    if (!response.success) {
      setApiError({ message: response.message, detail: response.detail });
      return;
    }

    navigation.navigate(ROUTES.RESET_PASSWORD, {
      email: email.trim().toLowerCase(),
      message: response.message,
    });
  };

  return (
    <KeyboardAwareScrollScreen
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <View style={styles.copyBlock}>
        <MyText style={styles.title}>Forgot Password?</MyText>
        <MyText style={styles.subtitle}>
          Enter your email address to receive a reset OTP.
        </MyText>
      </View>

      <View style={styles.form}>
        <AppInput
          label="Email address"
          value={email}
          onChangeText={value => {
            setEmail(value);
            setEmailError("");
            setApiError(null);
          }}
          placeholder="Enter email address"
          keyboardType="email-address"
          error={emailError}
        />

        {apiError ? (
          <ErrorMessage
            message={apiError.detail || apiError.message}
            compact
          />
        ) : null}
      </View>

      <AppButton
        label="Send OTP"
        onPress={submit}
        loading={state === REQUEST_STATES.LOADING}
        style={styles.button}
      />
    </KeyboardAwareScrollScreen>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: screen.horizontal,
    justifyContent: "center",
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
  form: {
    gap: 15,
  },
  button: {
    marginTop: 25,
  },
});
