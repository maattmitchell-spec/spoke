import { Feather } from "@expo/vector-icons";
import { useUser as useClerkUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";

type ThemeOption = "light" | "dark" | "system";
const THEME_OPTIONS: ThemeOption[] = ["light", "dark", "system"];
const THEME_ICONS: Record<ThemeOption, string> = {
  light: "sun",
  dark: "moon",
  system: "monitor",
};

type InfoSheet = "privacy" | "about" | "saved-routes" | null;

const INFO_CONTENT: Record<
  Exclude<InfoSheet, null>,
  { title: string; body: React.ReactNode }
> = {
  privacy: {
    title: "Privacy",
    body: (
      <>
        <InfoLine icon="lock" text="Your account data is stored securely with Clerk." />
        <InfoLine icon="smartphone" text="Activity and profile extras are stored locally on your device only — nothing is sent to a server." />
        <InfoLine icon="eye-off" text="Your location is used only to display your city on your profile. It is never shared." />
        <InfoLine icon="trash-2" text="Deleting your account removes all locally stored data." />
      </>
    ),
  },
  about: {
    title: "About Spoke",
    body: (
      <>
        <InfoLine icon="compass" text="Spoke is a community for remote workers who love getting outside — rides, runs, hikes, and meetups." />
        <InfoLine icon="map-pin" text="All adventures are curated locally. No feeds, no noise — just good people and good routes." />
        <InfoLine icon="code" text="Version 1.0 · Built with Expo & React Native." />
        <InfoLine icon="heart" text="Made with care for remote adventurers everywhere." />
      </>
    ),
  },
  "saved-routes": {
    title: "Saved Routes",
    body: (
      <>
        <InfoLine icon="map" text="Save your favourite rides, runs, and hike routes for quick access." />
        <InfoLine icon="clock" text="Route saving is coming in the next update — stay tuned!" />
      </>
    ),
  },
};

function InfoLine({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={infoStyles.row}>
      <Feather name={icon as any} size={15} color="#1A9E4F" style={infoStyles.icon} />
      <Text style={infoStyles.text}>{text}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16 },
  icon: { marginTop: 1, marginRight: 12, flexShrink: 0 },
  text: { fontSize: 14, fontFamily: "DMSans_400Regular", flex: 1, lineHeight: 20 },
});

function SectionHeader({ title, colors }: { title: string; colors: any }) {
  return (
    <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
      {title}
    </Text>
  );
}

