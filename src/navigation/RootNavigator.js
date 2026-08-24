import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { BackHeader } from "../components/AppHeader";
import InitialSplashScreen from "../screens/InitialSplashScreen";
import PreLoginScreen from "../screens/PreLoginScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import RegistrationSuccessScreen from "../screens/RegistrationSuccessScreen";
import PostAuthSplashScreen from "../screens/PostAuthSplashScreen";
import MainAppScreen from "../screens/MainAppScreen";
import DynamicWebViewScreen from "../screens/DynamicWebViewScreen";
import PersonalProfileScreen from "../screens/PersonalProfileScreen";
import ProfileInfoScreen from "../screens/ProfileInfoScreen";
import EditPersonalInfoScreen from "../screens/EditPersonalInfoScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AccountSettingsScreen from "../screens/AccountSettingsScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import DeactivateAccountScreen from "../screens/DeactivateAccountScreen";
import { UserProvider } from "../context/UserContext";

const Stack = createNativeStackNavigator();

function resolveOptionValue(value, params) {
  return typeof value === "function" ? value(params) : value;
}

export function getStackHeaderOptions(
  { navigation, route },
  {
    title,
    fallbackTitle,
    gestureEnabled = false,
    headerProps,
    headerTransparent = false
  } = {}
) {
  const params = { navigation, route };
  const resolvedHeaderProps = resolveOptionValue(headerProps, params) || {};
  const resolvedTitle = resolveOptionValue(title, params) || route.params?.title || fallbackTitle;

  return {
    headerShown: true,
    headerTransparent,
    gestureEnabled,
    header: () => (
      <BackHeader
        title={resolvedTitle}
        onBack={() => navigation.goBack()}
        {...resolvedHeaderProps}
      />
    )
  };
}

export function getHiddenHeaderOptions({ gestureEnabled = false } = {}) {
  return {
    headerShown: false,
    gestureEnabled
  };
}

export function getActionHeaderOptions({
  navigation,
  route
}, {
  title,
  fallbackTitle,
  actionText,
  testID,
  gestureEnabled = false
}) {
  return getStackHeaderOptions({ navigation, route }, {
    title,
    fallbackTitle,
    gestureEnabled,
    headerProps: (params) => ({
      isTitleBold: true,
      actionText: resolveOptionValue(actionText, params),
      onActionPressRef: params.route.params?.onActionPress || params.route.params?.onPost,
      actionInProgress: Boolean(params.route.params?.isLoading),
      testID
    })
  });
}

export function getHiddenDetailOptions() {
  return getHiddenHeaderOptions({
    gestureEnabled: false
  });
}

export default function RootNavigator() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="InitialSplash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="InitialSplash" component={InitialSplashScreen} />
          <Stack.Screen
            name="PreLogin"
            component={PreLoginScreen}
            options={(props) => (
              props.route.params?.showHeader
                ? getStackHeaderOptions(props, { fallbackTitle: "New User" })
                : getHiddenHeaderOptions()
            )}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={(props) => getStackHeaderOptions(props, {
              headerTransparent: true,
              headerProps: {
                arrowOnly: true,
                style: styles.transparentBackHeader
              }
            })}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={(props) => getStackHeaderOptions(props, { fallbackTitle: "Registration" })}
          />
          <Stack.Screen name="RegistrationSuccess" component={RegistrationSuccessScreen} />
          <Stack.Screen name="PostAuthSplash" component={PostAuthSplashScreen} />
          <Stack.Screen
            name="MainApp"
            component={MainAppScreen}
            options={() => getHiddenHeaderOptions()}
          />
          <Stack.Screen
            name="InAppBrowser"
            component={DynamicWebViewScreen}
            options={(props) => getStackHeaderOptions(props, { fallbackTitle: "Webview" })}
          />
          <Stack.Screen
            name="PersonalProfile"
            component={PersonalProfileScreen}
            options={(props) => getStackHeaderOptions(props, { fallbackTitle: "Personal Profile" })}
          />
          <Stack.Screen
            name="ProfileInfo"
            component={ProfileInfoScreen}
            options={(props) => getStackHeaderOptions(props, { fallbackTitle: "Personal Info" })}
          />
          <Stack.Screen
            name="EditPersonalInfo"
            component={EditPersonalInfoScreen}
            options={(props) => getStackHeaderOptions(props, { fallbackTitle: "Personal Information" })}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={(props) => getStackHeaderOptions(props, { fallbackTitle: "Settings" })}
          />
          <Stack.Screen
            name="AccountSettings"
            component={AccountSettingsScreen}
            options={(props) => getStackHeaderOptions(props, { fallbackTitle: "Account Settings" })}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
            options={(props) => getStackHeaderOptions(props, { fallbackTitle: "Change Password" })}
          />
          <Stack.Screen
            name="DeactivateAccount"
            component={DeactivateAccountScreen}
            options={(props) => getStackHeaderOptions(props, { fallbackTitle: "Deactivate Account" })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  transparentBackHeader: {
    marginTop: 30,
    backgroundColor: 'transparent',
  }
});
