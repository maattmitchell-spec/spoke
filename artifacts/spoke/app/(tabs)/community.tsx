import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MemberCard } from "@/components/MemberCard";
import { useColors } from "@/hooks/useColors";
import { SAMPLE_MEMBERS } from "@/constants/data";

export default function CommunityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.headerBar,
          {
            paddingTop: (isWeb ? 67 : insets.top) + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          Community
        </Text>
        <View
          style={[
            styles.memberCount,
            { backgroundColor: colors.secondary, borderRadius: 12 },
          ]}
        >
          <Text style={[styles.memberCountText, { color: colors.foreground }]}>
            {SAMPLE_MEMBERS.length} members
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.bannerStrip,
          { backgroundColor: colors.primary + "14", borderBottomColor: colors.primary + "30" },
        ]}
      >
        <Feather name="zap" size={13} color={colors.primary} />
        <Text style={[styles.bannerText, { color: colors.primary }]}>
          The people who make Spoke unforgettable
        </Text>
      </View>

      <FlatList
        data={SAMPLE_MEMBERS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MemberCard member={item} />}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom: (isWeb ? 34 : insets.bottom) + 16,
          },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontFamily: "DMSans_700Bold",
    letterSpacing: -0.5,
  },
  memberCount: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  memberCountText: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
  },
  bannerStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  bannerText: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    fontStyle: "italic",
  },
  list: { paddingTop: 14 },
});
