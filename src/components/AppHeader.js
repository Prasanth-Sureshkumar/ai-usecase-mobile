import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fontStyles } from "../constants/typography";
import Icon, { IconMap } from "./Icons";
import { useAppConfig, useTheme } from "../context/AppConfigContext";
import { useUser } from "../context/UserContext";
import MyText from "./MyText";
import { ROUTES } from "../navigation/routes";
import { getProfileImageUri } from "../utils/profile";
import { DEFAULT_FULL_LOGO_URL } from "../constants/branding";

const PLACEHOLDER_PROFILE_IMAGE = require("../assets/images/placeholder.png");

export const BackHeader = ({
  title,
  onBack,
  arrowOnly = false,
  style,
  isTitleBold = true,
  actionText,
  onActionPress,
  onActionPressRef,
  actionInProgress = false,
  testID,
}) => {
  const { colors } = useTheme();
  const actionHandler =
    onActionPress || onActionPressRef?.current || onActionPressRef;

  return (
    <View
      style={[
        styles.backHeader,
        {
          backgroundColor: colors.white,
          borderBottomColor: colors.borderLight,
        },
        arrowOnly && styles.arrowOnlyHeader,
        style,
      ]}
      testID={testID}
    >
      <Pressable
        onPress={onBack}
        hitSlop={12}
        style={styles.backButton}
        testID={testID ? `${testID}-back` : undefined}
      >
        <Icon
          name={IconMap.backArrowLeft}
          color={colors.neutrals900}
          size={25}
        />
      </Pressable>
      {arrowOnly ? null : (
        <MyText
          numberOfLines={1}
          style={[
            styles.backTitle,
            { color: colors.neutrals900 },
            !isTitleBold && styles.regularTitle,
          ]}
        >
          {title}
        </MyText>
      )}
      {actionText ? (
        <Pressable
          disabled={actionInProgress}
          hitSlop={12}
          onPress={actionHandler}
          style={StyleSheet.compose(
            styles.actionButton,
            actionInProgress && styles.disabledAction,
          )}
          testID={testID ? `${testID}-action` : undefined}
        >
          <MyText style={[styles.actionText, { color: colors.primary500 }]}>
            {actionText}
          </MyText>
        </Pressable>
      ) : null}
    </View>
  );
};
export const MainHeader = ({ logoUrl }) => {
  const navigation = useNavigation();
  const { organization } = useAppConfig();
  const { colors } = useTheme();
  const { user } = useUser();
  const resolvedLogoUrl =
    organization?.logoUrl || logoUrl || DEFAULT_FULL_LOGO_URL;
  const profileImageUri = getProfileImageUri(user);
  const profileImage = profileImageUri
    ? { uri: profileImageUri }
    : PLACEHOLDER_PROFILE_IMAGE;
  const openProfile = () => {
    const parentNavigation = navigation.getParent?.();
    if (parentNavigation) {
      parentNavigation.navigate(ROUTES.PERSONAL_PROFILE);
      return;
    }
    navigation.navigate(ROUTES.PERSONAL_PROFILE);
  };

  return (
    <View
      style={[
        styles.mainHeader,
        {
          backgroundColor: colors.white,
          borderBottomColor: colors.borderLight,
        },
      ]}
    >
      <View style={styles.brandRow}>
        {resolvedLogoUrl ? (
          <Image
            source={{ uri: resolvedLogoUrl }}
            resizeMode="contain"
            style={styles.logoImage}
          />
        ) : (
          <MyText
            style={[styles.logoFallbackText, { color: colors.neutrals900 }]}
            numberOfLines={1}
          >
            {organization?.name || "App"}
          </MyText>
        )}
        {/* <Icon name={IconMap.dropDown} color={colors.neutrals900} size={25} /> */}
      </View>
      <Pressable
        onPress={openProfile}
        hitSlop={10}
        style={({ pressed }) =>
          StyleSheet.compose(styles.profileWrap, pressed && styles.pressed)
        }
      >
        <Image
          key={profileImageUri}
          source={profileImage}
          style={styles.avatar}
        />
        {/* <View style={styles.badge}>
           <MyText style={styles.badgeText}>80</MyText>
          </View> */}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  backHeader: {
    height: 64,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  arrowOnlyHeader: {
    borderBottomWidth: 0,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
  },
  backTitle: {
    flex: 1,
    ...fontStyles.lgBold,
    marginLeft: 8,
  },
  regularTitle: {
    ...fontStyles.lgRegular,
  },
  actionButton: {
    minHeight: 44,
    justifyContent: "center",
    paddingLeft: 12,
  },
  disabledAction: {
    opacity: 0.5,
  },
  actionText: {
    ...fontStyles.smBold,
  },
  mainHeader: {
    height: 74,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoImage: {
    width: 220,
    height: 54,
  },
  logoFallbackText: {
    maxWidth: 220,
    ...fontStyles.lgBold,
  },
  profileWrap: {
    width: 44,
    height: 44,
  },
  pressed: {
    opacity: 0.76,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginTop: 5,
  },
});
