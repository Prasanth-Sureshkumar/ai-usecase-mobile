import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Avatar,
  ActionListRow,
  ConfirmationDialog,
  InfoRow,
  PhotoActionSheet,
  PROFILE_USER
} from "../components/SharedUIComponents";
import { colors } from "../constants/colors";
import { fontStyles } from "../constants/typography";
import { logout } from "../services/user";
import LinearGradient from "react-native-linear-gradient";
import { IconMap } from "../components/Icons";

export default function ProfileInfoScreen({ navigation, route }) {
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [photoSheetVisible, setPhotoSheetVisible] = useState(false);
  const [profile, setProfile] = useState(route.params?.profile || PROFILE_USER);

  useEffect(() => {
    if (route.params?.profile) {
      setProfile(route.params.profile);
    }
  }, [route.params?.profile]);

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

  function updatePhoto(uri) {
    setProfile((current) => ({ ...current, avatarUrl: uri }));
    setPhotoSheetVisible(false);
  }

  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient
          colors={[
            "#EBF1FF",
            "rgba(235, 241, 255, 0)",
          ]}
          locations={[0, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }
          }
        >
          <View style={styles.hero}>
            <Avatar
              uri={profile.avatarUrl || "https://i.pravatar.cc/320?img=68"}
              size={141}
              editable
              onPress={() => setPhotoSheetVisible(true)}
            />
          </View>

        </LinearGradient>

        <View style={styles.identity}>
          <Text style={styles.name}>{profile.fullName}</Text>
          <Text style={styles.role}>Role: {profile.role}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Info</Text>
            <Text
              style={styles.editText}
              onPress={() => navigation.navigate("EditPersonalInfo", { profile })}
            >
              Edit
            </Text>
          </View>
          <InfoRow iconName={IconMap.cake} iconSize={24} outerRadius={40} value={profile.dateOfBirth} />
          <InfoRow iconName={IconMap.gender} iconSize={24} outerRadius={40} value={profile.gender} />
          <InfoRow iconName={IconMap.phone} iconSize={24} outerRadius={40} value={profile.phone} />
          <InfoRow iconName={IconMap.message} iconSize={24} outerRadius={40} value={profile.email} />
        </View>

        <View style={styles.menuBlock}>
          <ActionListRow
            title="Account Settings"
            iconName={IconMap.userPlaceholder}
            iconSize={24}
            outerRadius={40}
            onPress={() => navigation.navigate("AccountSettings")}
          />
          <ActionListRow
            title="Logout"
            iconName={IconMap.exitIcon}
            iconSize={20}
            outerRadius={20}
            backgroundColor={colors.transparent}
            color={colors.red500}
            showChevron={false}
            onPress={() => setLogoutVisible(true)}
          />
        </View>
      </ScrollView>

      <PhotoActionSheet
        visible={photoSheetVisible}
        hasImage={Boolean(profile.avatarUrl)}
        onUpload={() => updatePhoto("https://i.pravatar.cc/320?img=32")}
        onCapture={() => updatePhoto("https://i.pravatar.cc/320?img=12")}
        onRemove={() => updatePhoto("")}
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white
  },
  content: {
    paddingBottom: 34
  },
  hero: {
    paddingTop: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  identity: {
    paddingHorizontal: 14,
    paddingVertical: 20,
    gap: 18,
  },
  name: {
    color: colors.neutrals900,
    ...fontStyles.lgBold,
  },
  role: {
    color: colors.neutrals900,
    ...fontStyles.mdRegular,
  },
  section: {
    borderTopWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8
  },
  sectionTitle: {
    color: colors.neutrals900,
    ...fontStyles.mdBold,
  },
  editText: {
    color: colors.neutrals900,
    ...fontStyles.xmRegular,
  },
  menuBlock: {
    paddingTop: 0,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderColor: colors.neutrals100,
  }
});
