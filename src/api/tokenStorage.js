import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "auth.accessToken";
const LEGACY_AUTH_USER_KEY = "auth.user";
export const getAuthToken = async () => {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
};
export const saveAuthSession = async ({ accessToken }) => {
  if (accessToken) {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  }
  await AsyncStorage.removeItem(LEGACY_AUTH_USER_KEY);
};
export const clearAuthSession = async () => {
  await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, LEGACY_AUTH_USER_KEY]);
};
