import { clearAuthSession } from "../api/tokenStorage";
import { apiClient, getApiErrorMessage } from "../api/client";
import { USER_ENDPOINTS } from "../api/endpoints";

const delay = (ms = 650) => new Promise((resolve) => setTimeout(resolve, ms));

function unwrapResponse(response) {
  const body = response.data || {};
  return {
    success: Boolean(body.success),
    message: body.message,
    data: body.data
  };
}

function failure(error, fallback) {
  return {
    success: false,
    message: getApiErrorMessage(error, fallback),
    detail: Array.isArray(error?.response?.data?.details)
      ? error.response.data.details.map((item) => item.message).filter(Boolean).join("\n")
      : undefined
  };
}

export async function getCurrentUserProfile() {
  try {
    const response = await apiClient.get(USER_ENDPOINTS.PROFILE_ME);
    return unwrapResponse(response);
  } catch (error) {
    return failure(error, "Unable to load your profile.");
  }
}

export async function updatePersonalInformation(payload) {
  try {
    const response = await apiClient.put(USER_ENDPOINTS.PROFILE_ME, payload);
    return unwrapResponse(response);
  } catch (error) {
    return failure(error, "Unable to save profile details.");
  }
}

export async function logout() {
  await clearAuthSession();
  return { success: true };
}

export async function changePassword({ currentPassword, newPassword }) {
  await delay();
  if (!currentPassword || !newPassword) {
    return { success: false, message: "Please complete both password fields." };
  }
  return { success: true };
}

export async function deactivateAccount() {
  await delay();
  await clearAuthSession();
  return { success: true };
}
