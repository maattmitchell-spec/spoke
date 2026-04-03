import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Message {
  id: string;
  eventId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: number;
  isOwn: boolean;
}

interface ChatContextType {
  getMessages: (eventId: string) => Message[];
  sendMessage: (eventId: string, text: string) => void;
  getUnreadCount: (eventId: string) => number;
  markRead: (eventId: string) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

const STORAGE_KEY = "spoke_chat_messages";
const READ_KEY = "spoke_chat_read";

const now = Date.now();
const h = (n: number) => now - n * 3600000;

const SEED: Record<string, Omit<Message, "eventId">[]> = {
  "1": [
    { id: "s1-1", senderId: "ac", senderName: "Alex Chen", senderAvatar: "AC", text: "Forecast looks great for Saturday — marine layer should clear by 8am. Meet at Rodeo Beach parking lot.", timestamp: h(48), isOwn: false },
    { id: "s1-2", senderId: "tb", senderName: "Tom Bradley", senderAvatar: "TB", text: "Bringing the route GPX. Mapped a short 38mi bail option too if anyone needs it.", timestamp: h(24), isOwn: false },
    { id: "s1-3", senderId: "ac", senderName: "Alex Chen", senderAvatar: "AC", text: "Cafe stop at Equator in Fairfax around mile 20. Budget 20 mins ☕", timestamp: h(12), isOwn: false },
  ],
  "2": [
    { id: "s2-1", senderId: "mp", senderName: "Maya Patel", senderAvatar: "MP", text: "See everyone Sunday! Parking is free before 8am at Wildcat Canyon trailhead.", timestamp: h(30), isOwn: false },
    { id: "s2-2", senderId: "jw", senderName: "Jordan Wu", senderAvatar: "JW", text: "Should I bring the hand pump? Trail was a bit muddy last week.", timestamp: h(20), isOwn: false },
    { id: "s2-3", senderId: "mp", senderName: "Maya Patel", senderAvatar: "MP", text: "Good call Jordan — gaiters might not hurt either 😅", timestamp: h(10), isOwn: false },
  ],
  "3": [
    { id: "s3-1", senderId: "jw", senderName: "Jordan Wu", senderAvatar: "JW", text: "Permits confirmed for all 4 of us. Meet at Happy Isles trailhead at 5am sharp.", timestamp: h(72), isOwn: false },
    { id: "s3-2", senderId: "ps", senderName: "Priya Shah", senderAvatar: "PS", text: "What's the water situation on the JMT connector? Thinking of bringing the filter.", timestamp: h(48), isOwn: false },
    { id: "s3-3", senderId: "jw", senderName: "Jordan Wu", senderAvatar: "JW", text: "Bring the filter — two sources before the cables, dry after that.", timestamp: h(24), isOwn: false },
  ],
  "4": [
    { id: "s4-1", senderId: "sk", senderName: "Sarah Kim", senderAvatar: "SK", text: "Sightglass reserved the big table by the window for us. See you Wednesday!", timestamp: h(24), isOwn: false },
    { id: "s4-2", senderId: "mp", senderName: "Maya Patel", senderAvatar: "MP", text: "Anyone planning to talk through the April ride calendar? Would love to coordinate.", timestamp: h(12), isOwn: false },
    { id: "s4-3", senderId: "sk", senderName: "Sarah Kim", senderAvatar: "SK", text: "Yes! Bring ideas — we have the table from 8 to 10am.", timestamp: h(6), isOwn: false },
  ],
  "5": [
    { id: "s5-1", senderId: "tb", senderName: "Tom Bradley", senderAvatar: "TB", text: "New cue sheet uploaded. Regrouping at the Fairfax Scoop around mile 35.", timestamp: h(72), isOwn: false },
    { id: "s5-2", senderId: "ac", senderName: "Alex Chen", senderAvatar: "AC", text: "Neutral roll-out for the first 2 miles down Sir Francis Drake. No hammering before the climb 😤", timestamp: h(48), isOwn: false },
  ],
  "6": [
    { id: "s6-1", senderId: "ps", senderName: "Priya Shah", senderAvatar: "PS", text: "Full moon is 98% on Friday. Clear skies all night — this is going to be special.", timestamp: h(36), isOwn: false },
    { id: "s6-2", senderId: "jw", senderName: "Jordan Wu", senderAvatar: "JW", text: "Headlamps mandatory even with the moon — trail drops into redwoods halfway up.", timestamp: h(24), isOwn: false },
    { id: "s6-3", senderId: "ps", senderName: "Priya Shah", senderAvatar: "PS", text: "I'll bring the good thermos. Summit at midnight is going to be epic 🌕", timestamp: h(12), isOwn: false },
  ],
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [readTimestamps, setReadTimestamps] = useState<Record<string, number>>({});

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(STORAGE_KEY),
      AsyncStorage.getItem(READ_KEY),
    ]).then(([rawMsgs, rawRead]) => {
      if (rawMsgs) {
        setMessages(JSON.parse(rawMsgs));
      } else {
        const seeded: Record<string, Message[]> = {};
        Object.entries(SEED).forEach(([eventId, msgs]) => {
          seeded[eventId] = msgs.map((m) => ({ ...m, eventId }));
        });
        setMessages(seeded);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      }
      if (rawRead) setReadTimestamps(JSON.parse(rawRead));
    });
  }, []);

  const getMessages = useCallback(
    (eventId: string) => messages[eventId] ?? [],
    [messages]
  );

  const sendMessage = useCallback((eventId: string, text: string) => {
    const msg: Message = {
      id: `msg-${Date.now()}`,
      eventId,
      senderId: "you",
      senderName: "You",
      senderAvatar: "YO",
      text: text.trim(),
      timestamp: Date.now(),
      isOwn: true,
    };
    setMessages((prev) => {
      const updated = { ...prev, [eventId]: [...(prev[eventId] ?? []), msg] };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    setReadTimestamps((prev) => {
      const updated = { ...prev, [eventId]: Date.now() };
      AsyncStorage.setItem(READ_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getUnreadCount = useCallback(
    (eventId: string) => {
      const msgs = messages[eventId] ?? [];
      const lastRead = readTimestamps[eventId] ?? 0;
      return msgs.filter((m) => !m.isOwn && m.timestamp > lastRead).length;
    },
    [messages, readTimestamps]
  );

  const markRead = useCallback((eventId: string) => {
    setReadTimestamps((prev) => {
      const updated = { ...prev, [eventId]: Date.now() };
      AsyncStorage.setItem(READ_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <ChatContext.Provider value={{ getMessages, sendMessage, getUnreadCount, markRead }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
