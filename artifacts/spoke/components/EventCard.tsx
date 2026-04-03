import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";
import { useUser } from "@/context/UserContext";
import type { Event, EventType } from "@/constants/data";

const TYPE_ICON: Record<EventType, { set: string; name: string }> = {
  ride: { set: "ionicons", name: "bicycle-outline" },
  run: { set: "feather", name: "wind" },
  hike: { set: "feather", name: "triangle" },
  meetup: { set: "feather", name: "coffee" },
};

const TYPE_LABEL: Record<EventType, string> = {
  ride: "Ride",
  run: "Trail Run",
  hike: "Hike",
  meetup: "Meetup",
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "#52B788",
  moderate: "#E07B39",
  hard: "#D62828",
};

interface Props {
  event: Event;
  onToggleJoin: (id: string) => void;
}

export function EventCard({ event, onToggleJoin }: Props) {
  const colors = useColors();
  const { requireAccount } = useUser();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    router.push({ pathname: "/event/[id]", params: { id: event.id } });
  };

  const handleJoin = () => {
    requireAccount(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.94,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
      onToggleJoin(event.id);
    });
  };

  const spotsLeft = event.maxAttendees - event.attendees;
  const typeIcon = TYPE_ICON[event.type];

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}
    >
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
        <View style={styles.header}>
          <View
            style={[
              styles.typeChip,
              { backgroundColor: colors.muted, borderRadius: colors.radius / 2 },
            ]}
          >
            {typeIcon.set === "ionicons" ? (
              <Ionicons
                name={typeIcon.name as any}
                size={13}
                color={colors.mutedForeground}
              />
            ) : (
              <Feather
                name={typeIcon.name as any}
                size={13}
                color={colors.mutedForeground}
              />
            )}
            <Text style={[styles.typeLabel, { color: colors.mutedForeground }]}>
              {TYPE_LABEL[event.type]}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View
              style={[
                styles.diffDot,
                { backgroundColor: DIFFICULTY_COLOR[event.difficulty] },
              ]}
            />
            <Text style={[styles.diffLabel, { color: colors.mutedForeground }]}>
              {event.difficulty}
            </Text>
          </View>
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>
          {event.title}
        </Text>

        <View style={styles.metaRow}>
          <Feather name="calendar" size={12} color={colors.mutedForeground} />
          <Text style={[styles.meta, { color: colors.mutedForeground }]}>
            {event.date} · {event.time}
          </Text>
        </View>
        <View style={[styles.metaRow, { marginTop: 3 }]}>
          <Feather name="map-pin" size={12} color={colors.mutedForeground} />
          <Text style={[styles.meta, { color: colors.mutedForeground }]}>
            {event.location}
          </Text>
        </View>

        {(event.distance || event.elevation) && (
          <View style={styles.statsRow}>
            {event.distance && (
              <View
                style={[
                  styles.stat,
                  { backgroundColor: colors.secondary, borderRadius: colors.radius / 2 },
                ]}
              >
                <Text style={[styles.statValue, { color: colors.foreground }]}>
                  {event.distance}
                </Text>
                <Text style={[styles.statKey, { color: colors.mutedForeground }]}>
                  dist
                </Text>
              </View>
            )}
            {event.elevation && (
              <View
                style={[
                  styles.stat,
                  { backgroundColor: colors.secondary, borderRadius: colors.radius / 2 },
                ]}
              >
                <Text style={[styles.statValue, { color: colors.foreground }]}>
                  {event.elevation}
                </Text>
                <Text style={[styles.statKey, { color: colors.mutedForeground }]}>
                  elev
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.hostRow}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: colors.primary,
                  borderRadius: 14,
                },
              ]}
            >
              <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>
                {event.hostAvatar}
              </Text>
            </View>
            <View>
              <Text style={[styles.hostName, { color: colors.foreground }]}>
                {event.host}
              </Text>
              <Text style={[styles.spots, { color: colors.mutedForeground }]}>
                {event.attendees}/{event.maxAttendees} going
                {spotsLeft <= 3 && spotsLeft > 0
                  ? ` · ${spotsLeft} spots left`
                  : ""}
              </Text>
            </View>
          </View>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              onPress={handleJoin}
              activeOpacity={0.85}
              style={[
                styles.joinBtn,
                {
                  backgroundColor: event.isJoined ? colors.muted : colors.primary,
                  borderRadius: colors.radius,
                  borderWidth: event.isJoined ? 1 : 0,
                  borderColor: colors.border,
                },
              ]}
            >
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
                {event.isJoined ? "Going" : "Join"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  typeLabel: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  diffDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  diffLabel: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
    textTransform: "capitalize",
  },
  title: {
    fontSize: 18,
    fontFamily: "DMSans_700Bold",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  meta: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  stat: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
  },
  statValue: {
    fontSize: 13,
    fontFamily: "DMSans_700Bold",
  },
  statKey: {
    fontSize: 10,
    fontFamily: "DMSans_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  hostRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 11,
    fontFamily: "DMSans_700Bold",
  },
  hostName: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
  },
  spots: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
    marginTop: 1,
  },
  joinBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  joinText: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: 0.2,
  },
});
