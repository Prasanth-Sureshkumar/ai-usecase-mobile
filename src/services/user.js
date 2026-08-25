import { apiClient, getApiErrorMessage } from "../api/client";
import { clearAuthSession } from "../api/tokenStorage";
import { USER_ENDPOINTS } from "../api/endpoints";

const delay = (ms = 650) => new Promise(resolve => setTimeout(resolve, ms));
const unwrapResponse = response => {
  const body = response.data || {};
  return {
    success: Boolean(body.success),
    message: body.message,
    data: body.data,
  };
};
const failure = (error, fallback) => {
  return {
    success: false,
    message: getApiErrorMessage(error, fallback),
    detail: Array.isArray(error?.response?.data?.details)
      ? error.response.data.details
          .map(item => item.message)
          .filter(Boolean)
          .join("\n")
      : undefined,
  };
};
export const getCurrentUserProfile = async () => {
  try {
    const response = await apiClient.get(USER_ENDPOINTS.PROFILE_ME);
    return unwrapResponse(response);
  } catch (error) {
    return failure(error, "Unable to load your profile.");
  }
};
export const updatePersonalInformation = async payload => {
  try {
    const response = await apiClient.put(USER_ENDPOINTS.PROFILE_ME, payload);
    return unwrapResponse(response);
  } catch (error) {
    return failure(error, "Unable to save profile details.");
  }
};
export const logout = async () => {
  await clearAuthSession();
  return { success: true };
};
export const changePassword = async ({
  currentPassword,
  newPassword,
  confirmNewPassword,
}) => {
  try {
    const response = await apiClient.post(USER_ENDPOINTS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
      confirmNewPassword,
    });
    return unwrapResponse(response);
  } catch (error) {
    return failure(error, "Unable to change password.");
  }
};
export const deactivateAccount = async () => {
  await delay();
  await clearAuthSession();
  return { success: true };
};
