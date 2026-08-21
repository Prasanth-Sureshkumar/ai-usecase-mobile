import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActionListRow } from "../components/SharedUIComponents";
import { colors } from "../constants/colors";
import { fontStyles } from "../constants/typography";
import { IconMap } from "../components/Icons";

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        <ActionListRow
          title="Account Settings"
          iconName={IconMap.userPlaceholder}
          iconSize={24}
          outerRadius={40}
          onPress={() => navigation.navigate("AccountSettings")}
        />
        <View style={styles.divider} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white
  },
  content: {
    padding: 14
  },
  sectionTitle: {
    color: colors.neutrals900,
    ...fontStyles.mdBold,
  },
  divider: {
    height: 1,
    marginTop: 14,
    backgroundColor: colors.neutrals100
  }
});
