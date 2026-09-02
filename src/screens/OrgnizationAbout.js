import React, { useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Icon, { IconMap } from "../components/Icons";
import MyText from "../components/MyText";
import { useAppConfig, useTheme } from "../context/AppConfigContext";
import { fontStyles } from "../constants/typography";
import { normalizeUrl } from "../utils/url";
import { ConfirmationDialog } from "../components/SharedUIComponents";
import ErrorMessage from "../components/ErrorMessage";
import { leaveOrganization } from "../services/user";
import { useUser } from "../context/UserContext";
import { ROUTES } from "../navigation/routes";

const actions = [
  {
    id: "leave",
    title: "Leave your organization",
    destructive: true,
  },
];

const openWebsite = url => {
  if (!url) return;
  Linking.openURL(normalizeUrl(url)).catch(() => {});
};

const OrgnizationAbout = ({ navigation }) => {
  const { setUser } = useUser();
  const { clearAppConfig, organization } = useAppConfig();
  const { colors } = useTheme();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const organizationName = organization?.name || "this organization";
  const organizationId = organization?.id;
  const locationText = [
    organization?.location?.address,
    organization?.location?.city,
    organization?.location?.stateProvince,
    organization?.location?.postalCode,
    organization?.location?.country,
  ]
    .filter(Boolean)
    .join(", ");
  const contactRows = [
    {
      id: "phone",
      icon: IconMap.phone,
      value: organization?.phoneNumber,
    },
    {
      id: "email",
      icon: IconMap.message,
      value: organization?.email,
    },
    {
      id: "website",
      icon: IconMap.web,
      value: organization?.website,
      isLink: true,
    },
    {
      id: "location",
      icon: IconMap.location,
      value: locationText,
    },
  ].filter(row => Boolean(row.value));
  const confirmLeave = async () => {
    if (submitting || !organizationId) return;

    setSubmitting(true);
    setApiError("");
    const response = await leaveOrganization(organizationId);
    setSubmitting(false);
    setConfirmVisible(false);

    if (!response.success) {
      setApiError(response.message || "Unable to leave organization.");
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
    <View style={[styles.safe, { backgroundColor: colors.white }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {contactRows.length ? (
          <View style={styles.section}>
            <MyText style={[styles.sectionTitle, { color: colors.neutrals900 }]}>
              Contact
            </MyText>
            <View style={styles.rows}>
              {contactRows.map(row => (
                <ContactRow key={row.id} item={row} colors={colors} />
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <MyText style={[styles.sectionTitle, { color: colors.neutrals900 }]}>
            Actions
          </MyText>
          {apiError ? <ErrorMessage message={apiError} compact /> : null}
          <View style={styles.rows}>
            {actions.map(action => (
              <ActionRow
                key={action.id}
                action={action}
                colors={colors}
                disabled={!organizationId || submitting}
                onPress={() => {
                  setApiError("");
                  setConfirmVisible(true);
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <ConfirmationDialog
        visible={confirmVisible}
        title="Leave organization?"
        message={`Do you really want to leave ${organizationName}? You will lose access to this organization's app content.`}
        confirmLabel="Yes, Leave"
        loading={submitting}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={confirmLeave}
      />
    </View>
  );
};

const ContactRow = ({ item, colors }) => {
  const textStyle = [
    styles.rowText,
    { color: item.isLink ? colors.primary500 : colors.neutrals900 },
    item.isLink && styles.linkText,
  ];

  return (
    <Pressable
      disabled={!item.isLink}
      onPress={() => openWebsite(item.value)}
      style={({ pressed }) =>
        StyleSheet.compose(styles.row, pressed && styles.pressed)
      }
    >
      <Icon name={item.icon} size={20} color={colors.neutrals900} />
      <MyText style={textStyle} numberOfLines={2}>
        {item.value}
      </MyText>
    </Pressable>
  );
};

const ActionRow = ({ action, colors, disabled, onPress }) => {
  const color = action.destructive ? colors.red500 : colors.neutrals900;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) =>
        StyleSheet.compose(
          styles.row,
          (pressed || disabled) && styles.pressed,
        )
      }
    >
      <Icon name={IconMap.doorExit} size={20} color={color} />
      <MyText
        style={StyleSheet.compose(styles.rowText, { color })}
        numberOfLines={2}
      >
        {action.title}
      </MyText>
    </Pressable>
  );
};

export default OrgnizationAbout;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: 10,
  },
  section: {
    padding: 14,
  },
  sectionTitle: {
    ...fontStyles.lgBold,
    marginBottom: 14,
  },
  organizationName: {
    ...fontStyles.lgBold,
  },
  description: {
    ...fontStyles.smRegular,
    marginTop: 8,
  },
  rows: {
    // paddingVertical: 10,
  },
  row: {
    minHeight: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 10,
  },
  rowText: {
    flex: 1,
    ...fontStyles.smRegular,
  },
  linkText: {
    textDecorationLine: "underline",
  },
  pressed: {
    opacity: 0.76,
  },
});
