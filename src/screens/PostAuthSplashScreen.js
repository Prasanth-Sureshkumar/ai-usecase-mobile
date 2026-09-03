import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import AppLogo from "../components/AppLogo";
import AppButton from "../components/AppButton";
import ErrorMessage from "../components/ErrorMessage";
import LoadingIndicator from "../components/LoadingIndicator";
import { POST_AUTH_SPLASH_DURATION } from "../constants/timing";
import { DEFAULT_MINI_LOGO_URL } from "../constants/branding";
import { useAppConfig, useTheme } from "../context/AppConfigContext";
import { useUser } from "../context/UserContext";
import { ROUTES } from "../navigation/routes";

const PostAuthSplashScreen = ({ navigation }) => {
  const { organization, initialized, refreshAppConfig, clearAppConfig } =
    useAppConfig();
  const { refreshUser, setUser } = useUser();
  const { colors } = useTheme();
  const [error, setError] = useState("");

  const resetToLogin = useCallback(async () => {
    clearAppConfig();
    setUser(null);
    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.PRE_LOGIN }],
    });
  }, [clearAppConfig, navigation, setUser]);

  const prepareAuthenticatedApp = useCallback(async () => {
    setError("");
    const response = await refreshAppConfig();

    if (!response.success) {
      if (response.authExpired) {
        await resetToLogin();
        return;
      }

      setError(response.message || "Unable to initialize the app.");
      return;
    }

    await refreshUser();
    await new Promise(resolve => setTimeout(resolve, POST_AUTH_SPLASH_DURATION));

    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.MAIN_APP }],
    });
  }, [navigation, refreshAppConfig, refreshUser, resetToLogin]);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      await prepareAuthenticatedApp();
      if (!alive) return;
    };

    run();

    return () => {
      alive = false;
    };
  }, [prepareAuthenticatedApp]);

  return (
    <View
      style={StyleSheet.compose(styles.container, {
        backgroundColor: colors.white,
      })}
    >
      {initialized ? (
        <AppLogo
          size={180}
          variant="crest"
          logoUrl={organization?.miniUrl || DEFAULT_MINI_LOGO_URL}
        />
      ) : (
        <LoadingIndicator label="Initializing..." />
      )}
      {error ? (
        <View style={styles.retryBlock}>
          <ErrorMessage message={error} compact />
          <AppButton label="Retry" onPress={prepareAuthenticatedApp} />
        </View>
      ) : null}
    </View>
  );
};
export default PostAuthSplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  retryBlock: {
    width: "100%",
    paddingHorizontal: 28,
    marginTop: 24,
    gap: 14,
  },
});
