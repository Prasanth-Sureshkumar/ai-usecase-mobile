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
import { login } from "../services/authService";
import { validateEmail, validatePassword } from "../utils/validation";

export default function LoginScreen({ navigation, route }) {
  const [email, setEmail] = useState(route?.params?.email || "regentsschool@gmail.com");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [state, setState] = useState(REQUEST_STATES.IDLE);

  async function submit() {
    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password)
    };
    setErrors(nextErrors);
    setApiError("");
    if (nextErrors.email || nextErrors.password || state === REQUEST_STATES.LOADING) return;

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
        logoUrl: "https://pub-d423d28126b8427881b12df516c6520a.r2.dev/aebfa2c545d0b0763f0c1767f7920695890ba5a3.png"
      });
    } catch (error) {
      setState(REQUEST_STATES.ERROR);
      setApiError("Unable to login right now. Please try again.");
    }
  }

  return (
    <KeyboardAwareScrollScreen
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <AppLogo size={112} style={styles.logo} />
      <View style={styles.copyBlock}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue to App Name</Text>
      </View>
      <View style={styles.form}>
        <AppInput
          label="Email address"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setErrors((current) => ({ ...current, email: "" }));
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
          onChangeText={(value) => {
            setPassword(value);
            setErrors((current) => ({ ...current, password: "" }));
            setApiError("");
          }}
          placeholder="Enter password"
          secureTextEntry
          error={errors.password}
        />
        {apiError ? <ErrorMessage message={apiError} compact /> : null}
      </View>
      <AppButton label="Login" onPress={submit} loading={state === REQUEST_STATES.LOADING} style={styles.button} />
      <Text style={styles.footerText}>
        New User Login?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("PreLogin", { email })}>
          Click here
        </Text>
      </Text>
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
  logo: {
    marginBottom: 50
  },
  copyBlock: {
    marginBottom: 25
  },
  title: {
    color: colors.neutrals900,
    ...fontStyles.xxlBold,
  },
  subtitle: {
    color: colors.neutrals900,
    ...fontStyles.smRegular,
    marginTop: 10
  },
  form: {
    gap: 15
  },
  button: {
    marginTop: 25
  },
  footerText: {
    color: colors.neutrals900,
    textAlign: "center",
    ...fontStyles.smRegular,
    marginTop: 25,
  },
  link: {
    color: colors.primary500,
    textDecorationLine: "underline"
  }
});
