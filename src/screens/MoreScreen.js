import React from "react";
import { Image, Linking, Pressable, StyleSheet, View } from "react-native";
import { fontStyles } from "../constants/typography";
import Icon, { IconMap } from "../components/Icons";
import { useNavigation } from "@react-navigation/native";
import MyText from "../components/MyText";
import { useAppConfig, useTheme } from "../context/AppConfigContext";
import { ROUTES } from "../navigation/routes";
import { getActiveMenuItems } from "../types/menu";
import { normalizeUrl } from "../utils/url";

const MoreScreen = () => {
  const navigation = useNavigation();
  const { menu } = useAppConfig();
  const { colors } = useTheme();
  const moreItems = getActiveMenuItems(menu?.moreMenu);
  const handleMoreItemPress = item => {
    if (!item?.navigateTo || item.disabled) return;
    navigation.navigate(item.navigateTo, { title: item.title, ...item.params });
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.white,
        },
      ]}
    >
      <View style={styles.grid}>
        {moreItems.length ? (
          moreItems.map(item => {
            return (
              <Pressable
                key={item.id}
                onPress={() => handleMoreItemPress(item)}
                disabled={item.disabled}
                style={({ pressed }) => [
                  styles.card,
                  { backgroundColor: colors.neutrals50 },
                  item.disabled && styles.disabledCard,
                  pressed && !item.disabled && styles.pressed,
                ]}
              >
                {item.icon ? (
                  <Icon name={item.icon} size={30} color={item.color} />
                ) : item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    resizeMode="contain"
                    style={styles.iconStyle}
                  />
                ) : (
                  <Icon
                    name={IconMap.threedotAlt}
                    size={34}
                    color={colors.neutrals500}
                  />
                )}
                <MyText
                  style={[
                    styles.cardText,
                    { color: colors.neutrals900 },
                    item.disabled && styles.disabledText,
                  ]}
                >
                  {item.title}
                </MyText>
              </Pressable>
            );
          })
        ) : (
          <MyText style={[styles.emptyText, { color: colors.neutrals500 }]}>
            No menu items are available.
          </MyText>
        )}
      </View>
    </View>
  );
};
export default MoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    ...fontStyles.smRegular,
    textAlign: "center",
  },
  disabledText: {
    opacity: 0.7,
  },
  iconStyle: {
    width: 50,
    height: 50,
  },
  emptyText: {
    ...fontStyles.smRegular,
  },
});
