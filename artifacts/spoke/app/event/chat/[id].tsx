import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useEvents } from "@/context/EventsContext";
import { useChat, type Message } from "@/context/ChatContext";

function formatTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - ts) / 86400000);
  if (diffDays === 0) {
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function shouldShowDate(msgs: Message[], index: number) {
  if (index === 0) return true;
  const prev = new Date(msgs[index - 1].timestamp);
  const curr = new Date(msgs[index].timestamp);
  return (
    prev.getDate() !== curr.getDate() ||
    prev.getMonth() !== curr.getMonth()
  );
}

function DateDivider({ timestamp, colors }: { timestamp: number; colors: any }) {
  const d = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - timestamp) / 86400000);
  let label = d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
  if (diffDays === 0) label = "Today";
  if (diffDays === 1) label = "Yesterday";
  return (
    <View style={styles.dateDivider}>
      <View style={[styles.dateLine, { backgroundColor: colors.border }]} />
      <Text style={[styles.dateLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={[styles.dateLine, { backgroundColor: colors.border }]} />
    </View>
  );
}

function MessageBubble({ msg, colors }: { msg: Message; colors: any }) {
  if (msg.isOwn) {
    return (
      <View style={styles.ownRow}>
        <View style={[styles.ownBubble, { backgroundColor: colors.primary, borderRadius: colors.radius }]}>
          <Text style={[styles.bubbleText, { color: colors.primaryForeground }]}>{msg.text}</Text>
          <Text style={[styles.bubbleTime, { color: colors.primaryForeground + "99" }]}>
            {formatTime(msg.timestamp)}
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.otherRow}>
      <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
        <Text style={[styles.avatarText, { color: colors.primary }]}>{msg.senderAvatar}</Text>
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={[styles.senderName, { color: colors.mutedForeground }]}>{msg.senderName}</Text>
        <View style={[styles.otherBubble, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <Text style={[styles.bubbleText, { color: colors.foreground }]}>{msg.text}</Text>
          <Text style={[styles.bubbleTime, { color: colors.mutedForeground }]}>
            {formatTime(msg.timestamp)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { events } = useEvents();
  const { getMessages, sendMessage, markRead } = useChat();
  const [draft, setDraft] = useState("");
  const listRef = useRef<FlatList>(null);
  const isWeb = Platform.OS === "web";

  const event = events.find((e) => e.id === id);
  const messages = getMessages(id ?? "");

  useEffect(() => {
    if (id) markRead(id);
  }, [id, markRead]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 80);
    }
  }, [messages.length]);

  const handleSend = () => {
    if (!draft.trim() || !id) return;
    sendMessage(id, draft);
    setDraft("");
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  if (!event) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground }}>Event not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View
        style={[
          styles.header,
          {
            paddingTop: (isWeb ? 67 : insets.top) + 10,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]} numberOfLines={1}>
            {event.title}
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            {event.attendees} member{event.attendees !== 1 ? "s" : ""} · Group Chat
          </Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={[styles.list, { paddingBottom: 12 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <>
            {shouldShowDate(messages, index) && (
              <DateDivider timestamp={item.timestamp} colors={colors} />
            )}
            <MessageBubble msg={item} colors={colors} />
          </>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="message-circle" size={36} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No messages yet — say hello!
            </Text>
          </View>
        }
      />

      <View
        style={[
          styles.inputBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: (isWeb ? 34 : insets.bottom) + 8,
          },
        ]}
      >
        <View
          style={[
            styles.inputWrap,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
            },
          ]}
        >
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            placeholder="Message the group…"
            placeholderTextColor={colors.mutedForeground}
            value={draft}
            onChangeText={setDraft}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSend}
            disabled={!draft.trim()}
            style={[
              styles.sendBtn,
              {
                backgroundColor: draft.trim() ? colors.primary : colors.secondary,
                borderRadius: colors.radius - 4,
              },
            ]}
          >
            <Feather
              name="send"
              size={16}
              color={draft.trim() ? colors.primaryForeground : colors.mutedForeground}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: -0.2,
  },
  headerSub: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
  },
  headerRight: { width: 36 },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 4,
  },
  dateDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 16,
  },
  dateLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dateLabel: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  otherRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 8,
    maxWidth: "80%",
  },
  ownRow: {
    alignItems: "flex-end",
    marginBottom: 8,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 11,
    fontFamily: "DMSans_700Bold",
  },
  senderName: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    marginLeft: 2,
  },
  otherBubble: {
    borderWidth: 1,
    padding: 10,
    gap: 4,
  },
  ownBubble: {
    padding: 10,
    gap: 4,
    maxWidth: "80%",
  },
  bubbleText: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    lineHeight: 21,
  },
  bubbleTime: {
    fontSize: 10,
    fontFamily: "DMSans_400Regular",
    alignSelf: "flex-end",
  },
  empty: {
    alignItems: "center",
    gap: 12,
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  inputBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    maxHeight: 100,
    paddingTop: 0,
    paddingBottom: 0,
  },
  sendBtn: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
