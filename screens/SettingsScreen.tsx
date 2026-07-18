import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SafeScreen from "../components/SafeScreen";
import { COLORS, SCREEN, withOpacity } from "../utils/Constants";
import { useAuth } from "../context/AuthContext";
import { useFastingContext } from "../context/FastingContext";
import { useLimitContext } from "../context/LimitContext";
import { deleteAccount } from "../utils/http";
import Ionicons from "@expo/vector-icons/Ionicons";

interface MenuRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle: string;
  onPress: () => void;
  isLast?: boolean;
}

// Not part of the shared palette (deletion is the only destructive action in the app today).
const DESTRUCTIVE_COLOR = "#D64545";

const MenuRow: React.FC<MenuRowProps> = ({
  icon,
  label,
  subtitle,
  onPress,
  isLast,
}) => (
  <TouchableOpacity
    style={[styles.menuItem, !isLast && styles.menuItemBorder]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuIconSquare}>
      <Ionicons name={icon} size={17} color={COLORS.primary} />
    </View>
    <View style={styles.menuContent}>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuSub}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={14} color={COLORS.chevron} />
  </TouchableOpacity>
);

const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const { logout } = useAuth();
  const { fastingConfig } = useFastingContext();
  const { limitConfig } = useLimitContext();
  const [isDeleting, setIsDeleting] = useState(false);

  const fastingSubtitle = fastingConfig
    ? `${fastingConfig.fastingWindow} : ${fastingConfig.eatingWindow}`
    : "—";

  const limitsSubtitle = limitConfig
    ? `${limitConfig.calorieLimit.toLocaleString()} kcal · ${limitConfig.proteinLimit}P · ${limitConfig.carbsLimit}C · ${limitConfig.fatLimit}F`
    : "—";

  const confirmDeleteAccount = () => {
    Alert.alert(
      "Delete account?",
      "This permanently deletes your account and all your data — fasting history, meals, dishes, body stats, and limits. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: handleDeleteAccount,
        },
      ],
    );
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      await logout();
    } catch (error) {
      console.error("Failed to delete account", error);
      Alert.alert(
        "Couldn't delete account",
        "Something went wrong while deleting your account. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeScreen style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.menuGroup}>
        <MenuRow
          icon="timer-outline"
          label="Fasting schedule"
          subtitle={fastingSubtitle}
          onPress={() =>
            navigation.navigate(SCREEN.fastingConfig, { fromSettings: true })
          }
        />
        <MenuRow
          icon="flag-outline"
          label="Macro limits"
          subtitle={limitsSubtitle}
          onPress={() =>
            navigation.navigate(SCREEN.limitConfig, { fromSettings: true })
          }
          isLast
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.7}>
        <Ionicons name="log-out-outline" size={16} color={COLORS.inactive} />
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={confirmDeleteAccount}
        activeOpacity={0.7}
        disabled={isDeleting}
      >
        <Ionicons name="trash-outline" size={16} color={DESTRUCTIVE_COLOR} />
        <Text style={styles.deleteText}>
          {isDeleting ? "Deleting…" : "Delete account"}
        </Text>
      </TouchableOpacity>
    </SafeScreen>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: -0.3,
    color: COLORS.text,
    marginBottom: 24,
  },
  menuGroup: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 18,
    marginBottom: 28,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 15,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: withOpacity(COLORS.text, 0.08),
  },
  menuIconSquare: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: withOpacity(COLORS.primary, 0.1),
    alignItems: "center",
    justifyContent: "center",
  },
  menuContent: {
    flex: 1,
    minWidth: 0,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  menuSub: {
    fontSize: 11.5,
    color: withOpacity(COLORS.text, 0.5),
    marginTop: 2,
    fontVariant: ["tabular-nums"],
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: withOpacity(COLORS.text, 0.14),
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.inactive,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: withOpacity(DESTRUCTIVE_COLOR, 0.3),
    marginTop: 12,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: "500",
    color: DESTRUCTIVE_COLOR,
  },
});
