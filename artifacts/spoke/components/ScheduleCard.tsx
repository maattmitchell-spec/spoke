import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";
import { useUser } from "@/context/UserContext";
import type { Event, EventType } from "@/constants/data";

const TYPE_IMAGES: Record<EventType, ImageSourcePropType> = {
  ride: require("@/assets/ride_header.jpg"),
  run: require("@/assets/run_header.jpg"),
  hike: require("@/assets/hike_header.jpg"),
  meetup: require("@/assets/meetup_header.jpg"),
};

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

export function ScheduleCard({ event, onToggleJoin }: Props) {
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
      style={({ pressed }) => [{ opacity: pressed ? 0.93 : 1 }]}
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
        <View style={[styles.photoWrap, { borderRadius: colors.radius }]}>
          <Image
            source={TYPE_IMAGES[event.type]}
            style={styles.photo}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.72)"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.photoContent}>
            <View style={styles.typePill}>
              {typeIcon.set === "ionicons" ? (
                <Ionicons name={typeIcon.name as any} size={12} color="#fff" />
              ) : (
                <Feather name={typeIcon.name as any} size={12} color="#fff" />
              )}
              <Text style={styles.typePillText}>{TYPE_LABEL[event.type]}</Text>
            </View>
            <Text style={styles.photoTitle} numberOfLines={2}>
              {event.title}
            </Text>
          </View>

          <View style={styles.diffBadge}>
            <View
              style={[
                styles.diffDot,
                { backgroundColor: DIFFICULTY_COLOR[event.difficulty] },
              ]}
            />
            <Text style={styles.diffText}>
              {event.difficulty.charAt(0).toUpperCase() + event.difficulty.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.metaRow}>
            <Feather name="calendar" size={13} color={colors.mutedForeground} />
            <Text style={[styles.meta, { color: colors.mutedForeground }]}>
              {event.date} · {event.time}
            </Text>
          </View>
          <View style={[styles.metaRow, { marginTop: 4 }]}>
            <Feather name="map-pin" size={13} color={colors.mutedForeground} />
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
                    {
                      backgroundColor: colors.secondary,
                      borderRadius: colors.radius / 2,
                    },
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
                    {
                      backgroundColor: colors.secondary,
                      borderRadius: colors.radius / 2,
                    },
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
                  { backgroundColor: colors.primary, borderRadius: 14 },
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
                {event.isJoined && (
                  <Feather name="check" size={13} color={colors.foreground} />
                )}
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
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  photoWrap: {
    height: 148,
    overflow: "hidden",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoContent: {
    position: "absolute",
    bottom: 12,
    left: 14,
    right: 14,
    gap: 5,
  },
  typePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  typePillText: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    color: "#fff",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  photoTitle: {
    fontSize: 19,
    fontFamily: "DMSans_700Bold",
    color: "#fff",
    letterSpacing: -0.4,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  diffBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  diffDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  diffText: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    color: "#fff",
    textTransform: "capitalize",
  },
  body: {
    padding: 14,
    paddingTop: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
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
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  joinText: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: 0.2,
  },
});
