import { PermissionsAndroid, Platform } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const IMAGE_OPTIONS = {
  mediaType: "photo",
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.8,
  includeBase64: false,
  assetRepresentationMode: "compatible",
  presentationStyle: "fullScreen",
};

const GALLERY_OPTIONS = {
  ...IMAGE_OPTIONS,
  selectionLimit: 1,
};

const requestCameraPermission = async () => {
  if (Platform.OS !== "android") return true;

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
};

const getPickerErrorMessage = (response, source) => {
  if (response.errorCode === "permission") {
    return source === "camera"
      ? "Camera permission is required to take a photo."
      : "Photo library permission is required to choose a photo.";
  }

  if (response.errorCode === "camera_unavailable") {
    return "Camera is not available on this device.";
  }

  return response.errorMessage || "Unable to choose image.";
};

const getImageExtension = asset => {
  const nameExtension = asset.fileName?.split(".").pop();
  if (nameExtension) return nameExtension;
  const mimeExtension = asset.type?.split("/").pop();
  return mimeExtension || "jpg";
};

const createImageFile = (
  asset,
  { fileNamePrefix = "image", maxBytes } = {},
) => {
  if (!asset?.uri) {
    return { error: "Unable to read the selected image." };
  }

  if (asset.type && !asset.type.startsWith("image/")) {
    return { error: "Only image uploads are allowed." };
  }

  if (maxBytes && asset.fileSize && asset.fileSize > maxBytes) {
    return {
      error: `Image must be ${Math.round(maxBytes / 1048576)} MB or less.`,
    };
  }

  const type = asset.type || "image/jpeg";
  const extension = getImageExtension({ ...asset, type });

  return {
    file: {
      uri: asset.uri,
      type,
      name: asset.fileName || `${fileNamePrefix}-${Date.now()}.${extension}`,
    },
  };
};

const resolveImagePickerResponse = (response, source, options) => {
  if (response.didCancel) return { cancelled: true };

  if (response.errorCode) {
    return { error: getPickerErrorMessage(response, source) };
  }

  return createImageFile(response.assets?.[0], options);
};

export const pickImageFromGallery = async (options = {}) => {
  try {
    const response = await launchImageLibrary(GALLERY_OPTIONS);
    return resolveImagePickerResponse(response, "gallery", options);
  } catch (error) {
    return { error: error?.message || "Unable to choose image." };
  }
};

export const captureImageFromCamera = async (options = {}) => {
  try {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      return { error: "Camera permission is required to take a photo." };
    }

    const response = await launchCamera(IMAGE_OPTIONS);
    return resolveImagePickerResponse(response, "camera", options);
  } catch (error) {
    return { error: error?.message || "Unable to take photo." };
  }
};
