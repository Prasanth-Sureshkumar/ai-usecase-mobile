import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import AppLogo from "../components/AppLogo";
import { colors } from "../constants/colors";
import { POST_AUTH_SPLASH_DURATION } from "../constants/timing";

export default function PostAuthSplashScreen({ navigation, route }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "MainApp" }]
      });
    }, POST_AUTH_SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <AppLogo size={112} variant="crest" showName logoUrl={route.params?.logoUrl} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  }
});
