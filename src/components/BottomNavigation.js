import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { screen } from "../constants/spacing";
import { fontStyles } from "../constants/typography";
import Icon from "./Icons";

export default function BottomNavigation({ items, selectedId, onSelect }) {
  return (
    <View style={styles.tabBar}>
      {items.map((item) => {
        const active = selectedId === item.id;
        return (
          <Pressable key={item.id} onPress={() => onSelect(item)} style={styles.tabItem}>
            <View style={[styles.activeLine, active && styles.activeLineVisible]} />
            <Icon name={item.icon} size={28} color={active ? colors.primary500 : colors.neutrals900} />
            <Text style={[styles.label, active && styles.activeLabel]}>{item.name}</Text>
          </Pressable>
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
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4
  },
  activeLine: {
    position: "absolute",
    top: 0,
    width: 40,
    height: 3,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "transparent"
  },
  activeLineVisible: {
    backgroundColor: colors.primary500
  },
  label: {
    color: colors.neutrals900,
    ...fontStyles.xsmRegular
  },
  activeLabel: {
    color: colors.primary500
  }
});
