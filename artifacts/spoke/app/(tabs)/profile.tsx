import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BikeWheelIcon } from "@/components/SpokeWordmark";
import { useColors } from "@/hooks/useColors";
import { useEvents } from "@/context/EventsContext";
import { useUser } from "@/context/UserContext";
import type { Event, EventType } from "@/constants/data";

const STATS = [
  { label: "Rides", value: "12" },
  { label: "Miles", value: "418" },
  { label: "Elevation", value: "34k ft" },
];

const TYPE_META: Record<EventType, { icon: string; label: string; color: string }> = {
  ride: { icon: "wind", label: "RIDE", color: "#1A9E4F" },
  run: { icon: "activity", label: "RUN", color: "#0284C7" },
  hike: { icon: "triangle", label: "HIKE", color: "#D97706" },
  meetup: { icon: "users", label: "MEETUP", color: "#7C3AED" },
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
  const router = useRouter();
  const { joinedCount, joinedEvents } = useEvents();
  const { profile, requireAccount, updateAvatar, updateHeader, updateBio } = useUser();
  const isWeb = Platform.OS === "web";

  const recentActivity = joinedEvents.slice(-4).reverse();

  const handlePickAvatar = useCallback(() => {
    if (!profile) {
      requireAccount(() => {});
      return;
    }
    const launch = async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission needed",
            "Allow photo library access to set a profile picture.",
          );
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const uri = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;
        updateAvatar(uri);
      }
    };
    launch();
  }, [profile, requireAccount, updateAvatar]);

  const handlePickHeader = useCallback(() => {
    if (!profile) {
      requireAccount(() => {});
      return;
    }
    const launch = async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission needed", "Allow photo library access to set a cover photo.");
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [3, 1],
        quality: 0.65,
        base64: true,
      });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const uri = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;
        updateHeader(uri);
      }
    };
    launch();
  }, [profile, requireAccount, updateHeader]);

  const BIO_MAX = 200;
  const DEFAULT_BIO = "Remote worker. Weekend adventurer. Always looking for the next great trail or road.";
  const currentBio = profile?.bio ?? DEFAULT_BIO;

  const [editingBio, setEditingBio] = useState(false);
  const [draftBio, setDraftBio] = useState(currentBio);
  const bioInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (editingBio) {
      setTimeout(() => bioInputRef.current?.focus(), 80);
    }
  }, [editingBio]);

  const handleEditBio = useCallback(() => {
    if (!profile) { requireAccount(() => {}); return; }
    setDraftBio(currentBio);
    setEditingBio(true);
  }, [profile, requireAccount, currentBio]);

  const handleSaveBio = useCallback(() => {
    updateBio(draftBio.trim());
    setEditingBio(false);
  }, [draftBio, updateBio]);

  const handleCancelBio = useCallback(() => {
    setEditingBio(false);
    setDraftBio(currentBio);
  }, [currentBio]);

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
          { paddingTop: (isWeb ? 67 : insets.top) + 8 },
        ]}
      >
        {profile?.headerUri ? (
          <>
            <Image
              source={{ uri: profile.headerUri }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={300}
            />
            <LinearGradient
              colors={["rgba(0,0,0,0.18)", "rgba(0,0,0,0.62)"]}
              style={StyleSheet.absoluteFill}
            />
          </>
        ) : (
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: colors.primary }]}
          />
        )}

        <View style={styles.heroTop}>
          <BikeWheelIcon size={22} color="rgba(255,255,255,0.55)" />
          <View style={styles.heroTopRight}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={handlePickHeader}
              style={[styles.coverBtn, { backgroundColor: "rgba(0,0,0,0.30)" }]}
            >
              <Feather name="image" size={14} color="#fff" />
              <Text style={styles.coverBtnText}>
                {profile?.headerUri ? "Change cover" : "Add cover"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/settings")}
            >
              <Feather name="settings" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handlePickAvatar}
          style={styles.avatarWrap}
        >
          {profile?.avatarUri ? (
            <Image
              source={{ uri: profile.avatarUri }}
              style={styles.avatarLarge}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View
              style={[
                styles.avatarLarge,
                { backgroundColor: "rgba(255,255,255,0.2)" },
              ]}
            >
              <Text
                style={[styles.avatarLargeText, { color: colors.primaryForeground }]}
              >
                {initials}
              </Text>
            </View>
          )}
          {!!profile && (
            <View style={[styles.cameraBadge, { backgroundColor: colors.card }]}>
              <Feather name="camera" size={11} color={colors.foreground} />
            </View>
          )}
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
              borderColor: editingBio ? colors.primary : colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          {editingBio ? (
            <>
              <TextInput
                ref={bioInputRef}
                style={[
                  styles.bioInput,
                  { color: colors.foreground },
                ]}
                value={draftBio}
                onChangeText={(t) => setDraftBio(t.slice(0, BIO_MAX))}
                multiline
                placeholder="Tell the crew who you are..."
                placeholderTextColor={colors.mutedForeground}
                textAlignVertical="top"
                returnKeyType="default"
                blurOnSubmit={false}
              />
              <View style={styles.bioEditFooter}>
                <Text style={[styles.charCount, { color: colors.mutedForeground }]}>
                  {draftBio.length}/{BIO_MAX}
                </Text>
                <View style={styles.bioActions}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleCancelBio}
                    style={[
                      styles.bioActionBtn,
                      {
                        borderColor: colors.border,
                        borderRadius: colors.radius / 2,
                      },
                    ]}
                  >
                    <Text style={[styles.bioActionText, { color: colors.mutedForeground }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handleSaveBio}
                    style={[
                      styles.bioActionBtn,
                      {
                        backgroundColor: colors.primary,
                        borderRadius: colors.radius / 2,
                      },
                    ]}
                  >
                    <Text style={[styles.bioActionText, { color: colors.primaryForeground }]}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.bioText, { color: colors.mutedForeground }]}>
                {currentBio}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleEditBio}
                style={styles.editRow}
              >
                <Feather name="edit-2" size={13} color={colors.primary} />
                <Text style={[styles.editText, { color: colors.primary }]}>
                  Edit bio
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.activityHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Recent Activity
          </Text>
          {recentActivity.length > 0 && (
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </TouchableOpacity>
          )}
        </View>

        {recentActivity.length === 0 ? (
          <View
            style={[
              styles.emptyActivity,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <Feather name="calendar" size={28} color={colors.mutedForeground} style={{ marginBottom: 8 }} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No activity yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
              Events you join will appear here.
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.activityList,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            {recentActivity.map((event, index) => {
              const meta = TYPE_META[event.type];
              const isLast = index === recentActivity.length - 1;
              return (
                <View
                  key={event.id}
                  style={[
                    styles.activityCard,
                    !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
                  ]}
                >
                  <View style={styles.activityCardInner}>
                    <View
                      style={[
                        styles.activityIconBox,
                        { backgroundColor: meta.color + "18" },
                      ]}
                    >
                      <Feather
                        name={meta.icon as any}
                        size={16}
                        color={meta.color}
                      />
                    </View>
                    <View style={styles.activityInfo}>
                      <View style={styles.activityTopRow}>
                        <Text
                          style={[
                            styles.activityTypePill,
                            { color: meta.color },
                          ]}
                        >
                          {meta.label}
                        </Text>
                      </View>
                      <Text
                        style={[styles.activityTitle, { color: colors.foreground }]}
                        numberOfLines={1}
                      >
                        {event.title}
                      </Text>
                      <Text
                        style={[styles.activityMeta, { color: colors.mutedForeground }]}
                        numberOfLines={1}
                      >
                        {event.date} · {event.time} · {event.location}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.goingPill,
                        { backgroundColor: colors.secondary },
                      ]}
                    >
                      <Feather name="check" size={11} color={colors.primary} />
                      <Text style={[styles.goingText, { color: colors.primary }]}>
                        Going
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    overflow: "hidden",
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  heroTopRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  coverBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  coverBtnText: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
    color: "#fff",
  },
  avatarWrap: {
    width: 80,
    height: 80,
    marginBottom: 12,
    position: "relative",
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarLargeText: {
    fontSize: 24,
    fontFamily: "DMSans_700Bold",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
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
    borderWidth: 1.5,
  },
  bioText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
    marginBottom: 10,
  },
  bioInput: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
    minHeight: 80,
    marginBottom: 10,
    paddingTop: 0,
  },
  bioEditFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  charCount: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
  },
  bioActions: {
    flexDirection: "row",
    gap: 8,
  },
  bioActionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
  },
  bioActionText: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
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
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  seeAll: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
  },
  emptyActivity: {
    borderWidth: 1,
    padding: 32,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
  },
  activityList: {
    borderWidth: 1,
    overflow: "hidden",
  },
  activityCard: {},
  activityCardBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  activityCardInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  activityIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  activityInfo: {
    flex: 1,
    gap: 1,
  },
  activityTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityTypePill: {
    fontSize: 10,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: 0.6,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: -0.2,
  },
  activityMeta: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
  },
  goingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    flexShrink: 0,
  },
  goingText: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
  },
});
