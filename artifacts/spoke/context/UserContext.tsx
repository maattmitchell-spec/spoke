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
  location: string;
  joinedYear: number;
}

interface UserContextType {
  profile: UserProfile | null;
  isRegistered: boolean;
  saveProfile: (p: UserProfile) => void;
  requireAccount: (onReady: () => void) => void;
}

const UserContext = createContext<UserContextType | null>(null);

const STORAGE_KEY = "spoke_user_profile";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const pendingCb = useRef<(() => void) | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setProfile(JSON.parse(raw));
    });
  }, []);

  const saveProfile = useCallback((p: UserProfile) => {
    setProfile(p);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }, []);

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
    (p: UserProfile) => {
      saveProfile(p);
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
      value={{ profile, isRegistered: !!profile, saveProfile, requireAccount }}
    >
      {children}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleDismiss}
      >
        <JoinSpokeModal onSave={handleSave} onDismiss={handleDismiss} />
      </Modal>
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
