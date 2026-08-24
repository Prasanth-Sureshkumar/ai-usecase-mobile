import { API_BASE_URL, DEVELOPER_QUIRKS } from "@env";

export const env = {
  API_BASE_URL: API_BASE_URL || "",
  DEVELOPER_QUIRKS: DEVELOPER_QUIRKS === "true",
};
