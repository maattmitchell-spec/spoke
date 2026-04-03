import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useEvents } from "@/context/EventsContext";
import { useChat } from "@/context/ChatContext";
import type { EventType } from "@/constants/data";

const TYPE_BG: Record<EventType, string> = {
  ride: "#CC2E00",
  run: "#CC4400",
  hike: "#A83200",
  meetup: "#B84500",
};

const TYPE_LABEL: Record<EventType, string> = {
  ride: "Group Ride",
  run: "Trail Run",
  hike: "Hike",
  meetup: "Casual Meetup",
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "#52B788",
  moderate: "#E07B39",
  hard: "#D62828",
};

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { events, toggleJoin } = useEvents();
  const { getUnreadCount } = useChat();
  const isWeb = Platform.OS === "web";
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground }}>Event not found</Text>
      </View>
    );
  }

  const heroBg = TYPE_BG[event.type];
  const spotsLeft = event.maxAttendees - event.attendees;

  const handleJoin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 140, useNativeDriver: true }),
    ]).start();
    toggleJoin(event.id);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.hero,
          { backgroundColor: heroBg, paddingTop: (isWeb ? 67 : insets.top) + 12 },
        ]}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.heroContent}>
          <View style={[styles.typeTag, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <Text style={styles.typeTagText}>{TYPE_LABEL[event.type]}</Text>
          </View>
          <Text style={styles.heroTitle}>{event.title}</Text>
          <View style={styles.heroMeta}>
            <Feather name="calendar" size={13} color="rgba(255,255,255,0.7)" />
            <Text style={styles.heroMetaText}>
              {event.date} · {event.time}
            </Text>
          </View>
          <View style={styles.heroMeta}>
            <Feather name="map-pin" size={13} color="rgba(255,255,255,0.7)" />
            <Text style={styles.heroMetaText}>{event.location}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: (isWeb ? 34 : insets.bottom) + 100,
        }}
      >
        {(event.distance || event.elevation) && (
          <View style={[styles.statsStrip, { borderBottomColor: colors.border }]}>
            {event.distance && (
              <View style={styles.statItem}>
                <Text style={[styles.statVal, { color: colors.foreground }]}>
                  {event.distance}
                </Text>
                <Text style={[styles.statKey, { color: colors.mutedForeground }]}>
                  Distance
                </Text>
              </View>
            )}
            {event.elevation && (
              <View
                style={[
                  styles.statItem,
                  { borderLeftColor: colors.border, borderLeftWidth: 1 },
                ]}
              >
                <Text style={[styles.statVal, { color: colors.foreground }]}>
                  {event.elevation}
                </Text>
                <Text style={[styles.statKey, { color: colors.mutedForeground }]}>
                  Elevation
                </Text>
              </View>
            )}
            <View
              style={[
                styles.statItem,
                { borderLeftColor: colors.border, borderLeftWidth: 1 },
              ]}
            >
              <View style={styles.diffRow}>
                <View
                  style={[
                    styles.diffDot,
                    { backgroundColor: DIFFICULTY_COLOR[event.difficulty] },
                  ]}
                />
                <Text
                  style={[
                    styles.statVal,
                    { color: colors.foreground, textTransform: "capitalize" },
                  ]}
                >
                  {event.difficulty}
                </Text>
              </View>
              <Text style={[styles.statKey, { color: colors.mutedForeground }]}>
                Difficulty
              </Text>
            </View>
          </View>
        )}

        <View style={styles.body}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            About this event
          </Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            {event.description}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Hosted by
          </Text>
          <View
            style={[
              styles.hostCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <View
              style={[
                styles.hostAvatar,
                { backgroundColor: colors.primary, borderRadius: colors.radius },
              ]}
            >
              <Text style={[styles.hostAvatarText, { color: colors.primaryForeground }]}>
                {event.hostAvatar}
              </Text>
            </View>
            <View>
              <Text style={[styles.hostName, { color: colors.foreground }]}>
                {event.host}
              </Text>
              <Text style={[styles.hostLabel, { color: colors.mutedForeground }]}>
                Event organizer
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Attendance
          </Text>
          <View
            style={[
              styles.attendCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <Text style={[styles.attendNum, { color: colors.foreground }]}>
              {event.attendees}{" "}
              <Text style={[styles.attendOf, { color: colors.mutedForeground }]}>
                / {event.maxAttendees} spots filled
              </Text>
            </Text>
            <View
              style={[
                styles.progressTrack,
                { backgroundColor: colors.secondary, borderRadius: 4 },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: 4,
                    width: `${(event.attendees / event.maxAttendees) * 100}%`,
                  },
                ]}
              />
            </View>
            {spotsLeft > 0 && (
              <Text style={[styles.spotsLeft, { color: colors.mutedForeground }]}>
                {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining
              </Text>
            )}
          </View>

          <View style={styles.tagsRow}>
            {event.tags.map((tag) => (
              <View
                key={tag}
                style={[
                  styles.tag,
                  {
                    backgroundColor: colors.secondary,
                    borderRadius: colors.radius / 2,
                  },
                ]}
              >
                <Text style={[styles.tagText, { color: colors.mutedForeground }]}>
                  #{tag}
                </Text>
              </View>
            ))}
          </View>

          {event.isJoined && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Group Chat
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push(`/event/chat/${event.id}` as any)}
                style={[
                  styles.chatCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <View style={[styles.chatIcon, { backgroundColor: colors.secondary }]}>
                  <Feather name="message-circle" size={20} color={colors.primary} />
                </View>
                <View style={styles.chatInfo}>
                  <Text style={[styles.chatTitle, { color: colors.foreground }]}>
                    {event.title}
                  </Text>
                  <Text style={[styles.chatSub, { color: colors.mutedForeground }]}>
                    {event.attendees} member{event.attendees !== 1 ? "s" : ""} going
                  </Text>
                </View>
                <View style={styles.chatRight}>
                  {getUnreadCount(event.id) > 0 && (
                    <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                      <Text style={[styles.badgeText, { color: colors.primaryForeground }]}>
                        {getUnreadCount(event.id)}
                      </Text>
                    </View>
                  )}
                  <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: (isWeb ? 34 : insets.bottom) + 12,
          },
        ]}
      >
        <Animated.View style={[styles.joinWrap, { transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity
            onPress={handleJoin}
            activeOpacity={0.85}
            style={[
              styles.joinBtn,
              {
                backgroundColor: event.isJoined ? colors.secondary : colors.primary,
                borderRadius: colors.radius,
                borderWidth: event.isJoined ? 1 : 0,
                borderColor: colors.border,
              },
            ]}
          >
            {event.isJoined ? (
              <Feather name="check" size={18} color={colors.foreground} />
            ) : null}
            <Text
              style={[
                styles.joinText,
                {
                  color: event.isJoined
                    ? colors.foreground
                    : colors.primaryForeground,
                },
              ]}
            >
              {event.isJoined ? "Going — Tap to leave" : "Join this adventure"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroContent: { gap: 6 },
  typeTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  typeTagText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 26,
    fontFamily: "DMSans_700Bold",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  heroMetaText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  statsStrip: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statItem: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  statVal: {
    fontSize: 17,
    fontFamily: "DMSans_700Bold",
    letterSpacing: -0.3,
  },
  statKey: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
    marginTop: 2,
  },
  diffRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  diffDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  body: {
    padding: 20,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    lineHeight: 23,
  },
  hostCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1,
  },
  hostAvatar: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  hostAvatarText: {
    fontSize: 13,
    fontFamily: "DMSans_700Bold",
  },
  hostName: {
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
  },
  hostLabel: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    marginTop: 2,
  },
  attendCard: {
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  attendNum: {
    fontSize: 18,
    fontFamily: "DMSans_700Bold",
  },
  attendOf: {
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
  },
  progressTrack: {
    height: 6,
    width: "100%",
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
  },
  spotsLeft: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
  },
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1,
  },
  chatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  chatInfo: {
    flex: 1,
    gap: 2,
  },
  chatTitle: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
  },
  chatSub: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
  },
  chatRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "DMSans_700Bold",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  joinWrap: {
    width: "100%",
  },
  joinBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  joinText: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: 0.1,
  },
});
