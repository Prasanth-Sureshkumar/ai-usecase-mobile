import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import AppLogo from "../components/AppLogo";
import ErrorMessage from "../components/ErrorMessage";
import KeyboardAwareScrollScreen from "../components/KeyboardAwareScrollScreen";
import { colors } from "../constants/colors";
import { screen } from "../constants/spacing";
import { fontStyles } from "../constants/typography";
import { REQUEST_STATES } from "../types/auth";
import { validateEmail } from "../utils/validation";
import { validatePreLogin } from "../services/authService";

export default function PreLoginScreen({ navigation, route }) {
  const [email, setEmail] = useState(route?.params?.email || "");
  const [emailError, setEmailError] = useState("");
  const [apiError, setApiError] = useState(null);
  const [state, setState] = useState(REQUEST_STATES.IDLE);
  const showHeader = Boolean(route?.params?.showHeader);

  async function submit() {
    const validationError = validateEmail(email);
    setEmailError(validationError);
    setApiError(null);
    if (validationError || state === REQUEST_STATES.LOADING) return;

    try {
      setState(REQUEST_STATES.LOADING);
      const response = await validatePreLogin(email);
      if (!response.success) {
        setState(REQUEST_STATES.ERROR);
        setApiError({ message: response.message, detail: response.detail });
        return;
      }

      setState(REQUEST_STATES.SUCCESS);
      navigation.navigate(response.userExists ? "Login" : "Register", {
        email: email.trim().toLowerCase()
      });
    } catch (error) {
      setState(REQUEST_STATES.ERROR);
      setApiError({ message: "Something went wrong. Please try again." });
    }
  }

  function clearForEdit(value) {
    setEmail(value);
    setEmailError("");
    setApiError(null);
    if (state === REQUEST_STATES.ERROR) setState(REQUEST_STATES.IDLE);
  }

  return (
    <KeyboardAwareScrollScreen
      style={styles.screen}
      contentContainerStyle={[styles.content, showHeader && styles.contentWithHeader]}
    >
      <AppLogo size={showHeader ? 110 : 112} style={styles.logo} />
      <View style={styles.copyBlock}>
        <Text style={styles.title}>Welcome to{"\n"}App Name</Text>
        <Text style={styles.subtitle}>Enter your email and access code to continue</Text>
      </View>
      <View style={styles.form}>
        <AppInput
          label="Email address"
          value={email}
          onChangeText={clearForEdit}
          placeholder="Enter email address"
          keyboardType="email-address"
          rightIcon={showHeader ? "edit" : undefined}
          error={emailError}
        />
        {apiError ? <ErrorMessage message={apiError.message} compact /> : null}
      </View>
      {apiError?.detail ? <Text style={styles.detail}>{apiError.detail}</Text> : null}
      <AppButton
        label={apiError ? "Try Again" : "Continue"}
        icon={!apiError}
        onPress={submit}
        loading={state === REQUEST_STATES.LOADING}
        style={styles.button}
      />
      {!showHeader && !apiError ? (
        <Text style={styles.footerText}>
          Existing User Login?{" "}
          <Text style={styles.link} onPress={() => navigation.navigate("Login", { email })}>
            Click here
          </Text>
        </Text>
      ) : null}
    </KeyboardAwareScrollScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: screen.horizontal,
    justifyContent: "center"
  },
  contentWithHeader: {
    paddingTop: 66
  },
  logo: {
    marginBottom: 50
  },
  copyBlock: {
    marginBottom: 25,
    gap: 10,
  },
  title: {
    color: colors.neutrals900,
    ...fontStyles.xxlBold
  },
  subtitle: {
    color: colors.neutrals900,
    ...fontStyles.smRegular,
  },
  form: {
    gap: 25
  },
  button: {
    marginTop: 25
  },
  footerText: {
    color: colors.neutrals900,
    ...fontStyles.smRegular,
    textAlign: "center",
    marginTop: 25,
  },
  link: {
    color: colors.primary500,
    textDecorationLine: "underline"
  },
  detail: {
    color: colors.neutrals900,
    textAlign: "center",
    ...fontStyles.smRegular,
    marginTop: 25,
    marginHorizontal: 8
  }
});
