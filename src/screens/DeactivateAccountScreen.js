import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
  ConfirmationDialog,
  GlyphBadge,
} from "../components/SharedUIComponents";
import { colors } from "../constants/colors";
import { fontStyles } from "../constants/typography";
import { deactivateAccount } from "../services/user";
import { IconMap } from "../components/Icons";
import { useUser } from "../context/UserContext";
import { useAppConfig, useTheme } from "../context/AppConfigContext";
import MyText from "../components/MyText";
import { ROUTES } from "../navigation/routes";
import ErrorMessage from "../components/ErrorMessage";
const DeactivateAccountScreen = ({ navigation }) => {
  const { setUser } = useUser();
  const { clearAppConfig, organization } = useAppConfig();
  const { colors: themeColors } = useTheme();
  const organizationName = organization?.name || "your organization";
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const confirmDeactivate = async () => {
    if (submitting) return;

    setSubmitting(true);
    setApiError("");
    const response = await deactivateAccount();
    setSubmitting(false);
    setConfirmVisible(false);

    if (!response.success) {
      setApiError(response.message || "Unable to deactivate account.");
      return;
    }

    setUser(null);
    clearAppConfig();
    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.PRE_LOGIN }],
    });
  };

  return (
    <View style={[styles.safe, { backgroundColor: themeColors.white }]}>
      <View style={styles.content}>
        <View style={styles.centerCopy}>
          <GlyphBadge
            iconName={IconMap.dustbin}
            color={themeColors.primary500}
            outerRadius={95}
            backgroundColor={themeColors.primary100}
          />
          <MyText style={[styles.title, { color: themeColors.neutrals900 }]}>
            Deactivate Your Account?
          </MyText>
          <MyText style={[styles.message, { color: themeColors.neutrals900 }]}>
            You are about to start the process of deactivating your{" "}
            {organizationName} account. Your profile name and information will
            no longer be viewable within the app.
          </MyText>
          <MyText style={[styles.message, { color: themeColors.neutrals900 }]}>
            You will, however, be able to retrieve your data upon logging back
            in within 90 days of willingly or accidentally deactivating your
            account.
          </MyText>
        </View>

        <View style={styles.footerContainer}>
          {apiError ? <ErrorMessage message={apiError} compact /> : null}
          <View style={styles.footer}>
            <Pressable
              disabled={submitting}
              onPress={() => {
                setApiError("");
                setConfirmVisible(true);
              }}
              style={({ pressed }) =>
                StyleSheet.compose(
                  [
                    styles.continueButton,
                    { backgroundColor: themeColors.redText },
                  ],
                  pressed && styles.pressed,
                )
              }
            >
              <MyText
                style={[styles.continueText, { color: themeColors.white }]}
              >
                Continue
              </MyText>
            </Pressable>
            <Pressable
              disabled={submitting}
              onPress={() => navigation.goBack()}
              style={({ pressed }) =>
                StyleSheet.compose(
                  [styles.cancelButton, { borderColor: themeColors.border }],
                  pressed && styles.pressed,
                )
              }
            >
              <MyText
                style={[styles.cancelText, { color: themeColors.neutrals900 }]}
              >
                Cancel
              </MyText>
            </Pressable>
          </View>
        </View>
      </View>
      <ConfirmationDialog
        visible={confirmVisible}
        title="Are you sure?"
        message="Do you really want to deactivate your account? You will lose access to Ark AI."
        confirmLabel="Yes, Deactivate"
        loading={submitting}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={confirmDeactivate}
      />
    </View>
  );
};
export default DeactivateAccountScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 130,
    paddingBottom: 20,
  },
  centerCopy: {
    alignItems: "center",
    paddingHorizontal: 34,
  },
  title: {
    color: colors.neutrals900,
    ...fontStyles.xlBold,
    textAlign: "center",
    marginTop: 40,
  },
  message: {
    color: colors.neutrals900,
    ...fontStyles.lgRegular,
    textAlign: "center",
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    gap: 10,
  },
  footerContainer: {
    gap: 12,
  },
  continueButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.redText,
  },
  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  continueText: {
    color: colors.white,
    ...fontStyles.smRegular,
  },
  cancelText: {
    color: colors.neutrals900,
    ...fontStyles.smRegular,
  },
  pressed: {
    opacity: 0.76,
  },
});
