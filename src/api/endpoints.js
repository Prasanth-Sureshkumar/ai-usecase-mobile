export const API_BASE = "/api";

export const AUTH_BASE = `${API_BASE}/auth`;
export const USER_BASE = `${API_BASE}/profile`;
export const MEDIA_BASE = `${API_BASE}/media`;
export const APP_INIT_ENDPOINT = `${API_BASE}/init`;

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

export const FILE_UPLOAD_ENDPOINTS = {
  PROFILE_IMAGE: ({ relatedId, relatedType }) =>
    `${MEDIA_BASE}/file-upload/profile/${relatedId}/${relatedType}`,
};
