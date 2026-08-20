import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Check } from "lucide-react-native";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import ErrorMessage from "../components/ErrorMessage";
import KeyboardAwareScrollScreen from "../components/KeyboardAwareScrollScreen";
import { colors } from "../constants/colors";
import { screen } from "../constants/spacing";
import { fontStyles, weights } from "../constants/typography";
import { REQUEST_STATES } from "../types/auth";
import { register, sendOtp } from "../services/authService";
import { validateEmail, validateOtp, validatePassword, validateRequired } from "../utils/validation";

export default function RegisterScreen({ navigation, route }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: route?.params?.email || "regentsschool@gmail.com",
    otp: "",
    password: ""
  });
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [state, setState] = useState(REQUEST_STATES.IDLE);
  const [otpState, setOtpState] = useState(REQUEST_STATES.IDLE);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
    setApiError("");
  }

  async function handleSendOtp() {
    const emailError = validateEmail(form.email);
    setErrors((current) => ({ ...current, email: emailError }));
    if (emailError || otpState === REQUEST_STATES.LOADING) return;

    setOtpState(REQUEST_STATES.LOADING);
    const response = await sendOtp(form.email);
    setOtpState(response.success ? REQUEST_STATES.SUCCESS : REQUEST_STATES.ERROR);
    if (!response.success) setApiError(response.message);
  }

  async function submit() {
    const nextErrors = {
      firstName: validateRequired(form.firstName, "First Name"),
      lastName: validateRequired(form.lastName, "Last Name"),
      email: validateEmail(form.email),
      otp: validateOtp(form.otp),
      password: validatePassword(form.password),
      terms: accepted ? "" : "Please accept the Terms & Conditions."
    };
    setErrors(nextErrors);
    setApiError("");
    if (Object.values(nextErrors).some(Boolean) || state === REQUEST_STATES.LOADING) return;

    try {
      setState(REQUEST_STATES.LOADING);
      const response = await register(form);
      if (!response.success) {
        setState(REQUEST_STATES.ERROR);
        setApiError(response.message || "Unable to create account.");
        return;
      }
      setState(REQUEST_STATES.SUCCESS);
      navigation.replace("RegistrationSuccess");
    } catch (error) {
      setState(REQUEST_STATES.ERROR);
      setApiError("Unable to create account. Please try again.");
    }
  }

  return (
    <KeyboardAwareScrollScreen
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <View style={styles.form}>
        <AppInput label="First Name*" value={form.firstName} onChangeText={(value) => updateField("firstName", value)} placeholder="Enter your first name" autoCapitalize="words" error={errors.firstName} />
        <AppInput label="Last Name*" value={form.lastName} onChangeText={(value) => updateField("lastName", value)} placeholder="Enter your last name" autoCapitalize="words" error={errors.lastName} />
        <AppInput label="Email address" value={form.email} onChangeText={(value) => updateField("email", value)} placeholder="Enter email address" keyboardType="email-address" editable={false} error={errors.email} />
        <View>
          <AppInput label="OTP*" value={form.otp} onChangeText={(value) => updateField("otp", value.replace(/[^\d]/g, "").slice(0, 6))} placeholder="Enter 6 digit Otp" keyboardType="number-pad" error={errors.otp} />
          <Pressable onPress={handleSendOtp} disabled={otpState === REQUEST_STATES.LOADING} style={styles.sendOtp}>
            <Text style={styles.sendOtpText}>{otpState === REQUEST_STATES.LOADING ? "Sending..." : "Send OTP"}</Text>
          </Pressable>
        </View>
        <AppInput label="Set Password*" value={form.password} onChangeText={(value) => updateField("password", value)} placeholder="Enter password" secureTextEntry error={errors.password} />
        <Pressable onPress={() => setAccepted((value) => !value)} style={styles.termsRow}>
          <View style={[styles.checkbox, accepted && styles.checkboxActive]}>
            {accepted ? <Check size={16} color={colors.white} strokeWidth={3} /> : null}
          </View>
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text>
          </Text>
        </Pressable>
        {errors.terms ? <Text style={styles.termsError}>{errors.terms}</Text> : null}
        {apiError ? <ErrorMessage message={apiError} compact /> : null}
      </View>
      <AppButton label="Create Account" onPress={submit} loading={state === REQUEST_STATES.LOADING} style={styles.button} />
    </KeyboardAwareScrollScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white
  },
  content: {
    paddingHorizontal: screen.horizontal,
    paddingVertical: 30
  },
  form: {
    gap: 15
  },
  sendOtp: {
    alignSelf: "flex-end",
    paddingTop: 12,
    paddingBottom: 4
  },
  sendOtpText: {
    color: colors.primary500,
    ...fontStyles.smBold,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.neutrals300,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center"
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  termsText: {
    color: colors.neutrals900,
    ...fontStyles.smRegular,
  },
  termsLink: {
    color: colors.primary500,
    fontWeight: weights.bold
  },
  termsError: {
    color: colors.red700,
    ...fontStyles.smRegular,
    marginTop: -12
  },
  button: {
    marginTop: 25,
  }
});
