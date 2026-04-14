import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { ScheduleCard } from "@/components/ScheduleCard";
import { SpokeWordmark } from "@/components/SpokeWordmark";
import { useColors } from "@/hooks/useColors";
import { useEvents } from "@/context/EventsContext";
import type { EventType } from "@/constants/data";

type Filter = "all" | EventType;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ride", label: "Rides" },
  { key: "run", label: "Runs" },
  { key: "hike", label: "Hikes" },
  { key: "meetup", label: "Meetups" },
];

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { events, toggleJoin } = useEvents();
  const [filter, setFilter] = useState<Filter>("all");

  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top;

  const filtered =
    filter === "all" ? events : events.filter((e) => e.type === filter);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.headerBar,
          {
            paddingTop: topPad + 6,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <SpokeWordmark size={28} />
        <View style={styles.headerRight}>
          <TouchableOpacity activeOpacity={0.7}>
            <Feather name="search" size={22} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/create-event")}
            style={[styles.createBtn, { backgroundColor: colors.primary }]}
          >
            <Feather name="plus" size={16} color={colors.primaryForeground} />
            <Text style={[styles.createBtnText, { color: colors.primaryForeground }]}>
              New
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.filterStrip, { borderBottomColor: colors.border }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              activeOpacity={0.7}
              onPress={() => setFilter(f.key)}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    filter === f.key ? colors.primary : colors.secondary,
                  borderRadius: 20,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      filter === f.key
                        ? colors.primaryForeground
                        : colors.foreground,
                  },
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
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
            <Feather name="compass" size={36} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No events in this category
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
  },
  createBtnText: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
  },
  filterStrip: {
    height: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
    height: 52,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  filterText: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
  },
  list: {
    paddingTop: 16,
  },
  empty: {
    alignItems: "center",
    gap: 12,
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
  },
});
