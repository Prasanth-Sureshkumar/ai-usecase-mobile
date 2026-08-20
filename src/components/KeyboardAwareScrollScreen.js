import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  InteractionManager,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View
} from "react-native";

const KEYBOARD_GAP = 24;
const ANDROID_KEYBOARD_GAP = 64;
const FOCUS_SCROLL_DELAY = Platform.OS === "android" ? 120 : 60;
const KeyboardAwareScrollContext = createContext({
  scheduleScrollToFocusedInput: () => {}
});

export function useKeyboardAwareScroll() {
  return useContext(KeyboardAwareScrollContext);
}

export default function KeyboardAwareScrollScreen({
  children,
  contentContainerStyle,
  style,
  ...scrollViewProps
}) {
  const scrollRef = useRef(null);
  const scrollTimerRef = useRef(null);
  const keyboardVisibleRef = useRef(false);
  const keyboardTopRef = useRef(Dimensions.get("window").height);
  const scrollOffsetRef = useRef(0);
  const [keyboardPadding, setKeyboardPadding] = useState(0);

  const scrollToFocusedInput = useCallback(() => {
    const focusedInput = TextInput.State.currentlyFocusedInput?.();

    if (!focusedInput || !scrollRef.current) {
      return;
    }

    requestAnimationFrame(() => {
      focusedInput.measureInWindow((_, y, __, height) => {
        const focusedBottom = y + height + (Platform.OS === "android" ? ANDROID_KEYBOARD_GAP : KEYBOARD_GAP);
        const hiddenAmount = focusedBottom - keyboardTopRef.current;

        if (hiddenAmount <= 0) {
          return;
        }

        scrollRef.current?.scrollTo({
          y: Math.max(0, scrollOffsetRef.current + hiddenAmount),
          animated: true
        });
      });
    });
  }, []);

  const scheduleScrollToFocusedInput = useCallback((delay = FOCUS_SCROLL_DELAY) => {
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        scrollToFocusedInput();
      });
    }, delay);
  }, [scrollToFocusedInput]);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      const keyboardHeight = event.endCoordinates?.height ?? 0;
      const windowHeight = Dimensions.get("window").height;
      const reportedKeyboardTop = event.endCoordinates?.screenY ?? windowHeight - keyboardHeight;

      Keyboard.scheduleLayoutAnimation?.(event);
      keyboardVisibleRef.current = true;
      keyboardTopRef.current = Math.min(reportedKeyboardTop, windowHeight);
      setKeyboardPadding(keyboardHeight + (Platform.OS === "android" ? ANDROID_KEYBOARD_GAP : KEYBOARD_GAP));
      scheduleScrollToFocusedInput(Platform.OS === "android" ? 120 : 80);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, (event) => {
      Keyboard.scheduleLayoutAnimation?.(event);
      keyboardVisibleRef.current = false;
      keyboardTopRef.current = Dimensions.get("window").height;
      setKeyboardPadding(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, [scheduleScrollToFocusedInput]);

  const contextValue = useMemo(() => ({
    scheduleScrollToFocusedInput: () => {
      scheduleScrollToFocusedInput(keyboardVisibleRef.current ? FOCUS_SCROLL_DELAY : 220);
    }
  }), [scheduleScrollToFocusedInput]);

  const keyboardPaddingStyle = useMemo(() => (
    keyboardPadding > 0 ? { paddingBottom: keyboardPadding } : null
  ), [keyboardPadding]);
  const scrollContentContainerStyle = [contentContainerStyle, keyboardPaddingStyle];

  return (
    <KeyboardAwareScrollContext.Provider value={contextValue}>
      <View style={styles.flex}>
        <ScrollView
          ref={scrollRef}
          style={style}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          onScroll={(event) => {
            scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
          contentContainerStyle={scrollContentContainerStyle}
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      </View>
    </KeyboardAwareScrollContext.Provider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  }
});
