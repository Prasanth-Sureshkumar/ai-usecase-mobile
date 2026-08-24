import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import AppLogo from "../components/AppLogo";
import { colors } from "../constants/colors";
import { INITIAL_SPLASH_DURATION } from "../constants/timing";
import { getAuthToken } from "../api/tokenStorage";
import { POST_AUTH_LOGO_URL } from "../constants/branding";

export default function InitialSplashScreen({ navigation }) {
  useEffect(() => {
    let alive = true;

    const timer = setTimeout(() => {
      async function resolveInitialRoute() {
        const token = await getAuthToken();
        if (!alive) return;

        navigation.reset({
          index: 0,
          routes: [
            token
              ? { name: "PostAuthSplash", params: { logoUrl: POST_AUTH_LOGO_URL } }
              : { name: "PreLogin" }
          ]
        });
      }

      resolveInitialRoute();
    }, INITIAL_SPLASH_DURATION);

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <AppLogo size={86} showName />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white
  }
});
