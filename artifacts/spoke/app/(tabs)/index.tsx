import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

type TypeFilter = "all" | EventType;
type DiffFilter = "all" | "easy" | "moderate" | "hard";

const TYPE_FILTERS: { key: TypeFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ride", label: "Rides" },
  { key: "run", label: "Runs" },
  { key: "hike", label: "Hikes" },
  { key: "meetup", label: "Meetups" },
];

const DIFF_FILTERS: { key: DiffFilter; label: string; color: string }[] = [
  { key: "all", label: "Any level", color: "" },
  { key: "easy", label: "Easy", color: "#52B788" },
  { key: "moderate", label: "Moderate", color: "#E07B39" },
  { key: "hard", label: "Hard", color: "#D62828" },
];

const MONTH_ORDER: Record<string, number> = {
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
  JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
};

function parseDateStr(raw: string) {
  // "SAT APR 5" → { dayLetter, dayNum, month, sortKey }
  const parts = raw.split(" ");
  const dayLetter = parts[0]?.charAt(0) ?? "?";
  const month = parts[1] ?? "";
  const dayNum = parseInt(parts[2] ?? "0", 10);
  const sortKey = (MONTH_ORDER[month] ?? 0) * 100 + dayNum;
  return { dayLetter, dayNum, month, raw, sortKey };
}

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { events, toggleJoin } = useEvents();

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [diffFilter, setDiffFilter] = useState<DiffFilter>("all");
  const [locationQuery, setLocationQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top;

  // Unique sorted calendar days derived from all events
  const calendarDays = useMemo(() => {
    const seen = new Set<string>();
    const days: ReturnType<typeof parseDateStr>[] = [];
    for (const e of events) {
      if (!seen.has(e.date)) {
        seen.add(e.date);
        days.push(parseDateStr(e.date));
      }
    }
    days.sort((a, b) => a.sortKey - b.sortKey);
    return days;
  }, [events]);

  const filtered = events.filter((e) => {
    const matchesType = typeFilter === "all" || e.type === typeFilter;
    const matchesDiff = diffFilter === "all" || e.difficulty === diffFilter;
    const matchesLocation =
      locationQuery.trim() === "" ||
      e.location.toLowerCase().includes(locationQuery.toLowerCase()) ||
      e.title.toLowerCase().includes(locationQuery.toLowerCase());
    const matchesDate = dateFilter === null || e.date === dateFilter;
    return matchesType && matchesDiff && matchesLocation && matchesDate;
  });

  const activeFilterCount =
    (typeFilter !== "all" ? 1 : 0) +
    (diffFilter !== "all" ? 1 : 0) +
    (locationQuery.trim() !== "" ? 1 : 0) +
    (dateFilter !== null ? 1 : 0);

  function clearAll() {
    setTypeFilter("all");
    setDiffFilter("all");
    setLocationQuery("");
    setDateFilter(null);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ── Header ── */}
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

      {/* ── Search ── */}
      <View
        style={[
          styles.searchRow,
          { borderBottomColor: colors.border, backgroundColor: colors.background },
        ]}
      >
        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.secondary, borderRadius: 12 },
          ]}
        >
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search by location or name…"
            placeholderTextColor={colors.mutedForeground}
            value={locationQuery}
            onChangeText={setLocationQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {locationQuery.length > 0 && (
            <TouchableOpacity onPress={() => setLocationQuery("")} hitSlop={8}>
              <Feather name="x-circle" size={15} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>

        {activeFilterCount > 0 && (
          <TouchableOpacity
            onPress={clearAll}
            style={[styles.clearBtn, { borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.clearText, { color: colors.mutedForeground }]}>
              Clear
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Calendar day strip ── */}
      <View style={[styles.calendarStrip, { borderBottomColor: colors.border }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarRow}
        >
          {/* "All" pill */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setDateFilter(null)}
            style={[
              styles.allPill,
              {
                backgroundColor: dateFilter === null ? colors.primary : colors.secondary,
                borderRadius: 20,
              },
            ]}
          >
            <Text
              style={[
                styles.allPillText,
                { color: dateFilter === null ? colors.primaryForeground : colors.mutedForeground },
              ]}
            >
              All dates
            </Text>
          </TouchableOpacity>

          {/* One tile per unique event day */}
          {calendarDays.map((d) => {
            const active = dateFilter === d.raw;
            return (
              <TouchableOpacity
                key={d.raw}
                activeOpacity={0.75}
                onPress={() => setDateFilter(active ? null : d.raw)}
                style={[
                  styles.dayTile,
                  {
                    backgroundColor: active ? colors.primary : colors.secondary,
                    borderRadius: 14,
                    borderWidth: active ? 0 : 1,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayLetter,
                    { color: active ? colors.primaryForeground : colors.mutedForeground },
                  ]}
                >
                  {d.dayLetter}
                </Text>
                <Text
                  style={[
                    styles.dayNum,
                    { color: active ? colors.primaryForeground : colors.foreground },
                  ]}
                >
                  {d.dayNum}
                </Text>
                <Text
                  style={[
                    styles.dayMonth,
                    { color: active ? colors.primaryForeground : colors.mutedForeground },
                  ]}
                >
                  {d.month}
                </Text>
                {/* Active-day indicator dot */}
                <View
                  style={[
                    styles.dayDot,
                    { backgroundColor: active ? colors.primaryForeground : colors.primary },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Activity type strip ── */}
      <View style={[styles.filterStrip, { borderBottomColor: colors.border }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {TYPE_FILTERS.map((f) => {
            const active = typeFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                activeOpacity={0.7}
                onPress={() => setTypeFilter(f.key)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active ? colors.primary : colors.secondary,
                    borderRadius: 20,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: active ? colors.primaryForeground : colors.foreground,
                    },
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Difficulty strip ── */}
      <View
        style={[
          styles.diffStrip,
          {
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {DIFF_FILTERS.map((d) => {
            const active = diffFilter === d.key;
            const accent = d.color || colors.primary;
            return (
              <TouchableOpacity
                key={d.key}
                activeOpacity={0.7}
                onPress={() => setDiffFilter(d.key)}
                style={[
                  styles.diffChip,
                  {
                    backgroundColor:
                      active && d.key !== "all"
                        ? accent + "18"
                        : colors.secondary,
                    borderWidth: active ? 1.5 : 1,
                    borderColor: active ? (d.color || colors.primary) : colors.border,
                    borderRadius: 20,
                  },
                ]}
              >
                {d.key !== "all" && (
                  <View
                    style={[
                      styles.diffDot,
                      { backgroundColor: active ? accent : colors.mutedForeground },
                    ]}
                  />
                )}
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: active
                        ? d.color || colors.primary
                        : colors.foreground,
                      fontFamily: active ? "DMSans_600SemiBold" : "DMSans_500Medium",
                    },
                  ]}
                >
                  {d.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Event list ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ScheduleCard event={item} onToggleJoin={toggleJoin} />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: (isWeb ? 34 : insets.bottom) + 16 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="calendar" size={36} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No events found
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Try adjusting your filters
            </Text>
            {activeFilterCount > 0 && (
              <TouchableOpacity
                onPress={clearAll}
                activeOpacity={0.7}
                style={[styles.emptyBtn, { borderColor: colors.border }]}
              >
                <Text style={[styles.emptyBtnText, { color: colors.foreground }]}>
                  Clear all filters
                </Text>
              </TouchableOpacity>
            )}
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
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    padding: 0,
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  clearText: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
  },
  // Calendar strip
  calendarStrip: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
  },
  calendarRow: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
    flexDirection: "row",
  },
  allPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    height: 62,
  },
  allPillText: {
    fontSize: 12,
    fontFamily: "DMSans_600SemiBold",
  },
  dayTile: {
    width: 48,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    paddingVertical: 6,
  },
  dayLetter: {
    fontSize: 10,
    fontFamily: "DMSans_500Medium",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  dayNum: {
    fontSize: 18,
    fontFamily: "DMSans_700Bold",
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  dayMonth: {
    fontSize: 9,
    fontFamily: "DMSans_400Regular",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 3,
  },
  // Type + diff filter strips
  filterStrip: {
    height: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
  },
  diffStrip: {
    height: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
    height: 48,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  diffChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  diffDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  filterText: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
  },
  list: {
    paddingTop: 16,
  },
  empty: {
    alignItems: "center",
    gap: 8,
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: "DMSans_700Bold",
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
  },
  emptyBtn: {
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
  },
  emptyBtnText: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
  },
});
