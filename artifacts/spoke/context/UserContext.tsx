import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Modal } from "react-native";

import { JoinSpokeModal } from "@/components/JoinSpokeModal";

export interface UserProfile {
  name: string;
  email: string;
  location: string;
  joinedYear: number;
  authProvider: "email" | "google" | "apple";
}

interface UserContextType {
  profile: UserProfile | null;
  isRegistered: boolean;
  saveProfile: (p: UserProfile, password?: string) => void;
  requireAccount: (onReady: () => void) => void;
  verifySignIn: (email: string, password: string) => Promise<UserProfile | null>;
}

const UserContext = createContext<UserContextType | null>(null);

const PROFILE_KEY = "spoke_user_profile";
const PASSWORD_KEY = "spoke_user_password";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const pendingCb = useRef<(() => void) | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(PROFILE_KEY).then((raw) => {
      if (raw) setProfile(JSON.parse(raw));
    });
  }, []);

  const saveProfile = useCallback((p: UserProfile, password?: string) => {
    setProfile(p);
    AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    if (password) AsyncStorage.setItem(PASSWORD_KEY, password);
  }, []);

  const verifySignIn = useCallback(
    async (email: string, password: string): Promise<UserProfile | null> => {
      const [rawProfile, storedPw] = await Promise.all([
        AsyncStorage.getItem(PROFILE_KEY),
        AsyncStorage.getItem(PASSWORD_KEY),
      ]);
      if (!rawProfile) return null;
      const stored: UserProfile = JSON.parse(rawProfile);
      if (
        stored.email.toLowerCase() === email.toLowerCase() &&
        storedPw === password
      ) {
        return stored;
      }
      return null;
    },
    []
  );

  const requireAccount = useCallback(
    (onReady: () => void) => {
      if (profile) {
        onReady();
      } else {
        pendingCb.current = onReady;
        setModalVisible(true);
      }
    },
    [profile]
  );

  const handleSave = useCallback(
    (p: UserProfile, password?: string) => {
      saveProfile(p, password);
      setModalVisible(false);
      const cb = pendingCb.current;
      pendingCb.current = null;
      cb?.();
    },
    [saveProfile]
  );

  const handleDismiss = useCallback(() => {
    pendingCb.current = null;
    setModalVisible(false);
  }, []);

  return (
    <UserContext.Provider
      value={{
        profile,
        isRegistered: !!profile,
        saveProfile,
        requireAccount,
        verifySignIn,
      }}
    >
      {children}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleDismiss}
      >
        <JoinSpokeModal
          onSave={handleSave}
          onDismiss={handleDismiss}
          verifySignIn={verifySignIn}
        />
      </Modal>
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
