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
import type { Event, EventType } from "@/constants/data";

type TypeFilter = "all" | EventType;
type DiffFilter = "all" | "easy" | "moderate" | "hard";
type ViewMode = "list" | "calendar";

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

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const MONTH_ABBR: Record<string, number> = {
  JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,
  JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11,
};
const YEAR = 2026;
const DAY_LABELS = ["S","M","T","W","T","F","S"];

const TYPE_DOT_COLOR: Record<EventType, string> = {
  ride: "#556B2F",
  run: "#3B82F6",
  hike: "#E07B39",
  meetup: "#8B5CF6",
};

function parseEventDate(dateStr: string): { month: number; day: number } | null {
  const parts = dateStr.split(" ");
  if (parts.length < 3) return null;
  const month = MONTH_ABBR[parts[1]];
  const day = parseInt(parts[2], 10);
  if (month === undefined || isNaN(day)) return null;
  return { month, day };
}

// ── Calendar View ──────────────────────────────────────────────────────────
function CalendarView({
  filtered,
  onToggleJoin,
}: {
  filtered: Event[];
  onToggleJoin: (id: string) => void;
}) {
  const colors = useColors();

  // Derive starting month from events (earliest month)
  const startMonth = useMemo(() => {
    let min = 11;
    for (const e of filtered) {
      const p = parseEventDate(e.date);
      if (p && p.month < min) min = p.month;
    }
    return min;
  }, [filtered]);

  const [month, setMonth] = useState(startMonth);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Map day → events for current month
  const dayEventMap = useMemo(() => {
    const map = new Map<number, Event[]>();
    for (const e of filtered) {
      const p = parseEventDate(e.date);
      if (p && p.month === month) {
        if (!map.has(p.day)) map.set(p.day, []);
        map.get(p.day)!.push(e);
      }
    }
    return map;
  }, [filtered, month]);

  const daysInMonth = new Date(YEAR, month + 1, 0).getDate();
  const firstDow = new Date(YEAR, month, 1).getDay(); // 0=Sun
  const totalCells = Math.ceil((firstDow + daysInMonth) / 7) * 7;
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - firstDow + 1;
    return dayNum >= 1 && dayNum <= daysInMonth ? dayNum : null;
  });

  const selectedEvents = selectedDay !== null
    ? (dayEventMap.get(selectedDay) ?? [])
    : [];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* Month navigation */}
      <View style={[calStyles.monthRow]}>
        <TouchableOpacity
          onPress={() => { setMonth(m => Math.max(0, m - 1)); setSelectedDay(null); }}
          activeOpacity={0.7}
          style={[calStyles.navBtn, { backgroundColor: colors.secondary, borderRadius: 10 }]}
        >
          <Feather name="chevron-left" size={18} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[calStyles.monthTitle, { color: colors.foreground }]}>
          {MONTH_NAMES[month]} {YEAR}
        </Text>
        <TouchableOpacity
          onPress={() => { setMonth(m => Math.min(11, m + 1)); setSelectedDay(null); }}
          activeOpacity={0.7}
          style={[calStyles.navBtn, { backgroundColor: colors.secondary, borderRadius: 10 }]}
        >
          <Feather name="chevron-right" size={18} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {/* Day-of-week headers */}
      <View style={calStyles.dowRow}>
        {DAY_LABELS.map((d, i) => (
          <Text key={i} style={[calStyles.dowLabel, { color: colors.mutedForeground }]}>
            {d}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={[calStyles.grid, { borderColor: colors.border }]}>
        {cells.map((dayNum, i) => {
          const hasEvents = dayNum !== null && dayEventMap.has(dayNum);
          const isSelected = dayNum !== null && selectedDay === dayNum;
          const events = dayNum ? (dayEventMap.get(dayNum) ?? []) : [];

          return (
            <TouchableOpacity
              key={i}
              activeOpacity={dayNum && hasEvents ? 0.7 : 1}
              disabled={!dayNum || !hasEvents}
              onPress={() => {
                if (!dayNum) return;
                setSelectedDay(prev => (prev === dayNum ? null : dayNum));
              }}
              style={[
                calStyles.cell,
                {
                  borderColor: colors.border,
                  backgroundColor: isSelected
                    ? colors.primary
                    : "transparent",
                  borderRadius: isSelected ? 10 : 0,
                },
              ]}
            >
              {dayNum !== null && (
                <>
                  <Text
                    style={[
                      calStyles.dayNum,
                      {
                        color: isSelected
                          ? colors.primaryForeground
                          : hasEvents
                          ? colors.foreground
                          : colors.mutedForeground,
                        fontFamily: hasEvents
                          ? "DMSans_600SemiBold"
                          : "DMSans_400Regular",
                        opacity: hasEvents ? 1 : 0.4,
                      },
                    ]}
                  >
                    {dayNum}
                  </Text>
                  {/* Event type dots */}
                  {hasEvents && (
                    <View style={calStyles.dotRow}>
                      {events.slice(0, 3).map((ev, di) => (
                        <View
                          key={di}
                          style={[
                            calStyles.dot,
                            {
                              backgroundColor: isSelected
                                ? colors.primaryForeground
                                : TYPE_DOT_COLOR[ev.type],
                            },
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Events for selected day */}
      {selectedDay !== null && (
        <View style={{ marginTop: 4 }}>
          <Text style={[calStyles.dayHeader, { color: colors.mutedForeground }]}>
            {MONTH_NAMES[month].slice(0, 3).toUpperCase()} {selectedDay}
          </Text>
          {selectedEvents.length === 0 ? (
            <Text style={[calStyles.noEvents, { color: colors.mutedForeground }]}>
              No events on this day
            </Text>
          ) : (
            selectedEvents.map((ev) => (
              <ScheduleCard key={ev.id} event={ev} onToggleJoin={onToggleJoin} />
            ))
          )}
        </View>
      )}

      {selectedDay === null && dayEventMap.size === 0 && (
        <View style={{ alignItems: "center", paddingTop: 24 }}>
          <Feather name="calendar" size={32} color={colors.mutedForeground} />
          <Text style={[calStyles.noEvents, { color: colors.mutedForeground, marginTop: 8 }]}>
            No events this month
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const calStyles = StyleSheet.create({
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  monthTitle: {
    fontSize: 16,
    fontFamily: "DMSans_700Bold",
    letterSpacing: -0.3,
  },
  navBtn: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  dowRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  dowLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    overflow: "hidden",
  },
  cell: {
    width: `${100 / 7}%` as any,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    gap: 2,
  },
  dayNum: {
    fontSize: 14,
    lineHeight: 18,
  },
  dotRow: {
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  dayHeader: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  noEvents: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    paddingVertical: 16,
  },
});

// ── Main Screen ────────────────────────────────────────────────────────────
export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { events, toggleJoin } = useEvents();

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [diffFilter, setDiffFilter] = useState<DiffFilter>("all");
  const [locationQuery, setLocationQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top;

  const filtered = events.filter((e) => {
    const matchesType = typeFilter === "all" || e.type === typeFilter;
    const matchesDiff = diffFilter === "all" || e.difficulty === diffFilter;
    const matchesLocation =
      locationQuery.trim() === "" ||
      e.location.toLowerCase().includes(locationQuery.toLowerCase()) ||
      e.title.toLowerCase().includes(locationQuery.toLowerCase());
    return matchesType && matchesDiff && matchesLocation;
  });

  const activeFilterCount =
    (typeFilter !== "all" ? 1 : 0) +
    (diffFilter !== "all" ? 1 : 0) +
    (locationQuery.trim() !== "" ? 1 : 0);

  function clearAll() {
    setTypeFilter("all");
    setDiffFilter("all");
    setLocationQuery("");
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

        <View style={styles.headerRight}>
          {/* List / Calendar toggle */}
          <View style={[styles.toggleGroup, { backgroundColor: colors.secondary, borderRadius: 10 }]}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setViewMode("list")}
              style={[
                styles.toggleBtn,
                {
                  backgroundColor: viewMode === "list" ? colors.primary : "transparent",
                  borderRadius: 8,
                },
              ]}
            >
              <Feather
                name="list"
                size={16}
                color={viewMode === "list" ? colors.primaryForeground : colors.mutedForeground}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setViewMode("calendar")}
              style={[
                styles.toggleBtn,
                {
                  backgroundColor: viewMode === "calendar" ? colors.primary : "transparent",
                  borderRadius: 8,
                },
              ]}
            >
              <Feather
                name="calendar"
                size={15}
                color={viewMode === "calendar" ? colors.primaryForeground : colors.mutedForeground}
              />
            </TouchableOpacity>
          </View>

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
                    { color: active ? colors.primaryForeground : colors.foreground },
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
          { borderBottomColor: colors.border, backgroundColor: colors.background },
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
                      active && d.key !== "all" ? accent + "18" : colors.secondary,
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
                      color: active ? d.color || colors.primary : colors.foreground,
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

      {/* ── Content area ── */}
      {viewMode === "calendar" ? (
        <CalendarView filtered={filtered} onToggleJoin={toggleJoin} />
      ) : (
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
              <Feather name="search" size={36} color={colors.mutedForeground} />
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  toggleGroup: {
    flexDirection: "row",
    alignItems: "center",
    padding: 3,
    gap: 2,
  },
  toggleBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
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
  list: { paddingTop: 16 },
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
