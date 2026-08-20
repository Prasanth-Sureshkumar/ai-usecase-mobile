import React, { useEffect, useRef, useState } from "react";
import { BackHandler, Linking, Platform, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import ErrorMessage from "../components/ErrorMessage";
import LoadingIndicator from "../components/LoadingIndicator";
import { colors } from "../constants/colors";
import { isValidUrl } from "../utils/validation";

export default function DynamicWebViewScreen({ title, url, active = true }) {
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (Platform.OS !== "android" || !active) return undefined;

    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });

    return () => subscription.remove();
  }, [active, canGoBack]);

  if (!isValidUrl(url)) {
    return (
      <View style={styles.errorWrap}>
        <ErrorMessage message="This menu has an invalid URL." compact />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title ? <Text style={styles.hiddenTitle}>{title}</Text> : null}
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        onLoadStart={() => {
          setLoading(true);
          setLoadError("");
        }}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setLoadError("Unable to load this page. Check your internet connection and try again.");
        }}
        onNavigationStateChange={(event) => setCanGoBack(event.canGoBack)}
        onShouldStartLoadWithRequest={(request) => {
          const isExternal = !request.url.startsWith(url) && request.navigationType === "click";
          if (isExternal && /^https?:\/\//.test(request.url)) {
            Linking.openURL(request.url).catch(() => {});
            return false;
          }
          return true;
        }}
        startInLoadingState
        renderLoading={() => <LoadingIndicator label="Loading..." />}
      />
      {loading ? <View style={styles.loader}><LoadingIndicator label="Loading..." /></View> : null}
      {loadError ? (
        <View style={styles.errorOverlay}>
          <ErrorMessage message={loadError} compact />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  hiddenTitle: {
    position: "absolute",
    height: 0,
    width: 0,
    opacity: 0
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    justifyContent: "center",
    paddingHorizontal: 24
  },
  errorWrap: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 24
  }
});
