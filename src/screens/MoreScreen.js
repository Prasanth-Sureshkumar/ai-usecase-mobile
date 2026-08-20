import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import { fontStyles } from "../constants/typography";
import Icon from "../components/Icons";

const moreItems = [
  { id: "admin", title: "Admin Panel", imageUrl: "https://pub-d423d28126b8427881b12df516c6520a.r2.dev/adminpanel.png" },
  { id: "about", title: "About Regent", imageUrl: "https://pub-d423d28126b8427881b12df516c6520a.r2.dev/about.png" },
  { id: "terms", title: "Terms & Condition", imageUrl: "https://pub-d423d28126b8427881b12df516c6520a.r2.dev/Terms.png" }
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
              {item.icon ?
                <Icon name={item.icon} size={30} color={item.color} /> :
                <Image source={{ uri: item.imageUrl }} style={styles.iconStyle} />
              }
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
    paddingVertical: 20,
    paddingHorizontal: 10,
    height: "auto",
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
  iconStyle: {
    width: 50,
    height: 50,
    objectFit: 'contain',
  },
});
