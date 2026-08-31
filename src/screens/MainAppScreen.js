import React, { useMemo } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useIsFocused } from "@react-navigation/native";
import { Platform, StyleSheet, View } from "react-native";
import { BottomTabBar } from "../components/BottomNavigation";
import { MainHeader } from "../components/AppHeader";
import { useAppConfig, useTheme } from "../context/AppConfigContext";
import {
  getActiveMenuItems,
  getMenuIcon,
  RESERVED_MORE_ITEM,
} from "../types/menu";
import { normalizeUrl } from "../utils/url";
import DynamicWebViewScreen from "./DynamicWebViewScreen";
import MoreScreen from "./MoreScreen";

const MainTab = createBottomTabNavigator();
const renderMainHeader = () => {
  return <MainHeader />;
};
const renderBottomTabBar = props => {
  return <BottomTabBar {...props} />;
};
const MainTabScreen = ({ route }) => {
  const item = route.params?.item;
  const isFocused = useIsFocused();

  if (!item || item.isReserved) {
    return <MoreScreen />;
  }

  return (
    <DynamicWebViewScreen
      title={item.name}
      url={normalizeUrl(item.url)}
      authenticated={true}
      active={item.active && (Platform.OS === "android" ? isFocused : true)}
    />
  );
};
const MainAppScreen = () => {
  const { menu } = useAppConfig();
  const { colors } = useTheme();

  const bottomItems = useMemo(() => {
    const activeBottomItems = getActiveMenuItems(menu?.bottomMenu).map(item => ({
      ...item,
      id: String(item.id),
      name: item.name,
      icon: getMenuIcon(item.icon),
    }));
    const activeMoreItems = getActiveMenuItems(menu?.moreMenu);

    if (!activeBottomItems.length && !activeMoreItems.length) {
      return [RESERVED_MORE_ITEM];
    }

    return activeMoreItems.length
      ? [...activeBottomItems, RESERVED_MORE_ITEM]
      : activeBottomItems;
  }, [menu?.bottomMenu, menu?.moreMenu]);

  return (
    <View
      style={StyleSheet.compose(styles.safe, { backgroundColor: colors.white })}
    >
      <MainTab.Navigator
        initialRouteName={bottomItems[0]?.id || RESERVED_MORE_ITEM.id}
        backBehavior="initialRoute"
        screenOptions={{
          header: renderMainHeader,
        }}
        tabBar={renderBottomTabBar}
      >
        {bottomItems.map(item => (
          <MainTab.Screen
            key={item.id}
            name={item.id}
            component={MainTabScreen}
            initialParams={{ item }}
            options={{
              tabBarLabel: item.name,
              icon: item.icon,
            }}
          />
        ))}
      </MainTab.Navigator>
    </View>
  );
};
export default MainAppScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
});
