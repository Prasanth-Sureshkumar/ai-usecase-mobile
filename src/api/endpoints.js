export const API_BASE = "/api";

export const AUTH_BASE = `${API_BASE}/auth`;
export const USER_BASE = `${API_BASE}/profile`;

export const AUTH_ENDPOINTS = {
  PRE_LOGIN: `${AUTH_BASE}/prelogin`,
  REGISTER_OTP: `${AUTH_BASE}/otp`,
  REGISTER_VERIFY: `${AUTH_BASE}/register`,
  LOGIN: `${AUTH_BASE}/login`,
  FORGOT_PASSWORD: `${AUTH_BASE}/forgot-password`,
  RESET_PASSWORD: `${AUTH_BASE}/reset-password`,
};

export const USER_ENDPOINTS = {
  PROFILE: (id = "me") => `${USER_BASE}/${id}`,
  PROFILE_ME: `${USER_BASE}/me`,
  CHANGE_PASSWORD: `${USER_BASE}/change-password`,
};
