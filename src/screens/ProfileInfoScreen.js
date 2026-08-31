import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Avatar,
  ActionListRow,
  ConfirmationDialog,
  InfoRow,
  PhotoActionSheet,
} from "../components/SharedUIComponents";
import ErrorMessage from "../components/ErrorMessage";
import { colors } from "../constants/colors";
import { useAppConfig, useTheme } from "../context/AppConfigContext";
import {
  FILE_RELATED_TYPES,
  PROFILE_IMAGE_MAX_BYTES,
} from "../constants/fileUploads";
import { fontStyles } from "../constants/typography";
import { logout } from "../services/user";
import { uploadFile } from "../services/fileUploads";
import LinearGradient from "react-native-linear-gradient";
import { IconMap } from "../components/Icons";
import { useUser } from "../context/UserContext";
import LoadingIndicator from "../components/LoadingIndicator";
import {
  captureImageFromCamera,
  pickImageFromGallery,
} from "../utils/imagePicker";
import {
  getDisplayDate,
  getDisplayName,
  getProfileImageUri,
} from "../utils/profile";
import MyText from "../components/MyText";
import { ROUTES } from "../navigation/routes";

const PLACEHOLDER_PROFILE_IMAGE = require("../assets/images/placeholder.png");
const PHOTO_SHEET_DISMISS_DELAY_MS = 350;

const waitForPhotoSheetDismiss = () =>
  new Promise(resolve => {
    setTimeout(resolve, PHOTO_SHEET_DISMISS_DELAY_MS);
  });

const ProfileInfoScreen = ({ navigation }) => {
  const { user, setUser, loading } = useUser();
  const { user: appConfigUser, clearAppConfig } = useAppConfig();
  const { colors: themeColors } = useTheme();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [photoSheetVisible, setPhotoSheetVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const profileImageUri = getProfileImageUri(user);
  const profileImage = profileImageUri
    ? { uri: profileImageUri }
    : PLACEHOLDER_PROFILE_IMAGE;
  const roleName = appConfigUser?.role?.name || "-";
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
  const closePhotoSheet = () => {
    setPhotoSheetVisible(false);
  };
  const handleImagePickerResult = async ({ file, error, cancelled }) => {
    if (cancelled) return;
    if (error) {
      setUploadError(error);
      return;
    }

    await uploadProfileImage(file);
  };
  const uploadProfileImage = async file => {
    const relatedId = user?.id;
    if (!relatedId) {
      setUploadError(
        "Unable to upload image because your profile is not loaded.",
      );
      return;
    }

    if (uploading) return;

    setUploading(true);
    setUploadError(null);
    const response = await uploadFile({
      file,
      relatedId,
      relatedType: FILE_RELATED_TYPES.USER_PROFILE,
    });
    setUploading(false);

    if (!response.success) {
      setUploadError(response.detail || response.message);
      return;
    }

    const uploadedUrl =
      response.data?.absoluteUrl || response.data?.pictureUrl || file.uri;
    setUser(current => ({
      ...current,
      picture: uploadedUrl,
      pictureUrl: uploadedUrl,
      profilePictureVersion: Date.now(),
    }));
  };
  const chooseFromGallery = async () => {
    if (uploading) return;

    closePhotoSheet();
    setUploadError(null);
    await waitForPhotoSheetDismiss();
    const result = await pickImageFromGallery({
      fileNamePrefix: "profile",
      maxBytes: PROFILE_IMAGE_MAX_BYTES,
    });
    await handleImagePickerResult(result);
  };
  const takePhoto = async () => {
    if (uploading) return;

    closePhotoSheet();
    setUploadError(null);
    await waitForPhotoSheetDismiss();
    const result = await captureImageFromCamera({
      fileNamePrefix: "profile",
      maxBytes: PROFILE_IMAGE_MAX_BYTES,
    });
    await handleImagePickerResult(result);
  };

  if (loading && !user) {
    return <LoadingIndicator label="Loading profile..." />;
  }

  return (
    <View style={[styles.safe, { backgroundColor: themeColors.white }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient
          colors={[themeColors.primary100, "rgba(235, 241, 255, 0)"]}
          locations={[0, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <View style={styles.hero}>
            <View style={styles.avatarWrap}>
              <Avatar
                key={profileImageUri}
                source={profileImage}
                size={141}
                editable={!uploading}
                onPress={
                  uploading ? undefined : () => setPhotoSheetVisible(true)
                }
              />
              {uploading ? (
                <View style={styles.uploadOverlay}>
                  <ActivityIndicator color={themeColors.white} />
                </View>
              ) : null}
            </View>
          </View>
        </LinearGradient>

        <View style={styles.identity}>
          <MyText style={[styles.name, { color: themeColors.neutrals900 }]}>
            {getDisplayName(user)}
          </MyText>
            <MyText style={[styles.role, { color: themeColors.neutrals900 }]}>
              Role: {roleName}
            </MyText>
          {uploadError ? (
            <ErrorMessage message={uploadError} compact />
          ) : null}
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
            backgroundColor={themeColors.transparent}
            color={themeColors.red500}
            showChevron={false}
            onPress={() => setLogoutVisible(true)}
          />
        </View>
      </ScrollView>

      <PhotoActionSheet
        visible={photoSheetVisible && !uploading}
        hasImage={Boolean(profileImageUri)}
        onUpload={chooseFromGallery}
        onCapture={takePhoto}
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
  avatarWrap: {
    width: 141,
    height: 141,
  },
  uploadOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 71,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.38)",
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
