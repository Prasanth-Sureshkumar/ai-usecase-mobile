import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  ActionListRow,
  ConfirmationDialog,
  InfoRow,
  PhotoActionSheet,
} from "../components/SharedUIComponents";
import { colors } from "../constants/colors";
import { fontStyles } from "../constants/typography";
import { logout } from "../services/user";
import LinearGradient from "react-native-linear-gradient";
import { IconMap } from "../components/Icons";
import { useUser } from "../context/UserContext";
import LoadingIndicator from "../components/LoadingIndicator";
import { getDisplayDate, getDisplayName } from "../utils/profile";
import MyText from "../components/MyText";
import { ROUTES } from "../navigation/routes";

const PLACEHOLDER_PROFILE_IMAGE = require("../assets/images/placeholder.png");
const ProfileInfoScreen = ({ navigation }) => {
  const { user, setUser, loading } = useUser();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [photoSheetVisible, setPhotoSheetVisible] = useState(false);
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
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient
          colors={["#EBF1FF", "rgba(235, 241, 255, 0)"]}
          locations={[0, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <View style={styles.hero}>
            <Avatar
              source={profileImage}
              size={141}
              editable
              onPress={() => setPhotoSheetVisible(true)}
            />
          </View>
        </LinearGradient>

        <View style={styles.identity}>
          <MyText style={styles.name}>{getDisplayName(user)}</MyText>
          <MyText style={styles.role}>Role: {"parent"}</MyText>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MyText style={styles.sectionTitle}>Personal Info</MyText>
            <MyText
              style={styles.editText}
              onPress={() => navigation.navigate(ROUTES.EDIT_PERSONAL_INFO)}
            >
              Edit
            </MyText>
          </View>
          <InfoRow
            iconName={IconMap.cake}
            iconSize={24}
            outerRadius={40}
            value={getDisplayDate(user?.dateOfBirth) || "-"}
          />
          <InfoRow
            iconName={IconMap.gender}
            iconSize={24}
            outerRadius={40}
            value={user?.gender || "-"}
          />
          <InfoRow
            iconName={IconMap.phone}
            iconSize={24}
            outerRadius={40}
            value={user?.phoneNumber || "-"}
          />
          <InfoRow
            iconName={IconMap.message}
            iconSize={24}
            outerRadius={40}
            value={user?.email || "-"}
          />
        </View>

        <View style={styles.menuBlock}>
          <ActionListRow
            title="Account Settings"
            iconName={IconMap.userPlaceholder}
            iconSize={24}
            outerRadius={40}
            onPress={() => navigation.navigate(ROUTES.ACCOUNT_SETTINGS)}
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
        hasImage={Boolean(user?.picture)}
        onUpload={closePhotoSheet}
        onCapture={closePhotoSheet}
        onRemove={closePhotoSheet}
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
};
export default ProfileInfoScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingBottom: 34,
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
    marginBottom: 8,
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
  },
});
