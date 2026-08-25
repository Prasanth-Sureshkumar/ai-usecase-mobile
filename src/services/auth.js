import { apiClient, getApiErrorMessage } from "../api/client";
import { AUTH_ENDPOINTS } from "../api/endpoints";
import { saveAuthSession } from "../api/tokenStorage";
const unwrapResponse = response => {
  const body = response.data || {};
  const { data, message, success, ...rest } = body;
  return {
    success: Boolean(success),
    message,
    ...rest,
    ...(data || {}),
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
export const validatePreLogin = async email => {
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.PRE_LOGIN, {
      email: email.trim().toLowerCase(),
    });
    const result = unwrapResponse(response);

    return {
      ...result,
      userExists: Boolean(result.isRegistered),
    };
  } catch (error) {
    return failure(error, "Unable to validate your details. Please try again.");
  }
};
export const sendOtp = async email => {
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER_OTP, {
      email: email.trim().toLowerCase(),
    });
    return unwrapResponse(response);
  } catch (error) {
    return failure(error, "Unable to send OTP. Please try again.");
  }
};
export const login = async (email, password) => {
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, {
      email: email.trim().toLowerCase(),
      password,
    });
    const result = unwrapResponse(response);
    await saveAuthSession({
      accessToken: result.token,
    });
    return result;
  } catch (error) {
    return failure(error, "Login failed. Please try again.");
  }
};
export const forgotPassword = async email => {
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
      email: email.trim().toLowerCase(),
    });
    return unwrapResponse(response);
  } catch (error) {
    return failure(error, "Unable to send reset OTP. Please try again.");
  }
};
export const resetPassword = async ({ email, otp, password }) => {
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
      email: email.trim().toLowerCase(),
      otp: otp.trim(),
      password,
    });
    return unwrapResponse(response);
  } catch (error) {
    return failure(error, "Unable to reset password. Please try again.");
  }
};
export const register = async payload => {
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER_VERIFY, {
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      otp: payload.otp.trim(),
    });
    const result = unwrapResponse(response);
    await saveAuthSession({
      accessToken: result.accessToken,
    });
    return result;
  } catch (error) {
    return failure(error, "Unable to create account. Please try again.");
  }
};
