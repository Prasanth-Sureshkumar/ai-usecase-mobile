import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Avatar,
  ActionListRow,
  ConfirmationDialog,
  PhotoActionSheet,
  PROFILE_USER
} from "../components/SharedUIComponents";
import { colors } from "../constants/colors";
import { fontStyles } from "../constants/typography";
import { logout } from "../services/authService";
import { IconMap } from "../components/Icons";

export default function PersonalProfileScreen({ navigation }) {
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [photoSheetVisible, setPhotoSheetVisible] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(PROFILE_USER.avatarUrl);

  async function confirmLogout() {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    setLogoutVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "PreLogin" }]
    });
  }

  function useAlternatePhoto() {
    setAvatarUrl("https://i.pravatar.cc/320?img=32");
    setPhotoSheetVisible(false);
  }

  return (
    <View style={styles.safe}>
      <View style={styles.profileBlock}>
        <PressableAvatar
          avatarUrl={avatarUrl}
          onPress={() => setPhotoSheetVisible(true)}
        />
        <View style={styles.profileCopy}>
          <Text style={styles.name} numberOfLines={1}>{PROFILE_USER.name}</Text>
          <Text
            style={styles.editLink}
            onPress={() => navigation.navigate("ProfileInfo", { title: PROFILE_USER.fullName })}
            suppressHighlighting={true}
          >
            Edit Profile
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${PROFILE_USER.profileComplete}%` }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressText}>Complete your profile</Text>
            <Text style={styles.progressText}>{PROFILE_USER.profileComplete}%</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <ActionListRow
        title="Settings"
        iconName={IconMap.gear}
        iconSize={20}
        outerRadius={20}
        backgroundColor={'transparent'}
        onPress={() => navigation.navigate("Settings")}
      />
      <ActionListRow
        title="Logout"
        iconName={IconMap.exitIcon}
        iconSize={20}
        outerRadius={20}
        backgroundColor={'transparent'}
        onPress={() => setLogoutVisible(true)}
        color={colors.primary500}
      />

      <PhotoActionSheet
        visible={photoSheetVisible}
        hasImage={Boolean(avatarUrl)}
        onUpload={useAlternatePhoto}
        onCapture={useAlternatePhoto}
        onRemove={() => {
          setAvatarUrl("");
          setPhotoSheetVisible(false);
        }}
        onCancel={() => setPhotoSheetVisible(false)}
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
}

function PressableAvatar({ avatarUrl }) {
  return (
    <Avatar
      uri={avatarUrl || "https://i.pravatar.cc/320?img=68"}
      size={75}
    />
  );
}

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
    justifyContent:'center',
    alignItems:'center'
  },
  profileCopy: {
    flex: 1
  },
  name: {
    color: colors.neutrals900,
    ...fontStyles.lgBold
  },
  location: {
    color: colors.muted,
    ...fontStyles.xlRegular,
    marginTop: 4
  },
  editLink: {
    color: colors.primary500,
    ...fontStyles.xmBold,
    marginTop: 5
  },
  progressTrack: {
    height: 10,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.neutrals100,
    marginTop: 5
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary500
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2
  },
  progressText: {
    color: colors.neutrals500,
    ...fontStyles.xsmRegular,
  },
  divider: {
    height: 1,
    marginBottom: 10,
    backgroundColor: colors.neutrals100,
  }
});
