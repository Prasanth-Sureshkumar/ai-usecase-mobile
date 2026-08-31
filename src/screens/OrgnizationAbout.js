import React from "react";
import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Icon, { IconMap } from "../components/Icons";
import MyText from "../components/MyText";
import { useAppConfig, useTheme } from "../context/AppConfigContext";
import { fontStyles } from "../constants/typography";
import { normalizeUrl } from "../utils/url";

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

const OrgnizationAbout = () => {
  const { organization } = useAppConfig();
  const { colors } = useTheme();
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
          <View style={styles.rows}>
            {actions.map(action => (
              <ActionRow key={action.id} action={action} colors={colors} />
            ))}
          </View>
        </View>
      </ScrollView>
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

const ActionRow = ({ action, colors }) => {
  const color = action.destructive ? colors.red500 : colors.neutrals900;

  return (
    <Pressable
      style={({ pressed }) =>
        StyleSheet.compose(styles.row, pressed && styles.pressed)
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
