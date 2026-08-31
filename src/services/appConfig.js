import { apiClient, getApiErrorMessage } from "../api/client";
import { APP_INIT_ENDPOINT } from "../api/endpoints";

const unwrapResponse = response => {
  const body = response.data || {};
  return {
    success: Boolean(body.success),
    message: body.message,
    data: body.data || {},
  };
};

const failure = (error, fallback) => {
  return {
    success: false,
    status: error?.response?.status,
    message: getApiErrorMessage(error, fallback),
  };
};

export const getAppInit = async () => {
  try {
    const response = await apiClient.get(APP_INIT_ENDPOINT);
    return unwrapResponse(response);
  } catch (error) {
    return failure(error, "Unable to initialize the app.");
  }
};
