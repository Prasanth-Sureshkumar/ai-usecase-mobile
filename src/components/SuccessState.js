import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import { colors } from "../constants/colors";
import { fontStyles } from "../constants/typography";

export default function SuccessState({ title, message }) {
  const fieldSize = 260;
  const spacing = 12;

  const columns = Math.ceil(fieldSize / spacing);
  const rows = Math.ceil(fieldSize / spacing);

  const dots = Array.from({ length: columns * rows });

  const center = fieldSize / 2;
  const radius = fieldSize / 2;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.dotField,
          {
            width: fieldSize,
            height: fieldSize,
            borderRadius: fieldSize / 2,
          },
        ]}
      >
        {dots.map((_, index) => {
          const col = index % columns;
          const row = Math.floor(index / columns);

          const x = col * spacing + spacing / 2;
          const y = row * spacing + spacing / 2;

          const dx = x - center;
          const dy = y - center;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > radius) {
            return null;
          }

          const ratio = distance / radius;

          const dotSize = Math.max(1.2, 5 - ratio * 4);

          const opacity = Math.max(0.12, 0.48 - ratio * 0.36);

          return (
            <View
              key={index}
              style={[
                styles.dot,
                {
                left: x - dotSize / 2,
                top: y - dotSize / 2,
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: colors.neutrals300,
                opacity
                }
              ]}
            />
          );
        })}

        <View style={styles.checkCircle}>
          <Check
            size={74}
            color={colors.white}
            strokeWidth={3}
          />
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
  },
  dotField: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  dot: {
    position: "absolute"
  },
  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary500,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  title: {
    color: colors.neutrals900,
    textAlign: "center",
    ...fontStyles.xxlBold,
  },
  message: {
    marginTop: 10,
    color: colors.neutrals900,
    ...fontStyles.lgRegular,
    textAlign: "center",
    maxWidth: 320,
  },
});
