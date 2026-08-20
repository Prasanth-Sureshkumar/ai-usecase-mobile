import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { fontStyles } from "../constants/typography";
import Icon from "../components/Icons";

const moreItems = [
  { id: "admin", title: "Admin Panel", icon: "pencil", color: colors.primary },
  { id: "about", title: "About Regent", icon: "regentSprinkle", color: colors.gold },
  { id: "terms", title: "Terms & Condition", icon: "document", color: colors.iconGray }
];

export default function MoreScreen() {
  function handleMoreItemPress(item) {
    if (!item) return;
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {moreItems.map((item) => {
          return (
            <Pressable
              key={item.id}
              onPress={() => handleMoreItemPress(item)}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            >
              <Icon name={item.icon} size={58} color={item.color} />
              <Text style={styles.cardText}>{item.title}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    padding: 14
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14
  },
  card: {
    width: "48%",
    height: 144,
    borderRadius: 14,
    backgroundColor: colors.neutrals50,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.8
  },
  cardText: {
    color: colors.neutrals900,
    ...fontStyles.smRegular,
    textAlign: "center",
  },
});
