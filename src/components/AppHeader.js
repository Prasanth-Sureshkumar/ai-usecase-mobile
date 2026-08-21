import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../constants/colors";
import { fontStyles, weights } from "../constants/typography";
import Icon, { IconMap } from "./Icons";

export const MAIN_HEADER_LOGO_URL =
  "https://pub-d423d28126b8427881b12df516c6520a.r2.dev/Frame%2026796%20(1).png";

export function BackHeader({
  title,
  onBack,
  arrowOnly = false,
  style,
  isTitleBold = true,
  actionText,
  onActionPress,
  onActionPressRef,
  actionInProgress = false,
  testID
}) {
  const actionHandler = onActionPress || onActionPressRef?.current || onActionPressRef;

  return (
    <View style={[styles.backHeader, arrowOnly && styles.arrowOnlyHeader, style]} testID={testID}>
      <Pressable onPress={onBack} hitSlop={12} style={styles.backButton} testID={testID ? `${testID}-back` : undefined}>
        <Icon name={IconMap.backArrowLeft} color={colors.neutrals900} size={25}/>
      </Pressable>
      {arrowOnly ? null : (
        <Text
          numberOfLines={1}
          style={[styles.backTitle, !isTitleBold && styles.regularTitle]}
        >
          {title}
        </Text>
      )}
      {actionText ? (
        <Pressable
          disabled={actionInProgress}
          hitSlop={12}
          onPress={actionHandler}
          style={[styles.actionButton, actionInProgress && styles.disabledAction]}
          testID={testID ? `${testID}-action` : undefined}
        >
          <Text style={styles.actionText}>{actionText}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function MainHeader({ logoUrl = MAIN_HEADER_LOGO_URL }) {
  const navigation = useNavigation();

  function openProfile() {
    const parentNavigation = navigation.getParent?.();
    if (parentNavigation) {
      parentNavigation.navigate("PersonalProfile");
      return;
    }
    navigation.navigate("PersonalProfile");
  }

  return (
    <View style={styles.mainHeader}>
      <View style={styles.brandRow}>
        <Image source={{ uri: logoUrl }} resizeMode="contain" style={styles.logoImage} />
        <Icon name={IconMap.dropDown} color={colors.neutrals900} size={25} />
      </View>
      <Pressable onPress={openProfile} hitSlop={10} style={({ pressed }) => [styles.profileWrap, pressed && styles.pressed]}>
        <Image source={{ uri: "https://i.pravatar.cc/80?img=12" }} style={styles.avatar} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>80</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  backHeader: {
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: colors.white
  },
  arrowOnlyHeader: {
    borderBottomWidth: 0
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center"
  },
  backTitle: {
    flex: 1,
    color: colors.neutrals900,
    ...fontStyles.lgBold,
    marginLeft: 8
  },
  regularTitle: {
    ...fontStyles.lgRegular
  },
  actionButton: {
    minHeight: 44,
    justifyContent: "center",
    paddingLeft: 12
  },
  disabledAction: {
    opacity: 0.5
  },
  actionText: {
    color: colors.primary500,
    ...fontStyles.smBold
  },
  mainHeader: {
    height: 74,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    backgroundColor: colors.white
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  logoImage: {
    width: 220,
    height: 150
  },
  profileWrap: {
    width: 44,
    height: 44
  },
  pressed: {
    opacity: 0.76
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginTop: 5
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.red700,
    paddingHorizontal: 3
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: weights.bold
  }
});
