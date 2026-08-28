import React, { useEffect, useRef, useState } from "react";
import { BackHandler, Linking, Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import ErrorMessage from "../components/ErrorMessage";
import LoadingIndicator from "../components/LoadingIndicator";
import { colors } from "../constants/colors";
import { isValidUrl } from "../utils/validation";
import { getAuthToken } from "../api/tokenStorage";

const WEB_APP_TOKEN_KEY = "app-x-token";

const createWebAppTokenScript = token => `
  (function() {
    try {
      window.localStorage.setItem(${JSON.stringify(WEB_APP_TOKEN_KEY)}, ${JSON.stringify(token)});
    } catch (error) {}
  })();
  true;
`;

const DynamicWebViewScreen = props => {
  const { url, active = true, authenticated = false } = props.route?.params ?? props;
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [tokenLoading, setTokenLoading] = useState(authenticated);

  useEffect(() => {
    if (Platform.OS !== "android" || !active) return undefined;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        }
        return false;
      },
    );

    return () => subscription.remove();
  }, [active, canGoBack]);

  useEffect(() => {
    let alive = true;

    const loadToken = async () => {
      if (!authenticated) {
        setAuthToken("");
        setTokenLoading(false);
        return;
      }

      setTokenLoading(true);
      const token = await getAuthToken();
      if (!alive) return;
      setAuthToken(token || "");
      setTokenLoading(false);
    };

    loadToken();
    return () => {
      alive = false;
    };
  }, [authenticated]);

  const webAppTokenScript = authToken
    ? createWebAppTokenScript(authToken)
    : undefined;

  useEffect(() => {
    if (!authenticated || !webAppTokenScript || !webViewRef.current) return;
    webViewRef.current.injectJavaScript(webAppTokenScript);
  }, [authenticated, webAppTokenScript]);

  if (!isValidUrl(url)) {
    return (
      <View style={styles.errorWrap}>
        <ErrorMessage message="This menu has an invalid URL." compact />
      </View>
    );
  }

  if (tokenLoading) {
    return (
      <View style={styles.loader}>
        <LoadingIndicator label="Loading..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        injectedJavaScriptBeforeContentLoaded={
          authenticated ? webAppTokenScript : undefined
        }
        injectedJavaScript={authenticated ? webAppTokenScript : undefined}
        onLoadStart={() => {
          setLoadError("");
        }}
        onError={() => {
          setLoadError(
            "Unable to load this page. Check your internet connection and try again.",
          );
        }}
        onNavigationStateChange={event => setCanGoBack(event.canGoBack)}
        onShouldStartLoadWithRequest={request => {
          const isExternal =
            !request.url.startsWith(url) && request.navigationType === "click";
          if (isExternal && /^https?:\/\//.test(request.url)) {
            Linking.openURL(request.url).catch(() => {});
            return false;
          }
          return true;
        }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loader}>
            <LoadingIndicator label="Loading..." />
          </View>
        )}
      />
      {loadError ? (
        <View style={styles.errorOverlay}>
          <ErrorMessage message={loadError} compact />
        </View>
      ) : null}
    </View>
  );
};
export default DynamicWebViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  errorWrap: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 24,
  },
});
