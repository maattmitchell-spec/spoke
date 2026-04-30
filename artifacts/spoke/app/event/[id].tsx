import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  Image,
  ImageSourcePropType,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useEvents } from "@/context/EventsContext";
import { useChat } from "@/context/ChatContext";
import { useUser } from "@/context/UserContext";
import type { Event, EventType } from "@/constants/data";
import { RouteMap } from "@/components/RouteMap";

const MONTHS: Record<string, number> = {
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
  JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
};

function buildGoogleCalendarUrl(event: Event): string {
  const dateParts = event.date.toUpperCase().split(" ");
  const monthStr = dateParts.find((p) => MONTHS[p] !== undefined) ?? "JAN";
  const dayStr = dateParts.find((p) => /^\d+$/.test(p)) ?? "1";
  const month = MONTHS[monthStr] ?? 0;
  const day = parseInt(dayStr, 10);

  const timeMatch = event.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  let hour = timeMatch ? parseInt(timeMatch[1], 10) : 9;
  const minute = timeMatch ? parseInt(timeMatch[2], 10) : 0;
  const isPM = timeMatch ? timeMatch[3].toUpperCase() === "PM" : false;
  if (isPM && hour !== 12) hour += 12;
  if (!isPM && hour === 12) hour = 0;

  const now = new Date();
  let year = now.getFullYear();
  if (new Date(year, month, day) < now) year += 1;

  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

  const start = new Date(year, month, day, hour, minute);
  const end = new Date(year, month, day, hour + 2, minute);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: event.description,
    location: event.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const TYPE_IMAGES: Record<EventType, ImageSourcePropType> = {
  ride: require("@/assets/ride_header.jpg"),
  run: require("@/assets/run_header.jpg"),
  hike: require("@/assets/hike_header.jpg"),
  meetup: require("@/assets/meetup_header.jpg"),
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
  const { requireAccount } = useUser();
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

  const spotsLeft = event.maxAttendees - event.attendees;

  const handleJoin = () => {
    requireAccount(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 140, useNativeDriver: true }),
      ]).start();
      toggleJoin(event.id);
    });
  };

  const buildInviteMessage = () => {
    const lines = [
      `Hey! I'm doing this on Spoke and think you'd love it 👇`,
      ``,
      `${event.title}`,
      `📅  ${event.date} at ${event.time}`,
      `📍  ${event.location}`,
      ...(event.distance ? [`🏁  ${event.distance}${event.elevation ? `  ·  ${event.elevation} gain` : ""}`] : []),
      ``,
      `Download Spoke and join me: https://spokecommunity.app`,
    ];
    return lines.join("\n");
  };

  const handleTextInvite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const body = encodeURIComponent(buildInviteMessage());
    Linking.openURL(`sms:?body=${body}`).catch(() =>
      Linking.openURL(`imessage:?body=${body}`)
    );
  };

  const handleSocialShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share(
        { title: event.title, message: buildInviteMessage() },
        { dialogTitle: `Invite to ${event.title}` }
      );
    } catch {
      // user cancelled — no-op
    }
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const lines = [
      `${event.title}`,
      ``,
      `📅  ${event.date} at ${event.time}`,
      `📍  ${event.location}`,
      ...(event.distance ? [`🏁  ${event.distance}${event.elevation ? `  ·  ${event.elevation} gain` : ""}`] : []),
      ``,
      event.description,
      ``,
      `Join me on Spoke — the app for outdoor adventures with your crew.`,
    ];
    try {
      await Share.share(
        { title: event.title, message: lines.join("\n") },
        { dialogTitle: `Share ${event.title}` }
      );
    } catch {
      // user cancelled — no-op
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.hero}>
        {/* Stock photo */}
        <Image
          source={TYPE_IMAGES[event.type]}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        {/* Dark gradient so text stays readable */}
        <LinearGradient
          colors={["rgba(0,0,0,0.28)", "rgba(0,0,0,0.72)"]}
          style={StyleSheet.absoluteFill}
        />

        {/* Content sits on top of photo + gradient */}
        <View style={{ paddingTop: (isWeb ? 67 : insets.top) + 12, paddingHorizontal: 20, paddingBottom: 28, gap: 0 }}>
          <View style={styles.heroTopRow}>
            <TouchableOpacity
              style={styles.heroIconBtn}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.heroIconBtn}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <Feather name="share-2" size={19} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={[styles.heroContent, { marginTop: 16 }]}>
            <View style={[styles.typeTag, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
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
          {event.coordinates && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Location & Route
              </Text>
              <RouteMap
                coordinates={event.coordinates}
                location={event.location}
                type={event.type}
                ridewithgpsUrl={event.ridewithgpsUrl}
                alltrailsUrl={event.alltrailsUrl}
              />
            </>
          )}

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            About this event
          </Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            {event.description}
          </Text>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => Linking.openURL(buildGoogleCalendarUrl(event))}
            style={[
              styles.calendarBtn,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
            ]}
          >
            <Feather name="calendar" size={16} color={colors.primary} />
            <Text style={[styles.calendarBtnText, { color: colors.foreground }]}>
              Add to Google Calendar
            </Text>
            <Feather name="external-link" size={14} color={colors.mutedForeground} />
          </TouchableOpacity>

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

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Invite Friends
          </Text>
          <View
            style={[
              styles.inviteCard,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
            ]}
          >
            <Text style={[styles.inviteSubtitle, { color: colors.mutedForeground }]}>
              Get your crew moving — share this activity and let them sign up on Spoke.
            </Text>
            <View style={styles.inviteButtons}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={handleTextInvite}
                style={[
                  styles.inviteBtn,
                  { backgroundColor: colors.primary, borderRadius: colors.radius / 1.5 },
                ]}
              >
                <Feather name="message-square" size={15} color="#fff" />
                <Text style={styles.inviteBtnText}>Text a Friend</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={handleSocialShare}
                style={[
                  styles.inviteBtn,
                  styles.inviteBtnOutline,
                  { borderColor: colors.border, borderRadius: colors.radius / 1.5, backgroundColor: colors.secondary },
                ]}
              >
                <Feather name="share-2" size={15} color={colors.foreground} />
                <Text style={[styles.inviteBtnText, { color: colors.foreground }]}>Share to Socials</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Group Chat
          </Text>
          {event.isJoined ? (
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
          ) : (
            <View
              style={[
                styles.chatCard,
                styles.chatLocked,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                },
              ]}
            >
              <View style={[styles.chatIcon, { backgroundColor: colors.secondary }]}>
                <Feather name="lock" size={18} color={colors.mutedForeground} />
              </View>
              <View style={styles.chatInfo}>
                <Text style={[styles.chatTitle, { color: colors.foreground }]}>
                  Members only
                </Text>
                <Text style={[styles.chatSub, { color: colors.mutedForeground }]}>
                  Join this event to access the group chat
                </Text>
              </View>
            </View>
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
    overflow: "hidden",
    minHeight: 240,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  heroIconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.18)",
    borderRadius: 18,
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
  chatLocked: {
    opacity: 0.7,
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
  calendarBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  calendarBtnText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
  },
  inviteCard: {
    borderWidth: 1,
    padding: 16,
    gap: 14,
    marginBottom: 8,
  },
  inviteSubtitle: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    lineHeight: 19,
  },
  inviteButtons: {
    flexDirection: "row",
    gap: 10,
  },
  inviteBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  inviteBtnOutline: {
    borderWidth: 1,
  },
  inviteBtnText: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
    color: "#fff",
  },
});
