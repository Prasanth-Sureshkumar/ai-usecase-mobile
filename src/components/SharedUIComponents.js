import React from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { colors } from "../constants/colors";
import { fontStyles, weights } from "../constants/typography";
import Icon, { IconMap } from "./Icons";
import MyText from "./MyText";

const composeActionRowStyle = ({ pressed, onPress, withDivider }) =>
  StyleSheet.compose(
    StyleSheet.compose(styles.row, withDivider && styles.rowDivider),
    pressed && onPress && styles.pressed,
  );

const composeDialogButtonStyle = ({
  pressed,
  loading,
  destructive,
  outline = false,
}) => {
  const buttonVariant = outline
    ? styles.outlineButton
    : destructive
    ? styles.destructiveButton
    : styles.primaryButton;

  return StyleSheet.compose(
    StyleSheet.compose(
      StyleSheet.compose(styles.dialogButton, buttonVariant),
      pressed && styles.pressed,
    ),
    loading && styles.disabled,
  );
};

export const Avatar = ({
  uri,
  source,
  size = 75,
  editable = false,
  onPress,
  style,
}) => {
  const imageSource = source || (uri ? { uri } : null);

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={StyleSheet.compose({ width: size, height: size }, style)}
    >
      {imageSource ? (
        <Image
          source={imageSource}
          style={StyleSheet.compose(styles.avatar, {
            width: size,
            height: size,
            borderRadius: size / 2,
          })}
        />
      ) : null}
      {editable ? (
        <View style={styles.avatarEdit}>
          <Icon name={IconMap.pencil} color={colors.white} size={14} />
        </View>
      ) : null}
    </Pressable>
  );
};
export const GlyphBadge = ({
  iconName,
  iconSize,
  outerRadius,
  color = colors.neutrals900,
  backgroundColor = colors.neutrals100,
}) => {
  return (
    <View
      style={StyleSheet.compose(
        StyleSheet.compose(styles.glyphBadge, {
          width: outerRadius,
          height: outerRadius,
          borderRadius: outerRadius / 2,
        }),
        { backgroundColor },
      )}
    >
      <Icon name={iconName} size={iconSize} color={color} />
    </View>
  );
};
export const RoundChevron = ({}) => {
  return (
    <View style={styles.chevronCircle}>
      <Icon name={IconMap.rightOpen} color={colors.white} size={10} />
    </View>
  );
};
export const ActionListRow = ({
  title,
  iconName,
  onPress,
  showChevron = true,
  withDivider = false,
  color = colors.neutrals900,
  outerRadius = 0,
  iconSize = 0,
  backgroundColor = colors.neutrals100,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) =>
        composeActionRowStyle({ pressed, onPress, withDivider })
      }
    >
      <GlyphBadge
        iconName={iconName}
        iconSize={iconSize}
        outerRadius={outerRadius}
        color={color}
        backgroundColor={backgroundColor}
      />

      <MyText
        style={StyleSheet.compose(styles.rowTitle, { color: color })}
        numberOfLines={1}
      >
        {title}
      </MyText>
      {showChevron ? <RoundChevron /> : null}
    </Pressable>
  );
};
export const InfoRow = ({
  iconName = null,
  color = colors.neutrals900,
  outerRadius = 0,
  iconSize = 0,
  backgroundColor = colors.neutrals100,
  value = null,
}) => {
  return (
    <View style={styles.infoRow}>
      <GlyphBadge
        iconName={iconName}
        iconSize={iconSize}
        outerRadius={outerRadius}
        color={color}
        backgroundColor={backgroundColor}
      />

      <MyText style={styles.infoText} numberOfLines={1}>
        {value}
      </MyText>
    </View>
  );
};
export const ConfirmationDialog = ({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  loading = false,
  onCancel,
  onConfirm,
  destructive = true,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={loading ? undefined : onCancel}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>
              <View
                style={StyleSheet.compose(
                  styles.alertIcon,
                  !destructive && styles.successIcon,
                )}
              >
                {destructive ? (
                  <Icon
                    name={IconMap.caution}
                    color={colors.red600}
                    size={38}
                  />
                ) : (
                  <Icon
                    name={IconMap.check}
                    color={colors.primary500}
                    size={34}
                  />
                )}
              </View>
              <MyText style={styles.dialogTitle}>{title}</MyText>
              <MyText style={styles.dialogMessage}>{message}</MyText>
              <View style={styles.dialogActions}>
                <Pressable
                  disabled={loading}
                  onPress={onConfirm}
                  style={({ pressed }) =>
                    composeDialogButtonStyle({
                      pressed,
                      loading,
                      destructive,
                    })
                  }
                >
                  {loading ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <MyText style={styles.filledButtonText}>
                      {confirmLabel}
                    </MyText>
                  )}
                </Pressable>
                {onCancel && (
                  <Pressable
                    disabled={loading}
                    onPress={onCancel}
                    style={({ pressed }) =>
                      composeDialogButtonStyle({
                        pressed,
                        destructive,
                        outline: true,
                      })
                    }
                  >
                    <MyText style={styles.outlineButtonText}>
                      {cancelLabel}
                    </MyText>
                  </Pressable>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
export const PhotoActionSheet = ({
  visible,
  hasImage = true,
  onUpload,
  onCapture,
  onRemove,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <MyText style={styles.sheetTitle}>Profile Photo</MyText>
              <SheetAction label="Upload Image" onPress={onUpload} />
              <SheetAction label="Capture Image" onPress={onCapture} />
              {hasImage ? (
                <SheetAction label="Remove Image" onPress={onRemove} danger />
              ) : null}
              <SheetAction label="Cancel" onPress={onCancel} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
const SheetAction = ({ label, onPress, danger = false }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) =>
        StyleSheet.compose(styles.sheetAction, pressed && styles.pressed)
      }
    >
      <MyText
        style={StyleSheet.compose(
          styles.sheetActionText,
          danger && styles.dangerText,
        )}
      >
        {label}
      </MyText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 2,
    borderColor: colors.neutrals100,
  },
  avatarEdit: {
    position: "absolute",
    right: 4,
    bottom: 4,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary500,
    borderWidth: 2,
    borderColor: colors.white,
  },
  glyphBadge: {
    alignItems: "center",
    justifyContent: "center",
  },
  glyphText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: weights.bold,
  },
  chevronCircle: {
    width: 20,
    height: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary500,
  },
  dangerChevron: {
    backgroundColor: colors.redText,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 15,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.neutrals100,
  },
  rowTitle: {
    flex: 1,
    color: colors.neutrals900,
    ...fontStyles.smRegular,
  },
  dangerText: {
    color: colors.redText,
  },
  infoRow: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  infoText: {
    flex: 1,
    color: colors.neutrals900,
    ...fontStyles.smRegular,
  },
  pressed: {
    opacity: 0.76,
  },
  disabled: {
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.32)",
    paddingHorizontal: 24,
  },
  dialog: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 8,
    backgroundColor: colors.white,
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 22,
  },
  alertIcon: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  successIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primarySoft,
  },
  dialogTitle: {
    color: colors.neutrals900,
    ...fontStyles.lgBold,
    textAlign: "center",
    marginTop: 8,
  },
  dialogMessage: {
    color: colors.neutrals900,
    ...fontStyles.smRegular,
    textAlign: "center",
    marginTop: 10,
  },
  dialogActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 22,
  },
  dialogButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  destructiveButton: {
    backgroundColor: colors.red600,
  },
  primaryButton: {
    backgroundColor: colors.primary500,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  filledButtonText: {
    color: colors.white,
    ...fontStyles.smRegular,
  },
  outlineButtonText: {
    color: colors.neutrals900,
    ...fontStyles.smRegular,
  },
  sheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.28)",
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 32,
  },
  sheetTitle: {
    color: colors.neutrals900,
    ...fontStyles.lgBold,
    marginBottom: 10,
  },
  sheetAction: {
    minHeight: 52,
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  sheetActionText: {
    color: colors.neutrals900,
    ...fontStyles.mdRegular,
  },
});
