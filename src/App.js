import React from "react";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import RootNavigator from "./navigation/RootNavigator";
import { AppConfigProvider, useTheme } from "./context/AppConfigContext";

const AppShell = () => {
  const { colors } = useTheme();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <SafeAreaView
        style={StyleSheet.compose(styles.safeArea, {
          backgroundColor: colors.white,
        })}
        edges={["top", "bottom"]}
      >
        <RootNavigator />
      </SafeAreaView>
    </>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <AppConfigProvider>
        <AppShell />
      </AppConfigProvider>
    </SafeAreaProvider>
  );
};
export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
