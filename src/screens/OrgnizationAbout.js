import React from "react";
import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Icon, { IconMap } from "../components/Icons";
import MyText from "../components/MyText";
import { colors } from "../constants/colors";
import { fontStyles } from "../constants/typography";
import { organization } from "../mocks/organization";

const CONTACT_ROWS = [
  {
    id: "phone",
    icon: IconMap.phone,
    value: organization.contact.phone,
  },
  {
    id: "email",
    icon: IconMap.message,
    value: organization.contact.email,
  },
  {
    id: "website",
    icon: IconMap.web,
    value: organization.contact.website,
    isLink: true,
  },
  {
    id: "location",
    icon: IconMap.location,
    value: organization.contact.location,
  },
];

const actions = [
  {
    id: "leave",
    title: "Leave your organization",
    destructive: true,
  },
];

const fallbackValue = value => value || "-";

const openWebsite = url => {
  if (!url) return;
  Linking.openURL(url).catch(() => {});
};

const OrgnizationAbout = () => {
  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <MyText style={styles.sectionTitle}>Contact</MyText>
          <View style={styles.rows}>
            {CONTACT_ROWS.map(row => (
              <ContactRow key={row.id} item={row} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <MyText style={styles.sectionTitle}>Actions</MyText>
          <View style={styles.rows}>
            {actions.map(action => (
              <ActionRow key={action.id} action={action} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const ContactRow = ({ item }) => {
  const textStyle = StyleSheet.compose(
    styles.rowText,
    item.isLink && styles.linkText,
  );

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
        {fallbackValue(item.value)}
      </MyText>
    </Pressable>
  );
};

const ActionRow = ({ action }) => {
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
    backgroundColor: colors.white,
  },
  content: {
    flexGrow: 1,
    paddingTop: 10,
  },
  section: {
    padding: 14,
  },
  sectionTitle: {
    color: colors.neutrals900,
    ...fontStyles.lgBold,
    marginBottom: 14,
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
    color: colors.neutrals900,
    ...fontStyles.smRegular,
  },
  linkText: {
    color: colors.primary500,
  },
  pressed: {
    opacity: 0.76,
  },
});
