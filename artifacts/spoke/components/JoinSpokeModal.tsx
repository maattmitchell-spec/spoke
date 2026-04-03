import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SpokeWordmark } from "@/components/SpokeWordmark";
import { useColors } from "@/hooks/useColors";
import type { UserProfile } from "@/context/UserContext";

interface Props {
  onSave: (profile: UserProfile) => void;
  onDismiss: () => void;
}

export function JoinSpokeModal({ onSave, onDismiss }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [nameFocused, setNameFocused] = useState(false);
  const [locationFocused, setLocationFocused] = useState(false);
  const isWeb = Platform.OS === "web";

  const canSubmit = name.trim().length >= 2;

  const handleJoin = () => {
    if (!canSubmit) return;
    onSave({
      name: name.trim(),
      location: location.trim(),
      joinedYear: new Date().getFullYear(),
    });
  };

  const initials = name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <Pressable style={styles.backdrop} onPress={onDismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.kav}
      >
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              paddingBottom: (isWeb ? 34 : insets.bottom) + 16,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <View style={styles.top}>
            <SpokeWordmark size={26} />
            <TouchableOpacity
              onPress={onDismiss}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="x" size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          <View style={styles.hero}>
            <View
              style={[
                styles.avatarPreview,
                { backgroundColor: initials ? colors.primary : colors.secondary },
              ]}
            >
              {initials ? (
                <Text style={[styles.avatarInitials, { color: colors.primaryForeground }]}>
                  {initials}
                </Text>
              ) : (
                <Feather name="user" size={28} color={colors.mutedForeground} />
              )}
            </View>
            <Text style={[styles.headline, { color: colors.foreground }]}>
              Join the crew
            </Text>
            <Text style={[styles.subline, { color: colors.mutedForeground }]}>
              Create your Spoke profile to RSVP for adventures, access group chats, and connect with other members.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldWrap}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
                Your name
              </Text>
              <View
                style={[
                  styles.inputRow,
                  {
                    backgroundColor: colors.card,
                    borderColor: nameFocused ? colors.primary : colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <Feather name="user" size={16} color={colors.mutedForeground} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="e.g. Alex Chen"
                  placeholderTextColor={colors.mutedForeground}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                />
              </View>
            </View>

            <View style={styles.fieldWrap}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
                Location{" "}
                <Text style={{ color: colors.mutedForeground + "88" }}>(optional)</Text>
              </Text>
              <View
                style={[
                  styles.inputRow,
                  {
                    backgroundColor: colors.card,
                    borderColor: locationFocused ? colors.primary : colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <Feather name="map-pin" size={16} color={colors.mutedForeground} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="e.g. San Francisco, CA"
                  placeholderTextColor={colors.mutedForeground}
                  value={location}
                  onChangeText={setLocation}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleJoin}
                  onFocus={() => setLocationFocused(true)}
                  onBlur={() => setLocationFocused(false)}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleJoin}
            disabled={!canSubmit}
            style={[
              styles.joinBtn,
              {
                backgroundColor: canSubmit ? colors.primary : colors.secondary,
                borderRadius: colors.radius,
              },
            ]}
          >
            <Text
              style={[
                styles.joinText,
                {
                  color: canSubmit ? colors.primaryForeground : colors.mutedForeground,
                },
              ]}
            >
              Join Spoke
            </Text>
          </TouchableOpacity>

          <Text style={[styles.terms, { color: colors.mutedForeground }]}>
            Your profile is only stored on this device.
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  kav: {
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  hero: {
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
  },
  avatarPreview: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  avatarInitials: {
    fontSize: 26,
    fontFamily: "DMSans_700Bold",
  },
  headline: {
    fontSize: 24,
    fontFamily: "DMSans_700Bold",
    letterSpacing: -0.5,
  },
  subline: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    lineHeight: 21,
    textAlign: "center",
  },
  form: {
    gap: 16,
    marginBottom: 20,
  },
  fieldWrap: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
  },
  joinBtn: {
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  joinText: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: 0.1,
  },
  terms: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    opacity: 0.7,
  },
});
