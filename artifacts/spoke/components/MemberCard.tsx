import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import type { Member } from "@/constants/data";

interface Props {
  member: Member;
}

const ROLE_COLORS: Record<string, string> = {
  "Ride Captain": "#556B2F",
  "Trail Ambassador": "#7A9B30",
  "Community Host": "#FFB800",
  Member: "#6B7D72",
};

export function MemberCard({ member }: Props) {
  const colors = useColors();

  const roleColor = ROLE_COLORS[member.role] ?? colors.mutedForeground;

  return (
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
      <View style={styles.top}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: colors.primary, borderRadius: colors.radius },
          ]}
        >
          <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>
            {member.avatar}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.foreground }]}>
            {member.name}
          </Text>
          <Text style={[styles.role, { color: roleColor }]}>{member.role}</Text>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={11} color={colors.mutedForeground} />
            <Text style={[styles.location, { color: colors.mutedForeground }]}>
              {member.location}
            </Text>
          </View>
        </View>
        <View style={styles.statBlock}>
          <Text style={[styles.statNum, { color: colors.foreground }]}>
            {member.eventsAttended}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            rides
          </Text>
        </View>
      </View>
      <Text
        style={[styles.bio, { color: colors.mutedForeground }]}
        numberOfLines={2}
      >
        {member.bio}
      </Text>
      <View style={styles.badges}>
        {member.badges.map((b) => (
          <View
            key={b}
            style={[
              styles.badge,
              {
                backgroundColor: colors.secondary,
                borderRadius: colors.radius / 2,
              },
            ]}
          >
            <Text style={[styles.badgeText, { color: colors.foreground }]}>
              {b}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  top: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 15,
    fontFamily: "DMSans_700Bold",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: "DMSans_700Bold",
    marginBottom: 2,
  },
  role: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  location: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
  },
  statBlock: {
    alignItems: "center",
  },
  statNum: {
    fontSize: 20,
    fontFamily: "DMSans_700Bold",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: "DMSans_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bio: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    lineHeight: 19,
    marginBottom: 10,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
  },
});