function SettingsRow({
  icon,
  label,
  right,
  onPress,
  isLast,
  colors,
}: {
  icon: string;
  label: string;
  right?: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
  colors: any;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.row,
        !isLast && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.iconBox, { backgroundColor: colors.secondary }]}>
          <Feather name={icon as any} size={15} color={colors.primary} />
        </View>
        <Text style={[styles.rowLabel, { color: colors.foreground }]}>{label}</Text>
      </View>
      {right ?? (
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { preference, setPreference } = useTheme();
  const { profile, requireAccount, signOut, updateProfile } = useUser();
  const { user: clerkUser } = useClerkUser();
  const isWeb = Platform.OS === "web";

  // ── Edit Profile ────────────────────────────────────────────
  const [editingProfile, setEditingProfile] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftLocation, setDraftLocation] = useState("");

  const handleOpenEditProfile = useCallback(() => {
    if (!profile) { requireAccount(() => {}); return; }
    setDraftName(profile.name);
    setDraftLocation(profile.location);
    setEditingProfile(true);
  }, [profile, requireAccount]);

  const handleSaveProfile = useCallback(() => {
    if (!draftName.trim()) return;
    updateProfile(draftName, draftLocation);
    setEditingProfile(false);
  }, [draftName, draftLocation, updateProfile]);

  // ── Change Password ─────────────────────────────────────────
  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleOpenChangePw = useCallback(() => {
    if (!profile) { requireAccount(() => {}); return; }
    setCurrentPw(""); setNewPw(""); setConfirmPw(""); setPwError("");
    setChangingPassword(true);
  }, [profile, requireAccount]);

  const handleSavePassword = useCallback(async () => {
    if (!newPw || !confirmPw) { setPwError("Please fill in all fields."); return; }
    if (newPw.length < 8) { setPwError("New password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { setPwError("Passwords don't match."); return; }
    setPwLoading(true);
    setPwError("");
    try {
      await clerkUser?.updatePassword({ currentPassword: currentPw, newPassword: newPw });
      setChangingPassword(false);
    } catch (e: any) {
      setPwError(e?.errors?.[0]?.message ?? "Something went wrong. Please try again.");
    } finally {
      setPwLoading(false);
    }
  }, [clerkUser, currentPw, newPw, confirmPw]);

  // ── Info Sheet ──────────────────────────────────────────────
  const [activeSheet, setActiveSheet] = useState<InfoSheet>(null);

  // ── Inline actions ──────────────────────────────────────────
  const handleNotifications = useCallback(() => {
    Linking.openSettings();
  }, []);

  const handleInviteFriends = useCallback(() => {
    Share.share({
      message:
        "Join me on Spoke — curated outdoor adventures for remote workers. Rides, runs, hikes & meetups near you. 🚵",
    });
  }, []);

  const handleRateApp = useCallback(() => {
    Linking.openURL(
      Platform.OS === "ios"
        ? "https://apps.apple.com/app/id000000000"
        : "https://play.google.com/store/apps/details?id=com.spoke.app"
    );
  }, []);

  // ── Row lists ───────────────────────────────────────────────
  const ACCOUNT_ITEMS = [
    { icon: "user",   label: "Edit profile",     onPress: handleOpenEditProfile },
    { icon: "lock",   label: "Change password",  onPress: handleOpenChangePw },
    { icon: "bell",   label: "Notifications",    onPress: handleNotifications },
    { icon: "shield", label: "Privacy",          onPress: () => setActiveSheet("privacy") },
  ];

  const APP_ITEMS = [
    { icon: "map",   label: "Saved routes",   onPress: () => setActiveSheet("saved-routes") },
    { icon: "users", label: "Invite friends", onPress: handleInviteFriends },
    { icon: "info",  label: "About Spoke",    onPress: () => setActiveSheet("about") },
    { icon: "star",  label: "Rate the app",   onPress: handleRateApp },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: (isWeb ? 67 : insets.top) + 4,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={12}
        >
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Settings</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: (isWeb ? 34 : insets.bottom) + 32,
          paddingTop: 8,
        }}
      >
        {/* Appearance */}
        <View style={styles.section}>
          <SectionHeader title="Appearance" colors={colors} />
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.secondary }]}>
                  <Feather name={THEME_ICONS[preference] as any} size={15} color={colors.primary} />
                </View>
                <Text style={[styles.rowLabel, { color: colors.foreground }]}>Theme</Text>
              </View>
              <View style={[styles.themeToggle, { backgroundColor: colors.secondary, borderRadius: colors.radius }]}>
                {THEME_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    activeOpacity={0.7}
                    onPress={() => setPreference(opt)}
                    style={[
                      styles.themeOption,
                      preference === opt && { backgroundColor: colors.primary, borderRadius: colors.radius - 2 },
                    ]}
                  >
                    <Feather
                      name={THEME_ICONS[opt] as any}
                      size={13}
                      color={preference === opt ? colors.primaryForeground : colors.mutedForeground}
                    />
                    <Text
                      style={[
                        styles.themeOptionText,
                        { color: preference === opt ? colors.primaryForeground : colors.mutedForeground },
                      ]}
                    >
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <SectionHeader title="Account" colors={colors} />
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            {ACCOUNT_ITEMS.map((item, i) => (
              <SettingsRow
                key={item.label}
                icon={item.icon}
                label={item.label}
                onPress={item.onPress}
                isLast={i === ACCOUNT_ITEMS.length - 1}
                colors={colors}
              />
            ))}
          </View>
        </View>

        {/* App */}
        <View style={styles.section}>
          <SectionHeader title="App" colors={colors} />
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            {APP_ITEMS.map((item, i) => (
              <SettingsRow
                key={item.label}
                icon={item.icon}
                label={item.label}
                onPress={item.onPress}
                isLast={i === APP_ITEMS.length - 1}
                colors={colors}
              />
            ))}
          </View>
        </View>

        {/* Sign out */}
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={signOut}
              style={[styles.row, { justifyContent: "center" }]}
            >
              <Text style={[styles.dangerLabel, { color: "#DC2626" }]}>Sign out</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>
          Spoke v1.0 · Made for remote adventurers
        </Text>
      </ScrollView>

      {/* ── Edit Profile Modal ───────────────────────────────── */}
      <Modal visible={editingProfile} animationType="slide" transparent onRequestClose={() => setEditingProfile(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setEditingProfile(false)} />
          <View style={[styles.modalSheet, { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Edit Profile</Text>

            <Text style={[styles.modalLabel, { color: colors.foreground }]}>Name</Text>
            <View style={[styles.modalInput, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TextInput
                style={[styles.modalInputText, { color: colors.foreground }]}
                value={draftName}
                onChangeText={setDraftName}
                placeholder="Your name"
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            <Text style={[styles.modalLabel, { color: colors.foreground }]}>Location</Text>
            <View style={[styles.modalInput, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <Feather name="map-pin" size={15} color={colors.mutedForeground} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.modalInputText, { color: colors.foreground, flex: 1 }]}
                value={draftLocation}
                onChangeText={setDraftLocation}
                placeholder="City, State"
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleSaveProfile}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setEditingProfile(false)} style={[styles.modalCancelBtn, { borderColor: colors.border }]}>
                <Text style={[styles.modalCancelText, { color: colors.foreground }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSaveProfile}
                disabled={!draftName.trim()}
                style={[styles.modalSaveBtn, { backgroundColor: colors.primary, opacity: draftName.trim() ? 1 : 0.45 }]}
              >
                <Text style={[styles.modalSaveText, { color: colors.primaryForeground }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Change Password Modal ────────────────────────────── */}
      <Modal visible={changingPassword} animationType="slide" transparent onRequestClose={() => setChangingPassword(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setChangingPassword(false)} />
          <View style={[styles.modalSheet, { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Change Password</Text>

            <Text style={[styles.modalLabel, { color: colors.foreground }]}>Current password</Text>
            <View style={[styles.modalInput, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TextInput
                style={[styles.modalInputText, { color: colors.foreground, flex: 1 }]}
                value={currentPw}
                onChangeText={setCurrentPw}
                placeholder="••••••••"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry={!showCurrent}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
              <TouchableOpacity activeOpacity={0.7} onPress={() => setShowCurrent((v) => !v)} hitSlop={8}>
                <Feather name={showCurrent ? "eye-off" : "eye"} size={15} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalLabel, { color: colors.foreground }]}>New password</Text>
            <View style={[styles.modalInput, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <TextInput
                style={[styles.modalInputText, { color: colors.foreground, flex: 1 }]}
                value={newPw}
                onChangeText={setNewPw}
                placeholder="Min. 8 characters"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry={!showNew}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
              <TouchableOpacity activeOpacity={0.7} onPress={() => setShowNew((v) => !v)} hitSlop={8}>
                <Feather name={showNew ? "eye-off" : "eye"} size={15} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalLabel, { color: colors.foreground }]}>Confirm new password</Text>
            <View style={[styles.modalInput, { borderColor: confirmPw && confirmPw !== newPw ? "#DC2626" : colors.border, backgroundColor: colors.card }]}>
              <TextInput
                style={[styles.modalInputText, { color: colors.foreground, flex: 1 }]}
                value={confirmPw}
                onChangeText={setConfirmPw}
                placeholder="Re-enter new password"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry={!showNew}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleSavePassword}
              />
            </View>

            {!!pwError && (
              <Text style={styles.pwError}>{pwError}</Text>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setChangingPassword(false)} style={[styles.modalCancelBtn, { borderColor: colors.border }]}>
                <Text style={[styles.modalCancelText, { color: colors.foreground }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSavePassword}
                disabled={pwLoading}
                style={[styles.modalSaveBtn, { backgroundColor: colors.primary, opacity: pwLoading ? 0.6 : 1 }]}
              >
                {pwLoading
                  ? <ActivityIndicator size="small" color={colors.primaryForeground} />
                  : <Text style={[styles.modalSaveText, { color: colors.primaryForeground }]}>Update</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Info Sheet (Privacy / About / Saved Routes) ──────── */}
      <Modal visible={activeSheet !== null} animationType="slide" transparent onRequestClose={() => setActiveSheet(null)}>
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setActiveSheet(null)} />
          <View style={[styles.modalSheet, { backgroundColor: colors.background, paddingBottom: insets.bottom + 16 }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            {activeSheet && (
              <>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  {INFO_CONTENT[activeSheet].title}
                </Text>
                <View style={{ color: colors.mutedForeground } as any}>
                  {INFO_CONTENT[activeSheet].body}
                </View>
              </>
            )}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setActiveSheet(null)}
              style={[styles.modalSaveBtn, { backgroundColor: colors.primary, marginTop: 8 }]}
            >
              <Text style={[styles.modalSaveText, { color: colors.primaryForeground }]}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 36 },
  headerTitle: {
    fontSize: 17,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: -0.2,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 2,
  },
  card: {
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
  },
  themeToggle: {
    flexDirection: "row",
    padding: 3,
    gap: 2,
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  themeOptionText: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
  },
  dangerLabel: {
    fontSize: 15,
    fontFamily: "DMSans_500Medium",
  },
  version: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    marginTop: 28,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "DMSans_700Bold",
    letterSpacing: -0.5,
    marginBottom: 24,
  },
  modalLabel: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 6,
  },
  modalInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 16,
  },
  modalInputText: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    flex: 1,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
  },
  modalSaveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalSaveText: {
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
  },
  pwError: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    color: "#DC2626",
    marginBottom: 12,
    marginTop: -8,
  },
});
