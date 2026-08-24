import { apiClient, getApiErrorMessage } from "../api/client";
import { AUTH_ENDPOINTS } from "../api/endpoints";
import { saveAuthSession } from "../api/tokenStorage";

function unwrapResponse(response) {
  const body = response.data || {};
  return {
    success: Boolean(body.success),
    message: body.message,
    ...(body.data || {})
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

export async function validatePreLogin(email) {
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.PRE_LOGIN, {
      email: email.trim().toLowerCase()
    });
    const result = unwrapResponse(response);

    return {
      ...result,
      userExists: Boolean(result.isRegistered)
    };
  } catch (error) {
    return failure(error, "Unable to validate your details. Please try again.");
  }
}

export async function sendOtp(email) {
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER_OTP, {
      email: email.trim().toLowerCase()
    });
    return unwrapResponse(response);
  } catch (error) {
    return failure(error, "Unable to send OTP. Please try again.");
  }
}

export async function login(email, password) {
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, {
      email: email.trim().toLowerCase(),
      password
    });
    const result = unwrapResponse(response);
    await saveAuthSession({
      accessToken: result.accessToken
    });
    return result;
  } catch (error) {
    return failure(error, "Login failed. Please try again.");
  }
}

export async function register(payload) {
  try {
    const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER_VERIFY, {
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      otp: payload.otp.trim()
    });
    const result = unwrapResponse(response);
    await saveAuthSession({
      accessToken: result.accessToken
    });
    return result;
  } catch (error) {
    return failure(error, "Unable to create account. Please try again.");
  }
}
