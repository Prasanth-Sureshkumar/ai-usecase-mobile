import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import BottomNavigation from "../components/BottomNavigation";
import LoadingIndicator from "../components/LoadingIndicator";
import { colors } from "../constants/colors";
import { RESERVED_MORE_ITEM } from "../types/menu";
import { getMenus } from "../services/menuService";
import DynamicWebViewScreen from "./DynamicWebViewScreen";
import MoreScreen from "./MoreScreen";

const MAX_VISIBLE_DYNAMIC_ITEMS = 2;

export default function MainAppScreen() {
  const [menus, setMenus] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function loadMenus() {
      try {
        const response = await getMenus();
        if (!alive) return;
        setMenus(response);
        setSelectedId(response[0]?.id || RESERVED_MORE_ITEM.id);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadMenus();
    return () => {
      alive = false;
    };
  }, []);

  const bottomItems = useMemo(() => {
    const visibleMenus = menus.slice(0, MAX_VISIBLE_DYNAMIC_ITEMS);
    return [...visibleMenus, RESERVED_MORE_ITEM];
  }, [menus]);

  const selectedMenu = menus.find((item) => item.id === selectedId);
  const selectedBottomId = bottomItems.some((item) => item.id === selectedId) ? selectedId : RESERVED_MORE_ITEM.id;
  const selectMenu = useCallback((item) => {
    setSelectedId(item.id);
  }, []);

  function renderContent() {
    if (loading) return <LoadingIndicator label="Loading menus..." />;
    if (selectedId === RESERVED_MORE_ITEM.id || !selectedMenu) return <MoreScreen />;
    return <DynamicWebViewScreen title={selectedMenu.name} url={selectedMenu.url} active />;
  }

  return (
    <View style={styles.safe}>
      <View style={styles.body}>{renderContent()}</View>
      <BottomNavigation items={bottomItems} selectedId={selectedBottomId} onSelect={selectMenu} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white
  },
  body: {
    flex: 1,
    backgroundColor: colors.white
  }
});
