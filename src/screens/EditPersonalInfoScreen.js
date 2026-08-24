import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import DatePickerDialog from "../components/DatePickerDialog";
import KeyboardAwareScrollScreen from "../components/KeyboardAwareScrollScreen";
import LoadingIndicator from "../components/LoadingIndicator";
import OptionPickerDialog from "../components/OptionPickerDialog";
import SelectField from "../components/SelectField";
import { ConfirmationDialog } from "../components/SharedUIComponents";
import { colors } from "../constants/colors";
import { screen } from "../constants/spacing";
import { fontStyles } from "../constants/typography";
import { useUser } from "../context/UserContext";
import { updatePersonalInformation } from "../services/user";
import { formatDateOnly, getDateOnlyValue } from "../utils/date";
import { getDisplayDate } from "../utils/profile";

const GENDER_OPTIONS = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" }
];

export default function EditPersonalInfoScreen({ navigation }) {
  const { user, setUser, refreshUser, loading } = useUser();
  const canEditDateOfBirth = !user?.dateOfBirth;
  const canEditGender = !user?.gender;
  const [form, setForm] = useState({
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    email: ""
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [genderPickerVisible, setGenderPickerVisible] = useState(false);

  useEffect(() => {
    setForm({
      dateOfBirth: user?.dateOfBirth ? formatDateOnly(getDateOnlyValue(user.dateOfBirth, null)) : "",
      gender: user?.gender || "",
      phoneNumber: user?.phoneNumber || "",
      email: user?.email || ""
    });
  }, [user]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "", form: "" }));
  }

  async function submit() {
    if (saving) return;

    setErrors({});
    const payload = {
      phoneNumber: form.phoneNumber.trim() || null
    };

    if (canEditDateOfBirth && form.dateOfBirth) {
      payload.dateOfBirth = form.dateOfBirth;
    }

    if (canEditGender && form.gender) {
      payload.gender = form.gender;
    }

    setSaving(true);
    const response = await updatePersonalInformation(payload);
    setSaving(false);

    if (!response.success) {
      setErrors({ form: response.message || "Unable to save details." });
      return;
    }

    if (response.data) {
      setUser(response.data);
    } else {
      await refreshUser();
    }

    setSuccessVisible(true);
  }

  function closeSuccess() {
    setSuccessVisible(false);
    navigation.goBack();
  }

  const getMaximumDateOfBirth = () => {
    const today = new Date();
    return new Date(
      today.getFullYear() - 13,
      today.getMonth(),
      today.getDate()
    );
  };

  if (loading && !user) {
    return <LoadingIndicator label="Loading profile..." />;
  }

  return (
    <View style={styles.safe}>
      <KeyboardAwareScrollScreen
        style={styles.safe}
        contentContainerStyle={styles.content}
      >
        <View style={styles.form}>
          <SelectField
            label="Date of birth"
            value={getDisplayDate(form.dateOfBirth)}
            placeholder="Select date of birth"
            editable={canEditDateOfBirth}
            onPress={() => setDatePickerVisible(true)}
            error={errors.dateOfBirth}
          />
          <SelectField
            label="Gender"
            value={form.gender}
            placeholder="Select gender"
            editable={canEditGender}
            onPress={() => setGenderPickerVisible(true)}
            error={errors.gender}
          />
          <AppInput
            label="Phone"
            placeholder="Enter phone number"
            value={form.phoneNumber}
            keyboardType="phone-pad"
            onChangeText={(value) => updateField("phoneNumber", value)}
            error={errors.phoneNumber}
          />
          <AppInput
            label="Email"
            placeholder="Enter email address"
            value={form.email}
            keyboardType="email-address"
            editable={false}
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

      <DatePickerDialog
        visible={datePickerVisible}
        title="Select Date of Birth"
        value={form.dateOfBirth}
        maximumDate={getMaximumDateOfBirth()}
        onCancel={() => setDatePickerVisible(false)}
        onConfirm={(date) => {
          updateField("dateOfBirth", formatDateOnly(date));
          setDatePickerVisible(false);
        }}
      />
      <OptionPickerDialog
        visible={genderPickerVisible}
        title="Select Gender"
        options={GENDER_OPTIONS}
        onCancel={() => setGenderPickerVisible(false)}
        onSelect={(value) => {
          updateField("gender", value);
          setGenderPickerVisible(false);
        }}
      />
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
