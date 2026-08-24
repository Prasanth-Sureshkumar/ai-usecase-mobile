import React from "react";
import { StyleSheet, Text } from "react-native";
import { colors } from "../constants/colors";

const MyText = ({ children, style, ...props }) => {
  return (
    <Text {...props} style={StyleSheet.compose(styles.text, style)}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.text,
  },
});

export default MyText;
