import axios from "axios";
import { env } from "../config/env";
import { getAuthToken } from "./tokenStorage";

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (env.DEVELOPER_QUIRKS) {
    console.log("API Request:", {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      params: config.params,
      data: config.data
    });
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (env.DEVELOPER_QUIRKS) {
      console.log("API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    if (env.DEVELOPER_QUIRKS) {
      console.log("API Error:", {
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data,
        message: error.message
      });
    }
    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return error?.response?.data?.message || error?.message || fallback;
}
