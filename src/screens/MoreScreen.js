import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { colors } from "../constants/colors";
import { fontStyles } from "../constants/typography";
import Icon from "../components/Icons";
import { useNavigation } from "@react-navigation/native";
import MyText from "../components/MyText";
import { ROUTES } from "../navigation/routes";

const moreItems = [
  {
    id: "admin",
    title: "Admin Panel",
    imageUrl:
      "https://pub-d423d28126b8427881b12df516c6520a.r2.dev/adminpanel.png",
    navigateTo: ROUTES.IN_APP_BROWSER,
    params: {
      title: "Admin Panel",
      url: "https://www.youtube.com",
      active: true,
    },
  },
  {
    id: "about",
    title: "About Regent",
    imageUrl: "https://pub-d423d28126b8427881b12df516c6520a.r2.dev/about.png",
    navigateTo: ROUTES.ORGANIZATION_ABOUT,
  },
  {
    id: "terms",
    title: "Terms & Condition",
    imageUrl: "https://pub-d423d28126b8427881b12df516c6520a.r2.dev/Terms.png",
    navigateTo: ROUTES.IN_APP_BROWSER,
    params: {
      title: "Terms & Condition",
      url: "https://www.youtube.com",
      active: true,
    },
  },
];
const MoreScreen = () => {
  const navigation = useNavigation();
  const handleMoreItemPress = item => {
    if (!item?.navigateTo || item.disabled) return;
    navigation.navigate(item.navigateTo, item.params);
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {moreItems.map(item => {
          return (
            <Pressable
              key={item.id}
              onPress={() => handleMoreItemPress(item)}
              disabled={item.disabled}
              style={({ pressed }) =>
                StyleSheet.compose(
                  StyleSheet.compose(
                    styles.card,
                    item.disabled && styles.disabledCard,
                  ),
                  pressed && !item.disabled && styles.pressed,
                )
              }
            >
              {item.icon ? (
                <Icon name={item.icon} size={30} color={item.color} />
              ) : (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.iconStyle}
                />
              )}
              <MyText
                style={StyleSheet.compose(
                  styles.cardText,
                  item.disabled && styles.disabledText,
                )}
              >
                {item.title}
              </MyText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
export default MoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    padding: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
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
  disabledCard: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.8,
  },
  cardText: {
    color: colors.neutrals900,
    ...fontStyles.smRegular,
    textAlign: "center",
  },
  disabledText: {
    color: colors.neutrals500,
  },
  iconStyle: {
    width: 50,
    height: 50,
    objectFit: "contain",
  },
});
