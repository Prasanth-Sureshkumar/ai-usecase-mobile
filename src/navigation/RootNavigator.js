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
import OrgnizationAbout from "../screens/OrgnizationAbout";
import { UserProvider } from "../context/UserContext";
import { ROUTES } from "./routes";

const Stack = createNativeStackNavigator();
const resolveOptionValue = (value, params) => {
  return typeof value === "function" ? value(params) : value;
};
export const getStackHeaderOptions = (
  { navigation, route },
  {
    title,
    fallbackTitle,
    gestureEnabled = false,
    headerProps,
    headerTransparent = false,
  } = {},
) => {
  const params = { navigation, route };
  const resolvedHeaderProps = resolveOptionValue(headerProps, params) || {};
  const resolvedTitle =
    resolveOptionValue(title, params) || route.params?.title || fallbackTitle;

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
    ),
  };
};
export const getHiddenHeaderOptions = ({ gestureEnabled = false } = {}) => {
  return {
    headerShown: false,
    gestureEnabled,
  };
};
export const getActionHeaderOptions = (
  { navigation, route },
  { title, fallbackTitle, actionText, testID, gestureEnabled = false },
) => {
  return getStackHeaderOptions(
    { navigation, route },
    {
      title,
      fallbackTitle,
      gestureEnabled,
      headerProps: params => ({
        isTitleBold: true,
        actionText: resolveOptionValue(actionText, params),
        onActionPressRef:
          params.route.params?.onActionPress || params.route.params?.onPost,
        actionInProgress: Boolean(params.route.params?.isLoading),
        testID,
      }),
    },
  );
};
export const getHiddenDetailOptions = () => {
  return getHiddenHeaderOptions({
    gestureEnabled: false,
  });
};
const RootNavigator = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={ROUTES.INITIAL_SPLASH}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name={ROUTES.INITIAL_SPLASH}
            component={InitialSplashScreen}
          />
          <Stack.Screen
            name={ROUTES.PRE_LOGIN}
            component={PreLoginScreen}
            options={props =>
              props.route.params?.showHeader
                ? getStackHeaderOptions(props, { fallbackTitle: "New User" })
                : getHiddenHeaderOptions()
            }
          />

          <Stack.Screen
            name={ROUTES.LOGIN}
            component={LoginScreen}
            options={props =>
              getStackHeaderOptions(props, {
                headerTransparent: true,
                headerProps: {
                  arrowOnly: true,
                  style: styles.transparentBackHeader,
                },
              })
            }
          />

          <Stack.Screen
            name={ROUTES.REGISTER}
            component={RegisterScreen}
            options={props =>
              getStackHeaderOptions(props, { fallbackTitle: "Registration" })
            }
          />

          <Stack.Screen
            name={ROUTES.REGISTRATION_SUCCESS}
            component={RegistrationSuccessScreen}
          />
          <Stack.Screen
            name={ROUTES.POST_AUTH_SPLASH}
            component={PostAuthSplashScreen}
          />
          <Stack.Screen
            name={ROUTES.MAIN_APP}
            component={MainAppScreen}
            options={() => getHiddenHeaderOptions()}
          />

          <Stack.Screen
            name={ROUTES.IN_APP_BROWSER}
            component={DynamicWebViewScreen}
            options={props =>
              getStackHeaderOptions(props, { fallbackTitle: "Webview" })
            }
          />

          <Stack.Screen
            name={ROUTES.PERSONAL_PROFILE}
            component={PersonalProfileScreen}
            options={props =>
              getStackHeaderOptions(props, {
                fallbackTitle: "Personal Profile",
              })
            }
          />

          <Stack.Screen
            name={ROUTES.PROFILE_INFO}
            component={ProfileInfoScreen}
            options={props =>
              getStackHeaderOptions(props, { fallbackTitle: "Personal Info" })
            }
          />

          <Stack.Screen
            name={ROUTES.EDIT_PERSONAL_INFO}
            component={EditPersonalInfoScreen}
            options={props =>
              getStackHeaderOptions(props, {
                fallbackTitle: "Personal Information",
              })
            }
          />

          <Stack.Screen
            name={ROUTES.SETTINGS}
            component={SettingsScreen}
            options={props =>
              getStackHeaderOptions(props, { fallbackTitle: "Settings" })
            }
          />

          <Stack.Screen
            name={ROUTES.ACCOUNT_SETTINGS}
            component={AccountSettingsScreen}
            options={props =>
              getStackHeaderOptions(props, {
                fallbackTitle: "Account Settings",
              })
            }
          />

          <Stack.Screen
            name={ROUTES.CHANGE_PASSWORD}
            component={ChangePasswordScreen}
            options={props =>
              getStackHeaderOptions(props, { fallbackTitle: "Change Password" })
            }
          />

          <Stack.Screen
            name={ROUTES.DEACTIVATE_ACCOUNT}
            component={DeactivateAccountScreen}
            options={props =>
              getStackHeaderOptions(props, {
                fallbackTitle: "Deactivate Account",
              })
            }
          />

          <Stack.Screen
            name={ROUTES.ORGANIZATION_ABOUT}
            component={OrgnizationAbout}
            options={props =>
              getStackHeaderOptions(props, {
                fallbackTitle: "About Regent",
              })
            }
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};
export default RootNavigator;

const styles = StyleSheet.create({
  transparentBackHeader: {
    marginTop: 30,
    backgroundColor: "transparent",
  },
});
