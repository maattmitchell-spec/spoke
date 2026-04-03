import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

import { SpokeWordmark } from "@/components/SpokeWordmark";
import { useColors } from "@/hooks/useColors";
import type { UserProfile } from "@/context/UserContext";

WebBrowser.maybeCompleteAuthSession();

interface Props {
  onSave: (profile: UserProfile, password?: string) => void;
  onDismiss: () => void;
  verifySignIn: (email: string, password: string) => Promise<UserProfile | null>;
}

type Mode = "signup" | "signin";

function getInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

export function JoinSpokeModal({ onSave, onDismiss, verifySignIn }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const isIOS = Platform.OS === "ios";

  const [mode, setMode] = useState<Mode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);

  const [_request, response, promptGoogleAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    webClientId: GOOGLE_CLIENT_ID,
  });

  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setAppleAvailable).catch(() => setAppleAvailable(false));
  }, []);

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      setLoading(true);
      fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${response.authentication.accessToken}` },
      })
        .then((r) => r.json())
        .then((user) => {
          onSave({
            name: user.name ?? email,
            email: user.email ?? "",
            location: "",
            joinedYear: new Date().getFullYear(),
            authProvider: "google",
          });
        })
        .catch(() => setError("Google sign-in failed. Try again."))
        .finally(() => setLoading(false));
    } else if (response?.type === "error") {
      setError("Google sign-in was cancelled or failed.");
    }
  }, [response]);

  const handleGooglePress = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError("Google sign-in is not configured for this app.");
      return;
    }
    setError(null);
    promptGoogleAsync();
  };

  const handleApplePress = async () => {
    setError(null);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const appleName = [
        credential.fullName?.givenName,
        credential.fullName?.familyName,
      ]
        .filter(Boolean)
        .join(" ");
      onSave({
        name: appleName || "Spoke Member",
        email: credential.email ?? "",
        location: "",
        joinedYear: new Date().getFullYear(),
        authProvider: "apple",
      });
    } catch (e: any) {
      if (e?.code !== "ERR_REQUEST_CANCELED") {
        setError("Apple sign-in failed. Try again.");
      }
    }
  };

  const handleEmailSubmit = async () => {
    setError(null);
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (!password) { setError("Please enter a password."); return; }

    if (mode === "signup") {
      if (name.trim().length < 2) { setError("Please enter your full name."); return; }
      if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
      onSave(
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          location: location.trim(),
          joinedYear: new Date().getFullYear(),
          authProvider: "email",
        },
        password
      );
    } else {
      setLoading(true);
      const found = await verifySignIn(email.trim().toLowerCase(), password);
      setLoading(false);
      if (found) {
        onSave(found);
      } else {
        setError("Incorrect email or password.");
      }
    }
  };

  const initials = getInitials(name);
  const isSignup = mode === "signup";
  const canSubmit =
    email.trim().length > 3 &&
    password.length >= (isSignup ? 6 : 1) &&
    (!isSignup || name.trim().length >= 2);

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
              paddingBottom: (isWeb ? 34 : insets.bottom) + 8,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scroll}
          >
            <View style={styles.top}>
              <SpokeWordmark size={24} />
              <TouchableOpacity onPress={onDismiss} activeOpacity={0.7} hitSlop={12}>
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            {isSignup && (
              <View style={styles.avatarRow}>
                <View
                  style={[
                    styles.avatarPreview,
                    { backgroundColor: initials ? colors.primary : colors.secondary },
                  ]}
                >
                  {initials ? (
                    <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>
                      {initials}
                    </Text>
                  ) : (
                    <Feather name="user" size={26} color={colors.mutedForeground} />
                  )}
                </View>
              </View>
            )}

            <Text style={[styles.headline, { color: colors.foreground }]}>
              {isSignup ? "Join the crew" : "Welcome back"}
            </Text>
            <Text style={[styles.subline, { color: colors.mutedForeground }]}>
              {isSignup
                ? "Create your Spoke profile to RSVP for adventures and join group chats."
                : "Sign in to access your adventures and group chats."}
            </Text>

            <View style={styles.socialRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleGooglePress}
                style={[
                  styles.socialBtn,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                    flex: appleAvailable ? 1 : undefined,
                    width: appleAvailable ? undefined : "100%",
                  },
                ]}
              >
                <View style={styles.googleG}>
                  <Text style={styles.googleGText}>G</Text>
                </View>
                <Text style={[styles.socialLabel, { color: colors.foreground }]}>
                  {appleAvailable ? "Google" : "Continue with Google"}
                </Text>
              </TouchableOpacity>

              {appleAvailable && (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleApplePress}
                  style={[
                    styles.socialBtn,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      borderRadius: colors.radius,
                      flex: 1,
                    },
                  ]}
                >
                  <Ionicons
                    name="logo-apple"
                    size={18}
                    color={colors.foreground}
                  />
                  <Text style={[styles.socialLabel, { color: colors.foreground }]}>
                    Apple
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>
                or continue with email
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            <View style={styles.form}>
              {isSignup && (
                <Field
                  label="Your name"
                  icon="user"
                  placeholder="e.g. Alex Chen"
                  value={name}
                  onChangeText={(t) => { setName(t); setError(null); }}
                  autoCapitalize="words"
                  returnKeyType="next"
                  colors={colors}
                />
              )}

              <Field
                label="Email"
                icon="mail"
                placeholder="you@example.com"
                value={email}
                onChangeText={(t) => { setEmail(t); setError(null); }}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                colors={colors}
              />

              <View style={styles.fieldWrap}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
                  Password
                </Text>
                <View
                  style={[
                    styles.inputRow,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      borderRadius: colors.radius,
                    },
                  ]}
                >
                  <Feather name="lock" size={16} color={colors.mutedForeground} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.foreground }]}
                    placeholder={isSignup ? "Min. 6 characters" : "Your password"}
                    placeholderTextColor={colors.mutedForeground}
                    value={password}
                    onChangeText={(t) => { setPassword(t); setError(null); }}
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleEmailSubmit}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((v) => !v)}
                    activeOpacity={0.7}
                    hitSlop={8}
                  >
                    <Feather
                      name={showPassword ? "eye-off" : "eye"}
                      size={16}
                      color={colors.mutedForeground}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {isSignup && (
                <Field
                  label="Location (optional)"
                  icon="map-pin"
                  placeholder="e.g. San Francisco, CA"
                  value={location}
                  onChangeText={setLocation}
                  autoCapitalize="words"
                  returnKeyType="done"
                  onSubmitEditing={handleEmailSubmit}
                  colors={colors}
                />
              )}
            </View>

            {error && (
              <View
                style={[
                  styles.errorBox,
                  { backgroundColor: "#FEE2E2", borderRadius: colors.radius / 2 },
                ]}
              >
                <Feather name="alert-circle" size={14} color="#DC2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleEmailSubmit}
              disabled={!canSubmit || loading}
              style={[
                styles.submitBtn,
                {
                  backgroundColor: canSubmit ? colors.primary : colors.secondary,
                  borderRadius: colors.radius,
                },
              ]}
            >
              {loading ? (
                <ActivityIndicator color={colors.primaryForeground} />
              ) : (
                <Text
                  style={[
                    styles.submitText,
                    { color: canSubmit ? colors.primaryForeground : colors.mutedForeground },
                  ]}
                >
                  {isSignup ? "Create account" : "Sign in"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setMode(isSignup ? "signin" : "signup");
                setError(null);
              }}
              style={styles.toggleRow}
            >
              <Text style={[styles.toggleText, { color: colors.mutedForeground }]}>
                {isSignup ? "Already a member? " : "New to Spoke? "}
                <Text style={{ color: colors.primary, fontFamily: "DMSans_600SemiBold" }}>
                  {isSignup ? "Sign in" : "Create account"}
                </Text>
              </Text>
            </TouchableOpacity>

            <Text style={[styles.terms, { color: colors.mutedForeground }]}>
              Your account is stored locally on this device.
            </Text>
          </ScrollView>
        </Pressable>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

interface FieldProps {
  label: string;
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  autoCapitalize?: "none" | "words" | "sentences";
  keyboardType?: any;
  returnKeyType?: any;
  onSubmitEditing?: () => void;
  colors: any;
}

function Field({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  autoCapitalize = "sentences",
  keyboardType,
  returnKeyType = "next",
  onSubmitEditing,
  colors,
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: colors.card,
            borderColor: focused ? colors.primary : colors.border,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Feather name={icon as any} size={16} color={colors.mutedForeground} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: colors.foreground }]}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  kav: { justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "92%",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  avatarRow: {
    alignItems: "center",
    marginBottom: 12,
  },
  avatarPreview: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 22,
    fontFamily: "DMSans_700Bold",
  },
  headline: {
    fontSize: 24,
    fontFamily: "DMSans_700Bold",
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: 6,
  },
  subline: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  socialRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  googleG: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#4285F4",
    alignItems: "center",
    justifyContent: "center",
  },
  googleGText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "DMSans_700Bold",
  },
  socialLabel: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
  },
  form: {
    gap: 14,
    marginBottom: 14,
  },
  fieldWrap: { gap: 5 },
  fieldLabel: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  inputIcon: {},
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    paddingTop: 0,
    paddingBottom: 0,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    color: "#DC2626",
  },
  submitBtn: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  submitText: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
  },
  toggleRow: {
    alignItems: "center",
    paddingVertical: 4,
    marginBottom: 12,
  },
  toggleText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  terms: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    opacity: 0.6,
    marginBottom: 4,
  },
});
