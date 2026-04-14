import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { SAMPLE_EVENTS, type Event } from "@/constants/data";

interface EventsContextType {
  events: Event[];
  toggleJoin: (eventId: string) => void;
  joinedCount: number;
  joinedEvents: Event[];
}

const EventsContext = createContext<EventsContextType | null>(null);

const STORAGE_KEY = "spoke_joined_events";

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>(SAMPLE_EVENTS);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        const joinedIds: string[] = JSON.parse(raw);
        setEvents((prev) =>
          prev.map((e) => ({ ...e, isJoined: joinedIds.includes(e.id) }))
        );
      }
    });
  }, []);

  const toggleJoin = useCallback((eventId: string) => {
    setEvents((prev) => {
      const updated = prev.map((e) => {
        if (e.id !== eventId) return e;
        const joining = !e.isJoined;
        return {
          ...e,
          isJoined: joining,
          attendees: joining ? e.attendees + 1 : e.attendees - 1,
        };
      });
      const joinedIds = updated.filter((e) => e.isJoined).map((e) => e.id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(joinedIds));
      return updated;
    });
  }, []);

  const joinedCount = events.filter((e) => e.isJoined).length;
  const joinedEvents = events.filter((e) => e.isJoined);

  return (
    <EventsContext.Provider value={{ events, toggleJoin, joinedCount, joinedEvents }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within EventsProvider");
  return ctx;
}
