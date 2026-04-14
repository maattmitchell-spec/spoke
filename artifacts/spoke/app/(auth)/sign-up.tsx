import { useSSO, useSignUp } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";
import * as AuthSession from "expo-auth-session";
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

export default function SignUpScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signUp, errors, fetchStatus } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [code, setCode] = React.useState("");

  // Warm up browser on Android
  useEffect(() => {
    if (Platform.OS !== "android") return;
    WebBrowser.warmUpAsync();
    return () => { WebBrowser.coolDownAsync(); };
  }, []);

  const handleSignUp = async () => {
    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) return;
    if (!error) await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === "complete") {
      await signUp.finalize({
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
  const awaitingVerification =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  if (awaitingVerification) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }]}>
        <View style={styles.logoRow}>
          <BikeWheelIcon size={28} color={GREEN} />
          <Text style={[styles.wordmark, { color: colors.foreground }]}>spoke</Text>
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>Verify your email</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          We sent a code to {email}
        </Text>
        <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.input, { color: colors.foreground }]}
            value={code}
            onChangeText={setCode}
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
          style={[styles.primaryBtn, { opacity: isLoading || !code ? 0.5 : 1 }]}
          onPress={handleVerify}
          disabled={isLoading || !code}
        >
          <LinearGradient colors={[GREEN, GREEN_DARK]} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Verify & join</Text>}
          </LinearGradient>
        </Pressable>
        <Pressable onPress={() => signUp.verifications.sendEmailCode()} style={styles.resendBtn}>
          <Text style={[styles.resendText, { color: colors.primary }]}>Resend code</Text>
        </Pressable>

        {/* Required for sign-up flows */}
        <View nativeID="clerk-captcha" />
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

        <Text style={[styles.title, { color: colors.foreground }]}>Join spoke</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Find your trail. Find your crew.
        </Text>

        {/* Google */}
        <Pressable
          style={({ pressed }) => [
            styles.oauthBtn,
            { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.75 : 1 },
          ]}
          onPress={handleGoogleSSO}
        >
          <Text style={styles.googleG}>G</Text>
          <Text style={[styles.oauthBtnText, { color: colors.foreground }]}>Continue with Google</Text>
        </Pressable>

        {/* Apple */}
        {Platform.OS === "ios" ? (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
            buttonStyle={
              colors.background === "#ffffff" || colors.background === "#FFFFFF"
                ? AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                : AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
            }
            cornerRadius={12}
            style={styles.appleNativeBtn}
            onPress={handleAppleSSO}
          />
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.oauthBtn,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.75 : 1 },
            ]}
            onPress={handleAppleSSO}
          >
            <Feather name="smartphone" size={18} color={colors.foreground} />
            <Text style={[styles.oauthBtnText, { color: colors.foreground }]}>Continue with Apple</Text>
          </Pressable>
        )}

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>or sign up with email</Text>
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
        {errors?.fields?.emailAddress && (
          <Text style={styles.errorText}>{errors.fields.emailAddress.message}</Text>
        )}

        <Text style={[styles.fieldLabel, { color: colors.foreground }]}>Password</Text>
        <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.input, { color: colors.foreground, flex: 1 }]}
            value={password}
            onChangeText={setPassword}
            placeholder="At least 8 characters"
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
          onPress={handleSignUp}
          disabled={isLoading || !email || !password}
        >
          <LinearGradient colors={[GREEN, GREEN_DARK]} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {isLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.primaryBtnText}>Create account</Text>
            }
          </LinearGradient>
        </Pressable>

        <View style={styles.switchRow}>
          <Text style={[styles.switchText, { color: colors.mutedForeground }]}>Already have an account? </Text>
          <Link href="/(auth)/sign-in" asChild>
            <Pressable>
              <Text style={[styles.switchLink, { color: colors.primary }]}>Sign in</Text>
            </Pressable>
          </Link>
        </View>

        {/* Required for sign-up flows */}
        <View nativeID="clerk-captcha" />
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
  oauthBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  googleG: {
    fontSize: 16,
    fontFamily: "DMSans_700Bold",
    color: "#EA4335",
  },
  oauthBtnText: {
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
  },
  appleNativeBtn: {
    width: "100%",
    height: 50,
    marginBottom: 12,
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
