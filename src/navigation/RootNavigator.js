import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { BackHeader, MAIN_HEADER_LOGO_URL, MainHeader } from "../components/AppHeader";
import InitialSplashScreen from "../screens/InitialSplashScreen";
import PreLoginScreen from "../screens/PreLoginScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import RegistrationSuccessScreen from "../screens/RegistrationSuccessScreen";
import PostAuthSplashScreen from "../screens/PostAuthSplashScreen";
import MainAppScreen from "../screens/MainAppScreen";

const Stack = createNativeStackNavigator();

function renderMainHeader() {
  return <MainHeader logoUrl={MAIN_HEADER_LOGO_URL} />;
}

function createBackHeaderOptions(title, headerProps = {}) {
  return ({ navigation }) => ({
    headerShown: true,
    header: () => (
      <BackHeader
        title={title}
        onBack={() => navigation.goBack()}
        {...headerProps}
      />
    )
  });
}

function getPreLoginOptions({ navigation, route }) {
  if (!route.params?.showHeader) {
    return { headerShown: false };
  }

  return {
    headerShown: true,
    header: () => <BackHeader title="New User" onBack={() => navigation.goBack()} />
  };
}

function getLoginOptions({ navigation }) {
  return {
    headerShown: true,
    headerTransparent: true,
    header: () => (
      <BackHeader
        arrowOnly
        onBack={() => navigation.goBack()}
        style={styles.transparentBackHeader}
      />
    )
  };
}

const REGISTER_OPTIONS = createBackHeaderOptions("Registration");
const MAIN_APP_OPTIONS = {
  headerShown: true,
  header: renderMainHeader
};

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InitialSplash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="InitialSplash" component={InitialSplashScreen} />
        <Stack.Screen name="PreLogin" component={PreLoginScreen} options={getPreLoginOptions} />
        <Stack.Screen name="Login" component={LoginScreen} options={getLoginOptions} />
        <Stack.Screen name="Register" component={RegisterScreen} options={REGISTER_OPTIONS} />
        <Stack.Screen name="RegistrationSuccess" component={RegistrationSuccessScreen} />
        <Stack.Screen name="PostAuthSplash" component={PostAuthSplashScreen} />
        <Stack.Screen name="MainApp" component={MainAppScreen} options={MAIN_APP_OPTIONS} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  transparentBackHeader: {
    marginTop: 30,
    backgroundColor: 'transparent',
  }
});
