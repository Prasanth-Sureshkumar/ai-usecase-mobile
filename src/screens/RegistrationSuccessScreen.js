import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import SuccessState from "../components/SuccessState";
import { colors } from "../constants/colors";
import { REGISTER_SUCCESS_DURATION } from "../constants/timing";

export default function RegistrationSuccessScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("PostAuthSplash",{logoUrl:'https://pub-d423d28126b8427881b12df516c6520a.r2.dev/aebfa2c545d0b0763f0c1767f7920695890ba5a3.png'});
    }, REGISTER_SUCCESS_DURATION);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <SuccessState
        title={"Account Created\nSuccessfully!"}
        message={"Your account has been created\nsuccessfully for Regents School."}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 28
  }
});
