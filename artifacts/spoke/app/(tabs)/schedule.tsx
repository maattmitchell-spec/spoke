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

import { ScheduleCard } from "@/components/ScheduleCard";
import { useColors } from "@/hooks/useColors";
import { useEvents } from "@/context/EventsContext";

export default function ScheduleScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { events, toggleJoin } = useEvents();
  const isWeb = Platform.OS === "web";

  const joined = events.filter((e) => e.isJoined);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.headerBar,
          {
            paddingTop: (isWeb ? 67 : insets.top) + 6,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          My Schedule
        </Text>
        <Text style={[styles.count, { color: colors.mutedForeground }]}>
          {joined.length} event{joined.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        data={joined}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ScheduleCard event={item} onToggleJoin={toggleJoin} />
        )}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom: (isWeb ? 34 : insets.bottom) + 16,
          },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="calendar" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No events yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Join an adventure from the Explore tab
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontFamily: "DMSans_700Bold",
    letterSpacing: -0.5,
  },
  count: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  list: { paddingTop: 16 },
  empty: {
    alignItems: "center",
    gap: 10,
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "DMSans_700Bold",
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
});
