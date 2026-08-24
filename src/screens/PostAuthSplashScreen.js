import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import AppLogo from "../components/AppLogo";
import { colors } from "../constants/colors";
import { POST_AUTH_SPLASH_DURATION } from "../constants/timing";
import { clearAuthSession } from "../api/tokenStorage";
import { useUser } from "../context/UserContext";
import { ROUTES } from "../navigation/routes";
const PostAuthSplashScreen = ({ navigation, route }) => {
  const { refreshUser } = useUser();

  useEffect(() => {
    let alive = true;
    const prepareAuthenticatedApp = async () => {
      const response = await refreshUser();
      const remainingDelay = new Promise(resolve =>
        setTimeout(resolve, POST_AUTH_SPLASH_DURATION),
      );
      await remainingDelay;
      if (!alive) return;

      if (!response.success) {
        await clearAuthSession();
        navigation.reset({
          index: 0,
          routes: [{ name: ROUTES.PRE_LOGIN }],
        });
        return;
      }

      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.MAIN_APP }],
      });
    };

    prepareAuthenticatedApp();

    return () => {
      alive = false;
    };
  }, [navigation, refreshUser]);

  return (
    <View style={styles.container}>
      <AppLogo
        size={112}
        variant="crest"
        showName
        logoUrl={route.params?.logoUrl}
      />
    </View>
  );
};
export default PostAuthSplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
});
