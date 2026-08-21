import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import { ConfirmationDialog, PROFILE_USER } from "../components/SharedUIComponents";
import KeyboardAwareScrollScreen from "../components/KeyboardAwareScrollScreen";
import { colors } from "../constants/colors";
import { screen } from "../constants/spacing";
import { fontStyles } from "../constants/typography";
import { updatePersonalInformation } from "../services/authService";
import { validateEmail, validateRequired } from "../utils/validation";

export default function EditPersonalInfoScreen({ navigation, route }) {
  const initialProfile = route.params?.profile || PROFILE_USER;
  const [dateOfBirth, setDateOfBirth] = useState(initialProfile.dateOfBirth || "");
  const [gender, setGender] = useState(initialProfile.gender || "");
  const [phone, setPhone] = useState(initialProfile.phone || "");
  const [email, setEmail] = useState(initialProfile.email || "");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  async function submit() {
    const nextErrors = {
      dateOfBirth: validateRequired(dateOfBirth, "Date of birth"),
      gender: validateRequired(gender, "Gender"),
      phone: validateRequired(phone, "Phone"),
      email: validateEmail(email)
    };

    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean) || saving) return;

    setSaving(true);
    const nextProfile = {
      ...initialProfile,
      dateOfBirth,
      gender,
      phone,
      email
    };
    const response = await updatePersonalInformation(nextProfile);
    setSaving(false);

    if (!response.success) {
      setErrors((current) => ({ ...current, form: response.message || "Unable to save details." }));
      return;
    }

    setSuccessVisible(true);
  }

  function closeSuccess() {
    const nextProfile = {
      ...initialProfile,
      dateOfBirth,
      gender,
      phone,
      email
    };
    setSuccessVisible(false);
    navigation.popTo("ProfileInfo", {
      profile: nextProfile,
      title: nextProfile.fullName,
    });
  }

  return (
    <View style={styles.safe}>
      <KeyboardAwareScrollScreen
        style={styles.safe}
        contentContainerStyle={styles.content}
      >
        <View style={styles.form}>
          <AppInput
            label="Date of birth"
            placeholder="DD/MM/YYYY"
            value={dateOfBirth}
            onChangeText={(value) => {
              setDateOfBirth(value);
              setErrors((current) => ({ ...current, dateOfBirth: "", form: "" }));
            }}
            error={errors.dateOfBirth}
          />
          <AppInput
            label="Gender"
            placeholder="Enter gender"
            value={gender}
            onChangeText={(value) => {
              setGender(value);
              setErrors((current) => ({ ...current, gender: "", form: "" }));
            }}
            error={errors.gender}
          />
          <AppInput
            label="Phone"
            placeholder="Enter phone number"
            value={phone}
            keyboardType="phone-pad"
            onChangeText={(value) => {
              setPhone(value);
              setErrors((current) => ({ ...current, phone: "", form: "" }));
            }}
            error={errors.phone}
          />
          <AppInput
            label="Email"
            placeholder="Enter email address"
            value={email}
            keyboardType="email-address"
            onChangeText={(value) => {
              setEmail(value);
              setErrors((current) => ({ ...current, email: "", form: "" }));
            }}
            error={errors.email}
          />
          {errors.form ? <Text style={styles.formError}>{errors.form}</Text> : null}
        </View>
        <AppButton
          label="Save"
          loading={saving}
          disabled={saving}
          onPress={submit}
          style={styles.button}
        />
      </KeyboardAwareScrollScreen>
      <ConfirmationDialog
        visible={successVisible}
        title="Saved"
        message="Your personal information has been updated successfully."
        confirmLabel="Done"
        cancelLabel="Close"
        destructive={false}
        onConfirm={closeSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: screen.horizontal,
    paddingTop: 28,
    paddingBottom: 34
  },
  form: {
    gap: 18
  },
  formError: {
    color: colors.redText,
    ...fontStyles.smRegular
  },
  button: {
    marginTop: 30
  }
});
