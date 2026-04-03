import { Feather } from "@expo/vector-icons";
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

import { BikeWheelIcon } from "@/components/SpokeWordmark";
import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/context/ThemeContext";
import { useEvents } from "@/context/EventsContext";
import { useUser } from "@/context/UserContext";

const STATS = [
  { label: "Rides", value: "12" },
  { label: "Miles", value: "418" },
  { label: "Elevation", value: "34k ft" },
];

const SETTINGS_ITEMS = [
  { icon: "bell", label: "Notifications" },
  { icon: "map", label: "Saved Routes" },
  { icon: "users", label: "Invite Friends" },
  { icon: "shield", label: "Privacy" },
  { icon: "info", label: "About Spoke" },
];

type ThemeOption = "light" | "dark" | "system";
const THEME_OPTIONS: ThemeOption[] = ["light", "dark", "system"];
const THEME_ICONS: Record<ThemeOption, string> = {
  light: "sun",
  dark: "moon",
  system: "monitor",
};

function getInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { joinedCount } = useEvents();
  const { preference, setPreference } = useTheme();
  const { profile, requireAccount } = useUser();
  const isWeb = Platform.OS === "web";

  const displayName = profile?.name ?? "Your Name";
  const initials = profile ? getInitials(profile.name) : "YO";
  const locationLine = [
    profile?.location,
    profile ? `Member since ${profile.joinedYear}` : null,
  ]
    .filter(Boolean)
    .join(" · ") || "San Francisco, CA · Member since 2024";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingBottom: (isWeb ? 34 : insets.bottom) + 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.hero,
          {
            paddingTop: (isWeb ? 67 : insets.top) + 8,
            backgroundColor: colors.primary,
          },
        ]}
      >
        <View style={styles.heroTop}>
          <BikeWheelIcon size={22} color={colors.primaryForeground + "60"} />
          <TouchableOpacity activeOpacity={0.7}>
            <Feather name="settings" size={20} color={colors.primaryForeground} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={profile ? 1 : 0.8}
          onPress={profile ? undefined : () => requireAccount(() => {})}
          style={styles.avatarLarge}
        >
          <Text style={[styles.avatarLargeText, { color: colors.primaryForeground }]}>
            {initials}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.heroName, { color: colors.primaryForeground }]}>
          {displayName}
        </Text>
        <Text style={[styles.heroLocation, { color: colors.primaryForeground + "AA" }]}>
          {locationLine}
        </Text>

        {!profile && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => requireAccount(() => {})}
            style={[styles.setupBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}
          >
            <Feather name="user-plus" size={14} color={colors.primaryForeground} />
            <Text style={[styles.setupBtnText, { color: colors.primaryForeground }]}>
              Set up your profile
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primaryForeground }]}>
                {s.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.primaryForeground + "99" }]}>
                {s.label}
              </Text>
            </View>
          ))}
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primaryForeground }]}>
              {joinedCount}
            </Text>
            <Text style={[styles.statLabel, { color: colors.primaryForeground + "99" }]}>
              Events
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Badges
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.badgeRow}>
            {["Early Adopter", "New Member", "First Ride", "Community"].map(
              (b) => (
                <View
                  key={b}
                  style={[
                    styles.badge,
                    {
                      backgroundColor: colors.secondary,
                      borderColor: colors.border,
                      borderRadius: colors.radius,
                    },
                  ]}
                >
                  <Feather name="award" size={16} color={colors.primary} />
                  <Text style={[styles.badgeText, { color: colors.foreground }]}>
                    {b}
                  </Text>
                </View>
              )
            )}
          </View>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Bio
        </Text>
        <View
          style={[
            styles.bioCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Text style={[styles.bioText, { color: colors.mutedForeground }]}>
            Remote worker. Weekend adventurer. Always looking for the next great
            trail or road.
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.editRow}
          >
            <Feather name="edit-2" size={13} color={colors.primary} />
            <Text style={[styles.editText, { color: colors.primary }]}>Edit bio</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Settings
        </Text>
        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <View
            style={[
              styles.settingsRow,
              {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <View style={styles.settingsLeft}>
              <Feather
                name={THEME_ICONS[preference] as any}
                size={17}
                color={colors.foreground}
              />
              <Text style={[styles.settingsLabel, { color: colors.foreground }]}>
                Appearance
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
                    size={14}
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

          {SETTINGS_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.7}
              style={[
                styles.settingsRow,
                index < SETTINGS_ITEMS.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <View style={styles.settingsLeft}>
                <Feather name={item.icon as any} size={17} color={colors.foreground} />
                <Text style={[styles.settingsLabel, { color: colors.foreground }]}>
                  {item.label}
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarLargeText: {
    fontSize: 22,
    fontFamily: "DMSans_700Bold",
  },
  heroName: {
    fontSize: 24,
    fontFamily: "DMSans_700Bold",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  heroLocation: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    marginBottom: 12,
  },
  setupBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  setupBtnText: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
  },
  statsRow: {
    flexDirection: "row",
    gap: 28,
  },
  statItem: {
    alignItems: "flex-start",
  },
  statValue: {
    fontSize: 22,
    fontFamily: "DMSans_700Bold",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
  },
  bioCard: {
    padding: 14,
    borderWidth: 1,
  },
  bioText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
    marginBottom: 10,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  editText: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
  },
  settingsCard: {
    borderWidth: 1,
    overflow: "hidden",
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingsLabel: {
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
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  themeOptionText: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
  },
});
