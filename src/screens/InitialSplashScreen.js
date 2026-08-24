import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import AppLogo from "../components/AppLogo";
import { colors } from "../constants/colors";
import { INITIAL_SPLASH_DURATION } from "../constants/timing";
import { getAuthToken } from "../api/tokenStorage";
import { POST_AUTH_LOGO_URL } from "../constants/branding";
import { ROUTES } from "../navigation/routes";
const InitialSplashScreen = ({ navigation }) => {
  useEffect(() => {
    let alive = true;

    const timer = setTimeout(() => {
      const resolveInitialRoute = async () => {
        const token = await getAuthToken();
        if (!alive) return;

        navigation.reset({
          index: 0,
          routes: [
            token
              ? {
                  name: ROUTES.POST_AUTH_SPLASH,
                  params: { logoUrl: POST_AUTH_LOGO_URL },
                }
              : { name: ROUTES.PRE_LOGIN },
          ],
        });
      };

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
};
export default InitialSplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
});
