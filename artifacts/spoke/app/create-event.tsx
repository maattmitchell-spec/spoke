import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useColors } from "@/hooks/useColors";
import { useEvents } from "@/context/EventsContext";
import { useUser } from "@/context/UserContext";
import type { EventType } from "@/constants/data";

type Difficulty = "easy" | "moderate" | "hard";

const EVENT_TYPES: { key: EventType; label: string; icon: string; color: string }[] = [
  { key: "ride", label: "Ride", icon: "activity", color: "#1A9E4F" },
  { key: "run", label: "Run", icon: "zap", color: "#E07B3A" },
  { key: "hike", label: "Hike", icon: "triangle", color: "#7C5CBF" },
  { key: "meetup", label: "Meetup", icon: "users", color: "#2B7FC8" },
];

const DIFFICULTIES: { key: Difficulty; label: string }[] = [
  { key: "easy", label: "Easy" },
  { key: "moderate", label: "Moderate" },
  { key: "hard", label: "Hard" },
];

export default function CreateEventScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { createEvent } = useEvents();
  const { profile } = useUser();

  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top;
  const botPad = isWeb ? 34 : insets.bottom;

  const [type, setType] = useState<EventType>("ride");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [elevation, setElevation] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("moderate");
  const [maxAttendees, setMaxAttendees] = useState(10);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const showDistance = type === "ride" || type === "run" || type === "hike";
  const showElevation = type === "hike" || type === "ride";

  const hostName = profile?.name || "You";
  const hostInitials = hostName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleCreate() {
    if (!title.trim()) {
      Alert.alert("Missing title", "Please give your event a name.");
      return;
    }
    if (!date.trim()) {
      Alert.alert("Missing date", "Please enter a date (e.g. SAT APR 19).");
      return;
    }
    if (!time.trim()) {
      Alert.alert("Missing time", "Please enter a start time (e.g. 7:00 AM).");
      return;
    }
    if (!location.trim()) {
      Alert.alert("Missing location", "Please enter a meeting location.");
      return;
    }

    const parsedTags = tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    createEvent({
      title: title.trim(),
      type,
      date: date.trim().toUpperCase(),
      time: time.trim(),
      location: location.trim(),
      distance: distance.trim() || undefined,
      elevation: elevation.trim() || undefined,
      difficulty,
      maxAttendees,
      host: hostName,
      hostAvatar: hostInitials,
      description: description.trim(),
      tags: parsedTags,
    });

    router.back();
  }

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.card,
      borderColor: colors.border,
      color: colors.foreground,
      borderRadius: colors.radius,
    },
  ];

  const labelStyle = [styles.label, { color: colors.mutedForeground }];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 4,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="x" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>New Event</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleCreate}
          style={[styles.createBtn, { backgroundColor: colors.primary, borderRadius: 20 }]}
        >
          <Text style={[styles.createBtnText, { color: colors.primaryForeground }]}>Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.form, { paddingBottom: botPad + 32 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={labelStyle}>Activity type</Text>
        <View style={styles.typeRow}>
          {EVENT_TYPES.map((t) => {
            const active = type === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                activeOpacity={0.75}
                onPress={() => setType(t.key)}
                style={[
                  styles.typeChip,
                  {
                    backgroundColor: active ? t.color : colors.card,
                    borderColor: active ? t.color : colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <Feather
                  name={t.icon as any}
                  size={15}
                  color={active ? "#fff" : colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.typeLabel,
                    { color: active ? "#fff" : colors.foreground },
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={labelStyle}>Event name *</Text>
        <TextInput
          style={inputStyle}
          placeholder="Give your event a clear title"
          placeholderTextColor={colors.mutedForeground}
          value={title}
          onChangeText={setTitle}
          maxLength={80}
          returnKeyType="next"
        />

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={labelStyle}>Date *</Text>
            <TextInput
              style={inputStyle}
              placeholder="SAT APR 19"
              placeholderTextColor={colors.mutedForeground}
              value={date}
              onChangeText={(v) => setDate(v.toUpperCase())}
              autoCapitalize="characters"
              returnKeyType="next"
            />
          </View>
          <View style={styles.half}>
            <Text style={labelStyle}>Time *</Text>
            <TextInput
              style={inputStyle}
              placeholder="7:00 AM"
              placeholderTextColor={colors.mutedForeground}
              value={time}
              onChangeText={setTime}
              returnKeyType="next"
            />
          </View>
        </View>

        <Text style={labelStyle}>Meeting location *</Text>
        <TextInput
          style={inputStyle}
          placeholder="Park name, address, or landmark"
          placeholderTextColor={colors.mutedForeground}
          value={location}
          onChangeText={setLocation}
          returnKeyType="next"
        />

        {showDistance && (
          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={labelStyle}>Distance</Text>
              <TextInput
                style={inputStyle}
                placeholder={type === "ride" ? "42 mi" : "8 mi"}
                placeholderTextColor={colors.mutedForeground}
                value={distance}
                onChangeText={setDistance}
                returnKeyType="next"
              />
            </View>
            {showElevation && (
              <View style={styles.half}>
                <Text style={labelStyle}>Elevation</Text>
                <TextInput
                  style={inputStyle}
                  placeholder="1,200 ft"
                  placeholderTextColor={colors.mutedForeground}
                  value={elevation}
                  onChangeText={setElevation}
                  returnKeyType="next"
                />
              </View>
            )}
          </View>
        )}

        <Text style={labelStyle}>Difficulty</Text>
        <View style={styles.diffRow}>
          {DIFFICULTIES.map((d) => {
            const active = difficulty === d.key;
            const diffColor =
              d.key === "easy" ? "#1A9E4F" : d.key === "moderate" ? "#E07B3A" : "#C0392B";
            return (
              <TouchableOpacity
                key={d.key}
                activeOpacity={0.75}
                onPress={() => setDifficulty(d.key)}
                style={[
                  styles.diffChip,
                  {
                    backgroundColor: active ? diffColor + "18" : colors.card,
                    borderColor: active ? diffColor : colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.diffLabel,
                    { color: active ? diffColor : colors.mutedForeground },
                  ]}
                >
                  {d.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={labelStyle}>Max attendees</Text>
        <View
          style={[
            styles.stepperRow,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Pressable
            onPress={() => setMaxAttendees((n) => Math.max(2, n - 1))}
            style={({ pressed }) => [
              styles.stepperBtn,
              { opacity: pressed ? 0.5 : 1 },
            ]}
          >
            <Feather name="minus" size={18} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.stepperValue, { color: colors.foreground }]}>
            {maxAttendees}
          </Text>
          <Pressable
            onPress={() => setMaxAttendees((n) => Math.min(100, n + 1))}
            style={({ pressed }) => [
              styles.stepperBtn,
              { opacity: pressed ? 0.5 : 1 },
            ]}
          >
            <Feather name="plus" size={18} color={colors.foreground} />
          </Pressable>
        </View>

        <Text style={labelStyle}>Description</Text>
        <TextInput
          style={[inputStyle, styles.textArea]}
          placeholder="What should participants know? Route details, gear, pace, meet-up spot…"
          placeholderTextColor={colors.mutedForeground}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={500}
        />

        <Text style={labelStyle}>Tags (comma-separated)</Text>
        <TextInput
          style={inputStyle}
          placeholder="gravel, coastal, coffee stop"
          placeholderTextColor={colors.mutedForeground}
          value={tags}
          onChangeText={setTags}
          autoCapitalize="none"
          returnKeyType="done"
        />

        <View
          style={[
            styles.hostRow,
            { backgroundColor: colors.secondary, borderRadius: colors.radius },
          ]}
        >
          <View
            style={[
              styles.hostAvatar,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={[styles.hostInitials, { color: colors.primaryForeground }]}>
              {hostInitials}
            </Text>
          </View>
          <View>
            <Text style={[styles.hostLabel, { color: colors.mutedForeground }]}>
              Hosted by
            </Text>
            <Text style={[styles.hostName, { color: colors.foreground }]}>
              {hostName}
            </Text>
          </View>
          <View style={{ flex: 1 }} />
          <View
            style={[
              styles.hostBadge,
              { backgroundColor: colors.primary + "18" },
            ]}
          >
            <Text style={[styles.hostBadgeText, { color: colors.primary }]}>
              Organizer
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    padding: 4,
    width: 36,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: -0.3,
  },
  createBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  createBtnText: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
  },
  form: {
    padding: 20,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
    gap: 2,
  },
  typeRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  typeChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderWidth: 1.5,
    minWidth: 70,
  },
  typeLabel: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
  },
  diffRow: {
    flexDirection: "row",
    gap: 8,
  },
  diffChip: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderWidth: 1.5,
  },
  diffLabel: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    overflow: "hidden",
  },
  stepperBtn: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperValue: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "DMSans_600SemiBold",
  },
  hostRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    marginTop: 8,
  },
  hostAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  hostInitials: {
    fontSize: 14,
    fontFamily: "DMSans_700Bold",
  },
  hostLabel: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
  },
  hostName: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
  },
  hostBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  hostBadgeText: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
  },
});
