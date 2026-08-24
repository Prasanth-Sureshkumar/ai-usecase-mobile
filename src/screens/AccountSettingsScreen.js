import React from "react";
import { StyleSheet, View } from "react-native";
import { ActionListRow } from "../components/SharedUIComponents";
import { colors } from "../constants/colors";
import { IconMap } from "../components/Icons";
import { ROUTES } from "../navigation/routes";
const AccountSettingsScreen = ({ navigation }) => {
  return (
    <View style={styles.safe}>
      <ActionListRow
        title="Change Password"
        iconName={IconMap.lock}
        iconSize={24}
        outerRadius={40}
        onPress={() => navigation.navigate(ROUTES.CHANGE_PASSWORD)}
      />

      <ActionListRow
        title="Deactivate or Delete Account"
        iconName={IconMap.userRemove}
        iconSize={24}
        outerRadius={40}
        onPress={() => navigation.navigate(ROUTES.DEACTIVATE_ACCOUNT)}
      />
    </View>
  );
};
export default AccountSettingsScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 14,
  },
});
