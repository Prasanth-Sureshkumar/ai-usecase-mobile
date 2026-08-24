import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import AppLogo from "../components/AppLogo";
import ErrorMessage from "../components/ErrorMessage";
import KeyboardAwareScrollScreen from "../components/KeyboardAwareScrollScreen";
import { colors } from "../constants/colors";
import { screen } from "../constants/spacing";
import { fontStyles } from "../constants/typography";
import { REQUEST_STATES } from "../types/auth";
import { login } from "../services/auth";
import { validateEmail, validateRequired } from "../utils/validation";
import { POST_AUTH_LOGO_URL } from "../constants/branding";
import MyText from "../components/MyText";
const LoginScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState(
    route?.params?.email || "regentsschool@gmail.com",
  );
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [state, setState] = useState(REQUEST_STATES.IDLE);
  const submit = async () => {
    const nextErrors = {
      email: validateEmail(email),
      password: validateRequired(password, "Password"),
    };
    setErrors(nextErrors);
    setApiError("");
    if (
      nextErrors.email ||
      nextErrors.password ||
      state === REQUEST_STATES.LOADING
    )
      return;

    try {
      setState(REQUEST_STATES.LOADING);
      const response = await login(email, password);
      if (!response.success) {
        setState(REQUEST_STATES.ERROR);
        setApiError(response.message || "Login failed. Please try again.");
        return;
      }
      setState(REQUEST_STATES.SUCCESS);
      navigation.replace("PostAuthSplash", {
        logoUrl: POST_AUTH_LOGO_URL,
      });
    } catch (error) {
      setState(REQUEST_STATES.ERROR);
      setApiError("Unable to login right now. Please try again.");
    }
  };

  return (
    <KeyboardAwareScrollScreen
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <AppLogo size={112} style={styles.logo} />
      <View style={styles.copyBlock}>
        <MyText style={styles.title}>Welcome Back!</MyText>
        <MyText style={styles.subtitle}>Sign in to continue to App Name</MyText>
      </View>
      <View style={styles.form}>
        <AppInput
          label="Email address"
          value={email}
          onChangeText={value => {
            setEmail(value);
            setErrors(current => ({ ...current, email: "" }));
            setApiError("");
          }}
          placeholder="Enter email address"
          keyboardType="email-address"
          rightIcon="edit"
          error={errors.email}
        />

        <AppInput
          label="Password"
          value={password}
          onChangeText={value => {
            setPassword(value);
            setErrors(current => ({ ...current, password: "" }));
            setApiError("");
          }}
          placeholder="Enter password"
          secureTextEntry
          error={errors.password}
        />

        {apiError ? <ErrorMessage message={apiError} compact /> : null}
      </View>
      <AppButton
        label="Login"
        onPress={submit}
        loading={state === REQUEST_STATES.LOADING}
        style={styles.button}
      />
      <MyText style={styles.footerText}>
        New User Login?{" "}
        <MyText
          style={styles.link}
          onPress={() => navigation.navigate("PreLogin", { email })}
        >
          Click here
        </MyText>
      </MyText>
    </KeyboardAwareScrollScreen>
  );
};
export default LoginScreen;

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
  logo: {
    marginBottom: 50,
  },
  copyBlock: {
    marginBottom: 25,
  },
  title: {
    color: colors.neutrals900,
    ...fontStyles.xxlBold,
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
  footerText: {
    color: colors.neutrals900,
    textAlign: "center",
    ...fontStyles.smRegular,
    marginTop: 25,
  },
  link: {
    color: colors.primary500,
    textDecorationLine: "underline",
  },
});
