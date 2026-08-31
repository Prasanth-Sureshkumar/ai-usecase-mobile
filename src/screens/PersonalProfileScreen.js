import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Avatar,
  ActionListRow,
  ConfirmationDialog,
} from "../components/SharedUIComponents";
import { colors } from "../constants/colors";
import { fontStyles } from "../constants/typography";
import { logout } from "../services/user";
import { IconMap } from "../components/Icons";
import { useUser } from "../context/UserContext";
import { useAppConfig, useTheme } from "../context/AppConfigContext";
import LoadingIndicator from "../components/LoadingIndicator";
import MyText from "../components/MyText";
import {
  calculateProfileCompletion,
  getDisplayName,
  getProfileImageUri,
} from "../utils/profile";
import { ROUTES } from "../navigation/routes";

const PLACEHOLDER_PROFILE_IMAGE = require("../assets/images/placeholder.png");
const PersonalProfileScreen = ({ navigation }) => {
  const { user, setUser, loading } = useUser();
  const { clearAppConfig } = useAppConfig();
  const { colors: themeColors } = useTheme();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const completion = calculateProfileCompletion(user);
  const profileImageUri = getProfileImageUri(user);
  const profileImage = profileImageUri
    ? { uri: profileImageUri }
    : PLACEHOLDER_PROFILE_IMAGE;
  const confirmLogout = async () => {
    setLoggingOut(true);
    await logout();
    setUser(null);
    clearAppConfig();
    setLoggingOut(false);
    setLogoutVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.PRE_LOGIN }],
    });
  };

  if (loading && !user) {
    return <LoadingIndicator label="Loading profile..." />;
  }

  return (
    <View style={[styles.safe, { backgroundColor: themeColors.white }]}>
      <View style={styles.profileBlock}>
        <PressableAvatar
          imageKey={profileImageUri}
          source={profileImage}
        />

        <View style={styles.profileCopy}>
          <MyText
            style={[styles.name, { color: themeColors.neutrals900 }]}
            numberOfLines={1}
          >
            {getDisplayName(user)}
          </MyText>
          <MyText
            style={[styles.editLink, { color: themeColors.primary500 }]}
            onPress={() =>
              navigation.navigate(ROUTES.PROFILE_INFO, {
                title: getDisplayName(user),
              })
            }
            suppressHighlighting={true}
          >
            Edit Profile
          </MyText>
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: themeColors.neutrals100 },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: themeColors.primary500,
                  width: `${completion}%`,
                },
              ]}
            />
          </View>
          <View style={styles.progressLabels}>
            <MyText
              style={[styles.progressText, { color: themeColors.neutrals500 }]}
            >
              Complete your profile
            </MyText>
            <MyText
              style={[styles.progressText, { color: themeColors.neutrals500 }]}
            >
              {completion}%
            </MyText>
          </View>
        </View>
      </View>

      <View
        style={[styles.divider, { backgroundColor: themeColors.neutrals100 }]}
      />

      <ActionListRow
        title="Settings"
        iconName={IconMap.gear}
        iconSize={20}
        outerRadius={20}
        backgroundColor={themeColors.transparent}
        onPress={() => navigation.navigate(ROUTES.SETTINGS)}
      />

      <ActionListRow
        title="Logout"
        iconName={IconMap.exitIcon}
        iconSize={20}
        outerRadius={20}
        backgroundColor={themeColors.transparent}
        onPress={() => setLogoutVisible(true)}
        color={themeColors.primary500}
      />

      <ConfirmationDialog
        visible={logoutVisible}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmLabel="Yes, Logout"
        loading={loggingOut}
        onCancel={() => setLogoutVisible(false)}
        onConfirm={confirmLogout}
      />
    </View>
  );
};
export default PersonalProfileScreen;
const PressableAvatar = ({ imageKey, source, onPress }) => {
  return <Avatar key={imageKey} source={source} size={75} onPress={onPress} />;
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 15,
  },
  profileBlock: {
    flexDirection: "row",
    gap: 15,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCopy: {
    flex: 1,
  },
  name: {
    color: colors.neutrals900,
    ...fontStyles.lgBold,
  },
  location: {
    color: colors.muted,
    ...fontStyles.xlRegular,
    marginTop: 4,
  },
  editLink: {
    color: colors.primary500,
    ...fontStyles.xmBold,
    marginTop: 5,
  },
  progressTrack: {
    height: 10,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.neutrals100,
    marginTop: 5,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary500,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  progressText: {
    color: colors.neutrals500,
    ...fontStyles.xsmRegular,
  },
  missingText: {
    color: colors.neutrals500,
    ...fontStyles.xsmRegular,
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginBottom: 10,
    backgroundColor: colors.neutrals100,
  },
});
