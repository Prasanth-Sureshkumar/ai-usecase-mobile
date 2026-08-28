import React, { useEffect, useMemo, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useIsFocused } from "@react-navigation/native";
import { Platform, StyleSheet, View } from "react-native";
import { BottomTabBar } from "../components/BottomNavigation";
import { MainHeader, MAIN_HEADER_LOGO_URL } from "../components/AppHeader";
import LoadingIndicator from "../components/LoadingIndicator";
import { colors } from "../constants/colors";
import { RESERVED_MORE_ITEM } from "../types/menu";
import { getMenus } from "../services/menuService";
import DynamicWebViewScreen from "./DynamicWebViewScreen";
import MoreScreen from "./MoreScreen";

const MAX_VISIBLE_DYNAMIC_ITEMS = 5;
const MainTab = createBottomTabNavigator();
const renderMainHeader = () => {
  return <MainHeader logoUrl={MAIN_HEADER_LOGO_URL} />;
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
      url={item.url}
      authenticated={!!item.authenticated}
      active={Platform.OS === "android" ? isFocused : true}
    />
  );
};
const MainAppScreen = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const loadMenus = async () => {
      try {
        const response = await getMenus();
        if (!alive) return;
        setMenus(response);
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadMenus();
    return () => {
      alive = false;
    };
  }, []);

  const bottomItems = useMemo(() => {
    const visibleMenus = menus.slice(0, MAX_VISIBLE_DYNAMIC_ITEMS);
    return [...visibleMenus, RESERVED_MORE_ITEM];
  }, [menus]);

  return (
    <View style={styles.safe}>
      {loading ? (
        <LoadingIndicator label="Loading menus..." />
      ) : (
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
      )}
    </View>
  );
};
export default MainAppScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
