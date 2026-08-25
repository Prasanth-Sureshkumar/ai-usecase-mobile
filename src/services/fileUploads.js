import { FILE_UPLOAD_ENDPOINTS } from "../api/endpoints";
import { apiClient, getApiErrorMessage } from "../api/client";

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

export const uploadFile = async ({ file, relatedId, relatedType }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post(
      FILE_UPLOAD_ENDPOINTS.PROFILE_IMAGE({ relatedId, relatedType }),
      formData,
    );

    return unwrapResponse(response);
  } catch (error) {
    return failure(error, "Unable to upload profile image.");
  }
};
