import { useAuth, useUser as useClerkUser } from "@clerk/expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "expo-router";

export interface UserProfile {
  name: string;
  email: string;
  location: string;
  joinedYear: number;
  authProvider: "email" | "google" | "apple";
  avatarUri?: string;
  headerUri?: string;
  bio?: string;
}

interface UserContextType {
  profile: UserProfile | null;
  isRegistered: boolean;
  updateAvatar: (uri: string) => void;
  updateHeader: (uri: string) => void;
  updateBio: (bio: string) => void;
  requireAccount: (onReady: () => void) => void;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

const PROFILE_EXTRAS_KEY = "spoke_user_extras";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, signOut: clerkSignOut } = useAuth();
  const { user: clerkUser } = useClerkUser();
  const router = useRouter();

  const [extras, setExtras] = useState<{
    avatarUri?: string;
    headerUri?: string;
    bio?: string;
    location?: string;
  } | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(PROFILE_EXTRAS_KEY).then((raw) => {
      if (raw) setExtras(JSON.parse(raw));
      else setExtras({});
    });
  }, []);

  const saveExtras = useCallback(
    (updated: typeof extras) => {
      setExtras(updated);
      AsyncStorage.setItem(PROFILE_EXTRAS_KEY, JSON.stringify(updated));
    },
    []
  );

  const profile: UserProfile | null =
    isSignedIn && clerkUser && extras !== null
      ? {
          name:
            clerkUser.fullName ||
            clerkUser.firstName ||
            clerkUser.username ||
            clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0] ||
            "Spoke Member",
          email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
          location: extras.location ?? "",
          joinedYear: new Date(clerkUser.createdAt ?? Date.now()).getFullYear(),
          authProvider: (clerkUser.externalAccounts?.[0]?.provider as any) ?? "email",
          avatarUri: extras.avatarUri ?? clerkUser.imageUrl ?? undefined,
          headerUri: extras.headerUri,
          bio: extras.bio,
        }
      : null;

  const updateAvatar = useCallback(
    (uri: string) => {
      saveExtras({ ...extras, avatarUri: uri });
    },
    [extras, saveExtras]
  );

  const updateHeader = useCallback(
    (uri: string) => {
      saveExtras({ ...extras, headerUri: uri });
    },
    [extras, saveExtras]
  );

  const updateBio = useCallback(
    (bio: string) => {
      saveExtras({ ...extras, bio });
    },
    [extras, saveExtras]
  );

  const requireAccount = useCallback(
    (onReady: () => void) => {
      if (isSignedIn) {
        onReady();
      } else {
        router.push("/(auth)/sign-in");
      }
    },
    [isSignedIn, router]
  );

  const signOut = useCallback(async () => {
    await clerkSignOut();
    setExtras({});
    router.replace("/(auth)/sign-in");
  }, [clerkSignOut, router]);

  return (
    <UserContext.Provider
      value={{
        profile,
        isRegistered: !!profile,
        updateAvatar,
        updateHeader,
        updateBio,
        requireAccount,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
