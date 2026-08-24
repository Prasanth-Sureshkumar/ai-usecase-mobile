import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Avatar,
  ActionListRow,
  ConfirmationDialog,
  PhotoActionSheet,
} from "../components/SharedUIComponents";
import { colors } from "../constants/colors";
import { fontStyles } from "../constants/typography";
import { logout } from "../services/user";
import { IconMap } from "../components/Icons";
import { useUser } from "../context/UserContext";
import LoadingIndicator from "../components/LoadingIndicator";
import MyText from "../components/MyText";
import { calculateProfileCompletion, getDisplayName } from "../utils/profile";
import { ROUTES } from "../navigation/routes";

const PLACEHOLDER_PROFILE_IMAGE = require("../assets/images/placeholder.png");
const PersonalProfileScreen = ({ navigation }) => {
  const { user, setUser, loading } = useUser();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [photoSheetVisible, setPhotoSheetVisible] = useState(false);

  const completion = calculateProfileCompletion(user);
  const profileImage =
    typeof user?.picture === "string" && user.picture
      ? { uri: user.picture }
      : PLACEHOLDER_PROFILE_IMAGE;
  const confirmLogout = async () => {
    setLoggingOut(true);
    await logout();
    setUser(null);
    setLoggingOut(false);
    setLogoutVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.PRE_LOGIN }],
    });
  };
  const closePhotoSheet = () => {
    setPhotoSheetVisible(false);
  };

  if (loading && !user) {
    return <LoadingIndicator label="Loading profile..." />;
  }

  return (
    <View style={styles.safe}>
      <View style={styles.profileBlock}>
        <PressableAvatar
          source={profileImage}
          onPress={() => setPhotoSheetVisible(true)}
        />

        <View style={styles.profileCopy}>
          <MyText style={styles.name} numberOfLines={1}>
            {getDisplayName(user)}
          </MyText>
          <MyText
            style={styles.editLink}
            onPress={() =>
              navigation.navigate(ROUTES.PROFILE_INFO, {
                title: getDisplayName(user),
              })
            }
            suppressHighlighting={true}
          >
            Edit Profile
          </MyText>
          <View style={styles.progressTrack}>
            <View
              style={StyleSheet.compose(styles.progressFill, {
                width: `${completion}%`,
              })}
            />
          </View>
          <View style={styles.progressLabels}>
            <MyText style={styles.progressText}>Complete your profile</MyText>
            <MyText style={styles.progressText}>{completion}%</MyText>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <ActionListRow
        title="Settings"
        iconName={IconMap.gear}
        iconSize={20}
        outerRadius={20}
        backgroundColor={"transparent"}
        onPress={() => navigation.navigate(ROUTES.SETTINGS)}
      />

      <ActionListRow
        title="Logout"
        iconName={IconMap.exitIcon}
        iconSize={20}
        outerRadius={20}
        backgroundColor={"transparent"}
        onPress={() => setLogoutVisible(true)}
        color={colors.primary500}
      />

      <PhotoActionSheet
        visible={photoSheetVisible}
        hasImage={Boolean(user?.picture)}
        onUpload={closePhotoSheet}
        onCapture={closePhotoSheet}
        onRemove={closePhotoSheet}
        onCancel={closePhotoSheet}
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
const PressableAvatar = ({ source, onPress }) => {
  return <Avatar source={source} size={75} onPress={onPress} />;
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
