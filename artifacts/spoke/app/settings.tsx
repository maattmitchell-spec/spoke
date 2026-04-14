import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";

type ThemeOption = "light" | "dark" | "system";
const THEME_OPTIONS: ThemeOption[] = ["light", "dark", "system"];
const THEME_ICONS: Record<ThemeOption, string> = {
  light: "sun",
  dark: "moon",
  system: "monitor",
};

const ACCOUNT_ITEMS = [
  { icon: "user", label: "Edit profile" },
  { icon: "lock", label: "Change password" },
  { icon: "bell", label: "Notifications" },
  { icon: "shield", label: "Privacy" },
];

const APP_ITEMS = [
  { icon: "map", label: "Saved routes" },
  { icon: "users", label: "Invite friends" },
  { icon: "info", label: "About Spoke" },
  { icon: "star", label: "Rate the app" },
];

function SectionHeader({ title, colors }: { title: string; colors: any }) {
  return (
    <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
      {title}
    </Text>
  );
}

function SettingsRow({
  icon,
  label,
  right,
  onPress,
  isLast,
  colors,
}: {
  icon: string;
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
  colors: any;
}) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      style={[
        styles.row,
        !isLast && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.iconBox, { backgroundColor: colors.secondary }]}>
          <Feather name={icon as any} size={15} color={colors.primary} />
        </View>
        <Text style={[styles.rowLabel, { color: colors.foreground }]}>{label}</Text>
      </View>
      {right ?? (
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { preference, setPreference } = useTheme();
  const { profile, requireAccount, signOut } = useUser();
  const isWeb = Platform.OS === "web";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: (isWeb ? 67 : insets.top) + 4,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={12}
        >
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Settings
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: (isWeb ? 34 : insets.bottom) + 32,
          paddingTop: 8,
        }}
      >
        <View style={styles.section}>
          <SectionHeader title="Appearance" colors={colors} />
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.secondary }]}>
                  <Feather
                    name={THEME_ICONS[preference] as any}
                    size={15}
                    color={colors.primary}
                  />
                </View>
                <Text style={[styles.rowLabel, { color: colors.foreground }]}>
                  Theme
                </Text>
              </View>
              <View
                style={[
                  styles.themeToggle,
                  { backgroundColor: colors.secondary, borderRadius: colors.radius },
                ]}
              >
                {THEME_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    activeOpacity={0.7}
                    onPress={() => setPreference(opt)}
                    style={[
                      styles.themeOption,
                      preference === opt && {
                        backgroundColor: colors.primary,
                        borderRadius: colors.radius - 2,
                      },
                    ]}
                  >
                    <Feather
                      name={THEME_ICONS[opt] as any}
                      size={13}
                      color={
                        preference === opt
                          ? colors.primaryForeground
                          : colors.mutedForeground
                      }
                    />
                    <Text
                      style={[
                        styles.themeOptionText,
                        {
                          color:
                            preference === opt
                              ? colors.primaryForeground
                              : colors.mutedForeground,
                        },
                      ]}
                    >
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Account" colors={colors} />
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            {ACCOUNT_ITEMS.map((item, i) => (
              <SettingsRow
                key={item.label}
                icon={item.icon}
                label={item.label}
                onPress={() => {
                  if (!profile) requireAccount(() => {});
                }}
                isLast={i === ACCOUNT_ITEMS.length - 1}
                colors={colors}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="App" colors={colors} />
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            {APP_ITEMS.map((item, i) => (
              <SettingsRow
                key={item.label}
                icon={item.icon}
                label={item.label}
                isLast={i === APP_ITEMS.length - 1}
                colors={colors}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={signOut}
              style={[styles.row, { justifyContent: "center" }]}
            >
              <Text style={[styles.dangerLabel, { color: "#DC2626" }]}>
                Sign out
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>
          Spoke v1.0 · Made for remote adventurers
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 36 },
  headerTitle: {
    fontSize: 17,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: -0.2,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 2,
  },
  card: {
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
  },
  themeToggle: {
    flexDirection: "row",
    padding: 3,
    gap: 2,
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  themeOptionText: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
  },
  dangerLabel: {
    fontSize: 15,
    fontFamily: "DMSans_500Medium",
  },
  version: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    marginTop: 28,
  },
});
