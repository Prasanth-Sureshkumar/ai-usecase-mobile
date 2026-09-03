import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import AppLogo from "../components/AppLogo";
import MyText from "../components/MyText";
import { APP_SPLASH_TITLE } from "../constants/branding";
import { colors } from "../constants/colors";
import { INITIAL_SPLASH_DURATION } from "../constants/timing";
import { getAuthToken } from "../api/tokenStorage";
import { ROUTES } from "../navigation/routes";
const InitialSplashScreen = ({ navigation }) => {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let alive = true;

    Animated.timing(scale, {
      toValue: 1,
      duration: 2000,
      easing: Easing.bezier(0.4, 1.75, 0.3, 1),
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      const resolveInitialRoute = async () => {
        const token = await getAuthToken();
        if (!alive) return;

        navigation.reset({
          index: 0,
          routes: [
            token
              ? { name: ROUTES.POST_AUTH_SPLASH }
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
  }, [navigation, scale]);

  return (
    <View style={styles.container}>
        <AppLogo size={118} />
        <Animated.View style={[styles.content, { transform: [{ scale }] }]}>
          <MyText style={styles.title}>{APP_SPLASH_TITLE}</MyText>
        </Animated.View>
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
  content: {
    alignItems: "center",
  },
  title: {
    marginTop: 15,
    color: colors.neutrals900,
    textAlign: "center",
    fontFamily: "Yantramanav",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -1.5,
    textTransform: "uppercase",
  },
});
