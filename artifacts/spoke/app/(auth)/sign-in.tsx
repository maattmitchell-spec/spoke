import { useSSO, useSignIn } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import * as AppleAuthentication from "expo-apple-authentication";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BikeWheelIcon } from "@/components/SpokeWordmark";
import { useColors } from "@/hooks/useColors";

WebBrowser.maybeCompleteAuthSession();

const GREEN = "#1A9E4F";
const GREEN_DARK = "#0F6832";

export default function SignInScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signIn, errors, fetchStatus } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [mfaCode, setMfaCode] = React.useState("");
  const [needsMfa, setNeedsMfa] = React.useState(false);

  // Warm up browser on Android
  useEffect(() => {
    if (Platform.OS !== "android") return;
    WebBrowser.warmUpAsync();
    return () => { WebBrowser.coolDownAsync(); };
  }, []);

  const handleEmailSignIn = async () => {
    const { error } = await signIn.password({ emailAddress: email, password });
    if (error) return;

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          router.replace(decorateUrl("/") as any);
        },
      });
    } else if (signIn.status === "needs_client_trust") {
      const factor = signIn.supportedSecondFactors?.find(
        (f) => f.strategy === "email_code"
      );
      if (factor) {
        await signIn.mfa.sendEmailCode();
        setNeedsMfa(true);
      }
    }
  };

  const handleMfaVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code: mfaCode });
    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ decorateUrl }) => {
          router.replace(decorateUrl("/") as any);
        },
      });
    }
  };

  const handleGoogleSSO = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri(),
      });
      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ decorateUrl }) => {
            router.replace(decorateUrl("/") as any);
          },
        });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [startSSOFlow, router]);

  const handleAppleSSO = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_apple",
        redirectUrl: AuthSession.makeRedirectUri(),
      });
      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ decorateUrl }) => {
            router.replace(decorateUrl("/") as any);
          },
        });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [startSSOFlow, router]);

  const isLoading = fetchStatus === "fetching";

  if (needsMfa) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.logoRow}>
          <BikeWheelIcon size={28} color={GREEN} />
          <Text style={[styles.wordmark, { color: colors.foreground }]}>spoke</Text>
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>Check your email</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          We sent a verification code to {email}
        </Text>
        <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            value={mfaCode}
            onChangeText={setMfaCode}
            placeholder="6-digit code"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="number-pad"
            autoFocus
          />
        </View>
        {errors?.fields?.code && (
          <Text style={styles.errorText}>{errors.fields.code.message}</Text>
        )}
        <Pressable
          style={[styles.primaryBtn, { opacity: isLoading || !mfaCode ? 0.5 : 1 }]}
          onPress={handleMfaVerify}
          disabled={isLoading || !mfaCode}
        >
          <LinearGradient colors={[GREEN, GREEN_DARK]} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Verify</Text>}
          </LinearGradient>
        </Pressable>
        <Pressable onPress={() => signIn.mfa.sendEmailCode()} style={styles.resendBtn}>
          <Text style={[styles.resendText, { color: colors.primary }]}>Resend code</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={[styles.root, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoRow}>
          <BikeWheelIcon size={28} color={GREEN} />
          <Text style={[styles.wordmark, { color: colors.foreground }]}>spoke</Text>
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>Welcome back</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Sign in to find your next adventure
        </Text>

        <View style={styles.socialRow}>
          <Pressable
            style={({ pressed }) => [styles.socialBtn, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.75 : 1 }]}
            onPress={handleGoogleSSO}
          >
            <Text style={styles.googleG}>G</Text>
            <Text style={[styles.socialBtnText, { color: colors.foreground }]}>Google</Text>
          </Pressable>

          {Platform.OS === "ios" && (
            <Pressable
              style={({ pressed }) => [styles.socialBtn, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.75 : 1 }]}
              onPress={handleAppleSSO}
            >
              <Feather name="apple" size={17} color={colors.foreground} />
              <Text style={[styles.socialBtnText, { color: colors.foreground }]}>Apple</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>or</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Email</Text>
        <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {errors?.fields?.identifier && (
          <Text style={styles.errorText}>{errors.fields.identifier.message}</Text>
        )}

        <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Password</Text>
        <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.input, { color: colors.foreground, flex: 1 }]}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.mutedForeground}
            secureTextEntry={!showPassword}
          />
          <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
            <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={colors.mutedForeground} />
          </Pressable>
        </View>
        {errors?.fields?.password && (
          <Text style={styles.errorText}>{errors.fields.password.message}</Text>
        )}

        <Pressable
          style={[styles.primaryBtn, { opacity: isLoading || !email || !password ? 0.5 : 1 }]}
          onPress={handleEmailSignIn}
          disabled={isLoading || !email || !password}
        >
          <LinearGradient colors={[GREEN, GREEN_DARK]} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {isLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.primaryBtnText}>Sign in</Text>
            }
          </LinearGradient>
        </Pressable>

        <View style={styles.switchRow}>
          <Text style={[styles.switchText, { color: colors.mutedForeground }]}>Don't have an account? </Text>
          <Link href="/(auth)/sign-up" asChild>
            <Pressable>
              <Text style={[styles.switchLink, { color: colors.primary }]}>Sign up</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 24,
    flexGrow: 1,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
  },
  wordmark: {
    fontSize: 22,
    fontFamily: "DMSans_700Bold",
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 28,
    fontFamily: "DMSans_700Bold",
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    marginBottom: 28,
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  googleG: {
    fontSize: 16,
    fontFamily: "DMSans_700Bold",
    color: "#EA4335",
  },
  socialBtnText: {
    fontSize: 15,
    fontFamily: "DMSans_500Medium",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    paddingVertical: 13,
  },
  eyeBtn: {
    paddingLeft: 8,
  },
  errorText: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    color: "#E02020",
    marginTop: -10,
    marginBottom: 10,
  },
  primaryBtn: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 4,
    marginBottom: 20,
  },
  btnGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
    color: "#fff",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  switchText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
  },
  switchLink: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
  },
  resendBtn: {
    alignSelf: "center",
    marginTop: 16,
  },
  resendText: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
  },
});
