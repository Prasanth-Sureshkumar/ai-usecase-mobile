import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { screen } from "../constants/spacing";
import { fontStyles } from "../constants/typography";
import Icon from "./Icons";

export function BottomTabBar({ state, descriptors, navigation }) {
  const items = state.routes.map((route) => {
    const options = descriptors[route.key]?.options || {};
    return {
      id: route.key,
      routeName: route.name,
      name: options.tabBarLabel || options.title || route.name,
      icon: options.icon
    };
  });
  const selectedId = state.routes[state.index]?.key;

  function selectTab(item) {
    const route = state.routes.find((currentRoute) => currentRoute.key === item.id);
    if (!route) return;

    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true
    });

    if (!event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  }

  return <BottomNavigation items={items} selectedId={selectedId} onSelect={selectTab} />;
}

function BottomNavigationItem({ active, item, onPress }) {
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: active ? 1 : 0,
      duration: 180,
      useNativeDriver: true
    }).start();
  }, [active, progress]);

  const animatedStyle = {
    opacity: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.82, 1]
    }),
    transform: [
      {
        scale: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.96, 1]
        })
      }
    ]
  };

  return (
    <Pressable onPress={onPress} style={styles.tabItem}>
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        <Icon name={item.icon} size={28} color={active ? colors.primary500 : colors.neutrals900} />
        <Text style={[styles.label, active && styles.activeLabel]}>{item.name}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function BottomNavigation({ items, selectedId, onSelect }) {
  const [barWidth, setBarWidth] = useState(0);
  const selectedIndex = Math.max(0, items.findIndex((item) => item.id === selectedId));
  const tabWidth = items.length > 0 ? barWidth / items.length : 0;
  const indicatorX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!tabWidth) return;

    Animated.spring(indicatorX, {
      toValue: selectedIndex * tabWidth,
      damping: 20,
      stiffness: 220,
      mass: 0.8,
      useNativeDriver: true
    }).start();
  }, [indicatorX, selectedIndex, tabWidth]);

  const indicatorStyle = useMemo(() => ({
    width: tabWidth,
    transform: [{ translateX: indicatorX }]
  }), [indicatorX, tabWidth]);

  return (
    <View
      style={styles.tabBar}
      onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
    >
      {tabWidth ? (
        <Animated.View style={[styles.activeIndicatorSlot, indicatorStyle]}>
          <View style={styles.activeLine} />
        </Animated.View>
      ) : null}
      {items.map((item) => {
        const active = selectedId === item.id;
        return (
          <BottomNavigationItem
            key={item.id}
            active={active}
            item={item}
            onPress={() => onSelect(item)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: screen.bottomTabsHeight,
    borderTopWidth: 1,
    borderTopColor: colors.tabLine,
    backgroundColor: colors.white,
    flexDirection: "row",
    paddingBottom: 8
  },
  activeIndicatorSlot: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center"
  },
  activeLine: {
    width: 40,
    height: 3,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: colors.primary500
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4
  },
  label: {
    color: colors.neutrals900,
    ...fontStyles.xsmRegular
  },
  activeLabel: {
    color: colors.primary500
  }
});
