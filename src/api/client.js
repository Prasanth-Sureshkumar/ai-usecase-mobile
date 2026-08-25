import axios from "axios";
import { env } from "../config/env";
import { getAuthToken } from "./tokenStorage";

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const isFormDataPayload = data => {
  if (!data) return false;
  if (typeof FormData !== "undefined" && data instanceof FormData) return true;
  return typeof data.append === "function" && Array.isArray(data._parts);
};

const removeContentTypeHeader = headers => {
  if (!headers) return;

  if (typeof headers.delete === "function") {
    headers.delete("Content-Type");
    headers.delete("content-type");
    return;
  }

  delete headers["Content-Type"];
  delete headers["content-type"];
};

apiClient.interceptors.request.use(async config => {
  const token = await getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (isFormDataPayload(config.data)) {
    removeContentTypeHeader(config.headers);
  }

  if (env.DEVELOPER_QUIRKS) {
    console.log("API Request:", JSON.stringify(config));
  }

  return config;
});

apiClient.interceptors.response.use(
  response => {
    if (env.DEVELOPER_QUIRKS) {
      console.log("API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  error => {
    if (env.DEVELOPER_QUIRKS) {
      console.log("API Error:", {
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data,
        message: error.message,
      });
    }
    return Promise.reject(error);
  },
);
export const getApiErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again.",
) => {
  return error?.response?.data?.message || error?.message || fallback;
};
