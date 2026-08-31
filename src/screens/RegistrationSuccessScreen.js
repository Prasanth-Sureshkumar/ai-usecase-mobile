import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import SuccessState from "../components/SuccessState";
import { colors } from "../constants/colors";
import { REGISTER_SUCCESS_DURATION } from "../constants/timing";
import { ROUTES } from "../navigation/routes";
const RegistrationSuccessScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(ROUTES.POST_AUTH_SPLASH);
    }, REGISTER_SUCCESS_DURATION);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <SuccessState
        title={"Account Created\nSuccessfully!"}
        message={"Your account has been created\nsuccessfully."}
      />
    </View>
  );
};
export default RegistrationSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 28,
  },
});
